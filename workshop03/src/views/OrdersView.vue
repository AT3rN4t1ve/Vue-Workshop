<template>
  <div>
    <PageHeader :title="isAdmin ? 'ออเดอร์' : 'ออเดอร์ของฉัน'" :subtitle="isAdmin ? 'รับออเดอร์และอัปเดตสถานะ · กดปุ่มบนการ์ดเพื่อเลื่อนสถานะ' : 'ติดตามสถานะอาหารและดูประวัติการสั่ง'">
      <v-btn-toggle v-if="isAdmin" v-model="view" mandatory rounded dense class="view-toggle">
        <v-btn value="board"><v-icon left small>mdi-view-column-outline</v-icon>บอร์ดครัว</v-btn>
        <v-btn value="table"><v-icon left small>mdi-table</v-icon>ตาราง</v-btn>
      </v-btn-toggle>
      <v-btn outlined rounded color="primary" :loading="loading" @click="load">
        <v-icon left>mdi-refresh</v-icon>
        รีเฟรช
      </v-btn>
    </PageHeader>

    <v-row dense class="mb-3">
      <v-col v-for="stat in stats" :key="stat.label" cols="6" md="3">
        <StatCard v-bind="stat" />
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" text class="mb-4">{{ error }}</v-alert>

    <v-card class="surface-card">
      <v-row dense class="pa-4">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            label="ค้นหาออเดอร์"
            :placeholder="isAdmin ? 'เลขที่ ชื่อเมนู หรือผู้สั่ง' : 'เลขที่ หรือชื่อเมนู'"
            prepend-inner-icon="mdi-magnify"
            outlined
            dense
            hide-details
            clearable
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="productId"
            :items="productOptions"
            label="เมนู"
            outlined
            dense
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="status"
            :items="statusOptions"
            label="สถานะ"
            outlined
            dense
            hide-details
          />
        </v-col>
      </v-row>

      <template v-if="isAdmin && view === 'table'">
        <v-divider />
        <OrderTable
          :orders="visibleOrders"
          :search="search || ''"
          :loading="loading"
          :admin="isAdmin"
          :updating-id="updatingId"
          @change-status="changeStatus"
        />
      </template>
    </v-card>

    <OrderBoard
      v-if="isAdmin && view === 'board'"
      :orders="searchedOrders"
      :loading="loading"
      :updating-id="updatingId"
      class="mt-5"
      @change-status="changeStatus"
    />

    <div v-if="!isAdmin" class="mt-6">
      <template v-if="loading">
        <v-skeleton-loader v-for="n in 2" :key="n" type="article" class="surface-card mb-4" />
      </template>

      <template v-else>
        <section v-if="customerOrders.active.length" class="orders-section">
          <h2 class="orders-section__title">กำลังดำเนินการ</h2>
          <OrderCard
            v-for="order in customerOrders.active"
            :key="order._id"
            :order="order"
            :updating="updatingId === order._id"
            @change-status="changeStatus"
          />
        </section>

        <section v-if="customerOrders.past.length" class="orders-section">
          <h2 class="orders-section__title">ออเดอร์ก่อนหน้า</h2>
          <OrderCard v-for="order in customerOrders.past" :key="order._id" :order="order" />
        </section>

        <v-card v-if="!customerOrders.active.length && !customerOrders.past.length" class="surface-card">
          <EmptyState
            icon="mdi-clipboard-text-outline"
            :title="orders.length ? 'ไม่พบออเดอร์ที่ค้นหา' : 'ยังไม่มีออเดอร์'"
            :text="orders.length ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง' : 'สั่งอาหารจานแรก แล้วติดตามสถานะได้ที่นี่'"
          >
            <v-btn v-if="!orders.length" depressed rounded large color="primary" to="/">ไปเลือกเมนู</v-btn>
          </EmptyState>
        </v-card>
      </template>
    </div>

    <ConfirmDialog
      v-model="cancelDialog"
      title="ยกเลิกออเดอร์"
      confirm-text="ยกเลิกออเดอร์"
      color="error"
      :loading="!!updatingId"
      @confirm="confirmCancel"
    >
      ต้องการยกเลิกออเดอร์ <strong>{{ cancelling ? cancelling.productName : '' }}</strong>
      จำนวน {{ cancelling ? cancelling.quantity : 0 }} จาน ใช่หรือไม่ ยกเลิกแล้วเปลี่ยนกลับไม่ได้
    </ConfirmDialog>
  </div>
</template>

<script>
import orderService from '../services/orderService'
import productService from '../services/productService'
import { ORDER_STATUS, orderStatus } from '../utils/constants'
import { formatNumber, formatPrice } from '../utils/format'
import { toOrderRow, matchesOrder, byNewest, ACTIVE_STATUSES, CANCELLABLE_STATUSES } from '../utils/orderRows'
import PageHeader from '../components/common/PageHeader.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import EmptyState from '../components/common/EmptyState.vue'
import StatCard from '../components/admin/StatCard.vue'
import OrderTable from '../components/admin/OrderTable.vue'
import OrderBoard from '../components/order/OrderBoard.vue'
import OrderCard from '../components/order/OrderCard.vue'

const ALL = 'all'

export default {
  name: 'OrdersView',
  components: { PageHeader, ConfirmDialog, EmptyState, StatCard, OrderTable, OrderBoard, OrderCard },
  data: () => ({
    view: 'board',
    orders: [],
    products: [],
    loading: true,
    error: '',
    search: '',
    productId: ALL,
    status: ALL,
    updatingId: null,
    cancelDialog: false,
    cancelling: null,
  }),
  computed: {
    isAdmin() {
      return this.$store.getters['auth/isAdmin']
    },
    productOptions() {
      return [
        { text: 'ทุกเมนู', value: ALL },
        ...this.products.map((product) => ({ text: product.name, value: product._id })),
      ]
    },
    statusOptions() {
      return [
        { text: 'ทุกสถานะ', value: ALL },
        ...Object.keys(ORDER_STATUS).map((value) => ({ text: ORDER_STATUS[value].text, value })),
      ]
    },
    visibleOrders() {
      return this.orders
        .filter((order) => this.productId === ALL || (order.product && order.product._id === this.productId))
        .filter((order) => this.status === ALL || order.status === this.status)
    },
    // ตารางค้นหาเองผ่าน v-data-table ส่วนบอร์ดและการ์ดใช้ตัวกรองนี้
    searchedOrders() {
      return this.visibleOrders.filter((order) => matchesOrder(toOrderRow(order, this.isAdmin), this.search))
    },
    customerOrders() {
      const rows = this.searchedOrders.map((order) => toOrderRow(order, false)).sort(byNewest)
      return {
        active: rows.filter((row) => ACTIVE_STATUSES.includes(row.status)),
        past: rows.filter((row) => !ACTIVE_STATUSES.includes(row.status)),
      }
    },
    stats() {
      const active = this.visibleOrders.filter((order) => order.status !== 'cancelled')
      const waiting = active.filter((order) => CANCELLABLE_STATUSES.includes(order.status)).length
      const quantity = active.reduce((sum, order) => sum + order.quantity, 0)
      const revenue = active.reduce((sum, order) => sum + order.totalPrice, 0)
      return [
        { label: 'จำนวนออเดอร์', value: formatNumber(this.visibleOrders.length), icon: 'mdi-clipboard-text-outline' },
        { label: 'รอรับ / กำลังทำ', value: formatNumber(waiting), icon: 'mdi-clock-outline', color: '#7A4F00', tint: '#FFF4D6' },
        { label: this.isAdmin ? 'ขายได้ (จาน)' : 'สั่งไปแล้ว (จาน)', value: formatNumber(quantity), icon: 'mdi-food-outline', color: '#1F55C7', tint: '#E8F0FF' },
        { label: this.isAdmin ? 'ยอดขายรวม' : 'ยอดสั่งรวม', value: formatPrice(revenue), icon: 'mdi-cash-multiple', color: '#17663F', tint: '#E3F4EA' },
      ]
    },
  },
  created() {
    this.load()
  },
  methods: {
    notify(text, color = 'success') {
      this.$store.dispatch('ui/notify', { text, color })
    },
    async load() {
      this.loading = true
      this.error = ''
      try {
        const [orders, products] = await Promise.all([orderService.getAll(), productService.getAll()])
        this.orders = orders
        this.products = products
      } catch (e) {
        this.error = e.message || 'โหลดออเดอร์ไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },
    changeStatus({ order, status }) {
      if (status === 'cancelled') {
        this.cancelling = order
        this.cancelDialog = true
        return
      }
      this.updateStatus(order, status)
    },
    async confirmCancel() {
      await this.updateStatus(this.cancelling, 'cancelled')
      this.cancelDialog = false
    },
    async updateStatus(order, status) {
      this.updatingId = order._id
      try {
        const updated = await orderService.updateStatus(order._id, status)
        this.orders = this.orders.map((current) => (current._id === updated._id ? updated : current))
        this.notify(`เปลี่ยนสถานะเป็น "${orderStatus(updated.status).text}" แล้ว`)
      } catch (e) {
        this.notify(e.message || 'เปลี่ยนสถานะไม่สำเร็จ', 'error')
        await this.load()
      } finally {
        this.updatingId = null
      }
    },
  },
}
</script>

<style scoped>
.view-toggle {
  border: 1px solid var(--app-border-strong);
}
.orders-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}
.orders-section__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
