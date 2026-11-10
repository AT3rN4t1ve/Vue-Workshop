<template>
  <div>
    <PageHeader :title="isAdmin ? 'ออเดอร์' : 'ออเดอร์ของฉัน'" :subtitle="isAdmin ? 'ออเดอร์ทั้งหมดของร้าน รับออเดอร์และอัปเดตสถานะได้ที่นี่' : 'ประวัติและสถานะออเดอร์ของคุณ'">
      <v-btn outlined color="primary" :loading="loading" @click="load">
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
      <v-divider />
      <OrderTable
        :orders="visibleOrders"
        :search="search || ''"
        :loading="loading"
        :admin="isAdmin"
        :updating-id="updatingId"
        @change-status="changeStatus"
      />
    </v-card>

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
import PageHeader from '../components/common/PageHeader.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import StatCard from '../components/admin/StatCard.vue'
import OrderTable from '../components/admin/OrderTable.vue'

const ALL = 'all'

// หน้าคำสั่งซื้อ: สรุปยอด + ตาราง Order ค้นหา กรองตามสินค้า/สถานะ และเปลี่ยนสถานะ
// admin เห็น Order ของทุกคนและเดินสถานะได้ ส่วน user เห็นเฉพาะของตัวเองและยกเลิกได้ก่อนร้านรับ
// (Back-end เป็นคนกรองและตรวจสิทธิ์)
export default {
  name: 'OrdersView',
  components: { PageHeader, ConfirmDialog, StatCard, OrderTable },
  data: () => ({
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
    // ตัวเลขสรุปคิดจากรายการที่กรองอยู่ ยอดขายไม่นับ Order ที่ยกเลิก
    stats() {
      const active = this.visibleOrders.filter((order) => order.status !== 'cancelled')
      const waiting = active.filter((order) => order.status !== 'done').length
      const quantity = active.reduce((sum, order) => sum + order.quantity, 0)
      const revenue = active.reduce((sum, order) => sum + order.totalPrice, 0)
      return [
        { label: 'จำนวนออเดอร์', value: formatNumber(this.visibleOrders.length), icon: 'mdi-clipboard-text-outline' },
        { label: 'รอรับ / กำลังทำ', value: formatNumber(waiting), icon: 'mdi-clock-outline', color: '#C98A00', tint: '#FFF8E1' },
        { label: this.isAdmin ? 'ขายได้ (จาน)' : 'สั่งไปแล้ว (จาน)', value: formatNumber(quantity), icon: 'mdi-food-outline', color: '#2F6FED', tint: '#E8F3FF' },
        { label: this.isAdmin ? 'ยอดขายรวม' : 'ยอดสั่งรวม', value: formatPrice(revenue), icon: 'mdi-cash-multiple', color: '#1E8E5A', tint: '#E6F5EC' },
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
    // การยกเลิกย้อนกลับไม่ได้ จึงถามยืนยันก่อน ส่วนการเดินสถานะทำได้ทันที
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
        // สถานะอาจถูกคนอื่นเปลี่ยนไปก่อนแล้ว โหลดใหม่ให้ตรงกับ Back-end
        await this.load()
      } finally {
        this.updatingId = null
      }
    },
  },
}
</script>
