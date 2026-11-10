<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :search="search"
    :loading="loading"
    :items-per-page="10"
    :footer-props="{ 'items-per-page-text': 'แถวต่อหน้า', 'items-per-page-options': [10, 25, 50, -1] }"
    item-key="_id"
    mobile-breakpoint="0"
    sort-by="createdAt"
    sort-desc
    loading-text="กำลังโหลดข้อมูล..."
    no-data-text="ยังไม่มีคำสั่งซื้อ"
    no-results-text="ไม่พบคำสั่งซื้อที่ค้นหา"
  >
    <template #[`item.code`]="{ item }">
      <span class="order-code">#{{ item.code }}</span>
    </template>

    <template #[`item.productName`]="{ item }">
      <div class="d-flex align-center py-2">
        <div class="order-table__thumb mr-3 flex-shrink-0">
          <ProductThumb :name="item.productName" font-size="1rem" />
        </div>
        <div>
          <div class="font-weight-medium">{{ item.productName }}</div>
          <div v-if="item.productDeleted" class="text-caption error--text">สินค้าถูกลบแล้ว</div>
        </div>
      </div>
    </template>

    <template #[`item.quantity`]="{ item }">
      <span class="tabular">{{ item.quantity | number }}</span>
    </template>

    <template #[`item.unitPrice`]="{ item }">
      <span class="tabular">{{ item.unitPrice | price }}</span>
    </template>

    <template #[`item.totalPrice`]="{ item }">
      <span class="tabular font-weight-medium">{{ item.totalPrice | price }}</span>
    </template>

    <template #[`item.createdAt`]="{ item }">
      <span class="text-body-2">{{ item.createdAt | date }}</span>
    </template>
  </v-data-table>
</template>

<script>
import ProductThumb from '../common/ProductThumb.vue'

// ตาราง Order (อ่านอย่างเดียว) รับ orders รูปแบบเดียวกับ API: product / user ถูก populate มาแล้ว
export default {
  name: 'OrderTable',
  components: { ProductThumb },
  props: {
    orders: { type: Array, default: () => [] },
    search: { type: String, default: '' },
    loading: { type: Boolean, default: false },
  },
  data: () => ({
    headers: [
      { text: 'เลขที่', value: 'code', sortable: false, width: 110 },
      { text: 'สินค้า', value: 'productName' },
      { text: 'ผู้สั่ง', value: 'customer' },
      { text: 'จำนวน', value: 'quantity', align: 'end', width: 90 },
      { text: 'ราคา/ชิ้น', value: 'unitPrice', align: 'end', width: 120 },
      { text: 'ยอดรวม', value: 'totalPrice', align: 'end', width: 130 },
      { text: 'วันที่สั่ง', value: 'createdAt', width: 190 },
    ],
  }),
  computed: {
    // แปลงเป็นแถวแบนๆ ให้ตารางค้นหา/เรียงได้ง่าย
    rows() {
      return this.orders.map((order) => {
        const user = order.user || {}
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')
        return {
          ...order,
          code: String(order._id).slice(-6).toUpperCase(),
          productName: order.product ? order.product.name : order.productName || 'ไม่ทราบชื่อสินค้า',
          productDeleted: !order.product,
          customer: fullName || user.username || '-',
        }
      })
    },
  },
}
</script>

<style scoped>
.order-table__thumb {
  width: 38px;
}
.order-code {
  font-family: 'Roboto Mono', Consolas, monospace;
  font-size: 0.85rem;
  color: #4b5563;
}
</style>
