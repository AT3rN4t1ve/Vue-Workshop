<template>
  <div>
    <PageHeader title="คำสั่งซื้อ" subtitle="รายการ Order ทั้งหมดของร้าน">
      <v-btn outlined color="primary" :loading="loading" @click="load">
        <v-icon left>mdi-refresh</v-icon>
        รีเฟรช
      </v-btn>
    </PageHeader>

    <v-row dense class="mb-3">
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="4">
        <StatCard v-bind="stat" />
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" text class="mb-4">{{ error }}</v-alert>

    <v-card class="surface-card">
      <v-row dense class="pa-4">
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="search"
            label="ค้นหาคำสั่งซื้อ"
            placeholder="เลขที่ ชื่อสินค้า หรือผู้สั่ง"
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
            label="สินค้า"
            outlined
            dense
            hide-details
          />
        </v-col>
      </v-row>
      <v-divider />
      <OrderTable :orders="visibleOrders" :search="search || ''" :loading="loading" />
    </v-card>
  </div>
</template>

<script>
import orderService from '../../services/orderService'
import productService from '../../services/productService'
import { formatNumber, formatPrice } from '../../utils/format'
import PageHeader from '../../components/common/PageHeader.vue'
import StatCard from '../../components/admin/StatCard.vue'
import OrderTable from '../../components/admin/OrderTable.vue'

const ALL = 'all'

// หน้าจัดการ Order: สรุปยอด + ตาราง Order ค้นหาและกรองตามสินค้าได้
export default {
  name: 'ManageOrdersView',
  components: { PageHeader, StatCard, OrderTable },
  data: () => ({
    orders: [],
    products: [],
    loading: true,
    error: '',
    search: '',
    productId: ALL,
  }),
  computed: {
    productOptions() {
      return [
        { text: 'สินค้าทั้งหมด', value: ALL },
        ...this.products.map((product) => ({ text: product.name, value: product._id })),
      ]
    },
    visibleOrders() {
      if (this.productId === ALL) return this.orders
      return this.orders.filter((order) => order.product && order.product._id === this.productId)
    },
    // ตัวเลขสรุปคิดจากรายการที่กรองตามสินค้าอยู่
    stats() {
      const quantity = this.visibleOrders.reduce((sum, order) => sum + order.quantity, 0)
      const revenue = this.visibleOrders.reduce((sum, order) => sum + order.totalPrice, 0)
      return [
        { label: 'จำนวนคำสั่งซื้อ', value: formatNumber(this.visibleOrders.length), icon: 'mdi-clipboard-text-outline' },
        { label: 'สินค้าที่ขายได้ (ชิ้น)', value: formatNumber(quantity), icon: 'mdi-package-variant', color: '#2F6FED', tint: '#E8F3FF' },
        { label: 'ยอดขายรวม', value: formatPrice(revenue), icon: 'mdi-cash-multiple', color: '#1E8E5A', tint: '#E6F5EC' },
      ]
    },
  },
  created() {
    this.load()
  },
  methods: {
    async load() {
      this.loading = true
      this.error = ''
      try {
        const [orders, products] = await Promise.all([orderService.getAll(), productService.getAll()])
        this.orders = orders
        this.products = products
      } catch (e) {
        this.error = e.message || 'โหลดคำสั่งซื้อไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
