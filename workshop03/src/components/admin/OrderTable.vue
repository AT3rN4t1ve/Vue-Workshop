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
    no-data-text="ยังไม่มีออเดอร์"
    no-results-text="ไม่พบออเดอร์ที่ค้นหา"
  >
    <template #[`item.code`]="{ item }">
      <span class="order-code">#{{ item.code }}</span>
    </template>

    <template #[`item.productName`]="{ item }">
      <div class="d-flex align-center py-2">
        <div class="order-table__thumb mr-3 flex-shrink-0">
          <ProductThumb :name="item.productName" :src="item.imageUrl" font-size="1rem" />
        </div>
        <div class="order-table__text">
          <div class="font-weight-medium">{{ item.productName }}</div>
          <div v-if="item.optionsText" class="text-caption grey--text text--darken-2">{{ item.optionsText }}</div>
          <div v-if="item.note" class="text-caption grey--text text--darken-2">หมายเหตุ: {{ item.note }}</div>
          <div v-if="item.productDeleted" class="text-caption error--text">เมนูนี้ถูกลบแล้ว</div>
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

    <template #[`item.statusText`]="{ item }">
      <v-chip small :color="item.statusInfo.tint" :style="{ color: item.statusInfo.color }" class="font-weight-medium">
        <v-icon left small :color="item.statusInfo.color">{{ item.statusInfo.icon }}</v-icon>
        {{ item.statusText }}
      </v-chip>
    </template>

    <template #[`item.createdAt`]="{ item }">
      <span class="text-body-2">{{ item.createdAt | date }}</span>
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="d-flex align-center justify-end order-table__actions">
        <v-btn
          v-if="item.next"
          small
          depressed
          color="primary"
          :loading="updatingId === item._id"
          :disabled="!!updatingId"
          @click="$emit('change-status', { order: item, status: item.next.status })"
        >
          {{ item.next.text }}
        </v-btn>
        <v-btn
          v-if="item.canCancel"
          small
          text
          color="error"
          :disabled="!!updatingId"
          @click="$emit('change-status', { order: item, status: 'cancelled' })"
        >
          ยกเลิก
        </v-btn>
        <span v-if="!item.next && !item.canCancel" class="grey--text">-</span>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import { orderStatus } from '../../utils/constants'
import { optionsText } from '../../utils/options'
import ProductThumb from '../common/ProductThumb.vue'

const NEXT_STEP = {
  pending: { status: 'cooking', text: 'รับออเดอร์' },
  cooking: { status: 'done', text: 'เสร็จแล้ว' },
}

export default {
  name: 'OrderTable',
  components: { ProductThumb },
  props: {
    orders: { type: Array, default: () => [] },
    search: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
    updatingId: { type: String, default: null },
  },
  data: () => ({
    allHeaders: [
      { text: 'เลขที่', value: 'code', sortable: false, width: 110 },
      { text: 'เมนู', value: 'productName' },
      { text: 'ผู้สั่ง', value: 'customer' },
      { text: 'จำนวน', value: 'quantity', align: 'end', width: 90 },
      { text: 'ราคา/จาน', value: 'unitPrice', align: 'end', width: 120 },
      { text: 'ยอดรวม', value: 'totalPrice', align: 'end', width: 130 },
      { text: 'สถานะ', value: 'statusText', width: 150 },
      { text: 'วันที่สั่ง', value: 'createdAt', width: 180 },
      { text: 'จัดการ', value: 'actions', sortable: false, align: 'end', width: 190 },
    ],
  }),
  computed: {
    headers() {
      return this.admin ? this.allHeaders : this.allHeaders.filter((header) => header.value !== 'customer')
    },
    rows() {
      return this.orders.map((order) => {
        const user = order.user || {}
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')
        const statusInfo = orderStatus(order.status)
        return {
          ...order,
          code: String(order._id).slice(-6).toUpperCase(),
          productName: order.product ? order.product.name : order.productName || 'ไม่ทราบชื่อเมนู',
          imageUrl: order.product ? order.product.imageUrl : '',
          productDeleted: !order.product,
          optionsText: optionsText(order.options),
          customer: fullName || user.email || '-',
          statusInfo,
          statusText: statusInfo.text,
          next: this.admin ? NEXT_STEP[order.status] : null,
          canCancel: this.admin ? ['pending', 'cooking'].includes(order.status) : order.status === 'pending',
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
.order-table__text {
  min-width: 160px;
  max-width: 360px;
}
.order-table__actions {
  gap: 4px;
  white-space: nowrap;
}
.order-code {
  font-family: 'Roboto Mono', Consolas, monospace;
  font-size: 0.85rem;
  color: var(--app-text-muted);
}
</style>
