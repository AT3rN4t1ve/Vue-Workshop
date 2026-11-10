<template>
  <v-data-table
    :headers="headers"
    :items="products"
    :loading="loading"
    :items-per-page="10"
    :footer-props="{ 'items-per-page-text': 'แถวต่อหน้า', 'items-per-page-options': [10, 25, 50, -1] }"
    item-key="_id"
    mobile-breakpoint="0"
    loading-text="กำลังโหลดข้อมูล..."
    no-data-text="ไม่พบสินค้า"
    class="product-table"
  >
    <template #[`item.name`]="{ item }">
      <div class="d-flex align-center py-2">
        <div class="product-table__thumb mr-3 flex-shrink-0">
          <ProductThumb :name="item.name" font-size="1.1rem" />
        </div>
        <div class="product-table__text">
          <div class="font-weight-medium">{{ item.name }}</div>
          <div class="text-caption grey--text text--darken-1 text-truncate">{{ item.description || '-' }}</div>
        </div>
      </div>
    </template>

    <template #[`item.price`]="{ item }">
      <span class="tabular">{{ item.price | price }}</span>
    </template>

    <template #[`item.stock`]="{ item }">
      <span class="tabular">{{ item.stock | number }}</span>
    </template>

    <template #[`item.status`]="{ item }">
      <StockChip :stock="item.stock" />
    </template>

    <template #[`item.actions`]="{ item }">
      <v-btn icon small :aria-label="`แก้ไข ${item.name}`" @click="$emit('edit', item)">
        <v-icon small>mdi-pencil-outline</v-icon>
      </v-btn>
      <v-btn icon small color="error" :aria-label="`ลบ ${item.name}`" @click="$emit('delete', item)">
        <v-icon small>mdi-trash-can-outline</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import ProductThumb from '../common/ProductThumb.vue'
import StockChip from '../common/StockChip.vue'

// ตารางสินค้าในหน้าจัดการ emit 'edit' / 'delete' พร้อมสินค้าแถวนั้น
export default {
  name: 'ProductTable',
  components: { ProductThumb, StockChip },
  props: {
    products: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  data: () => ({
    headers: [
      { text: 'สินค้า', value: 'name' },
      { text: 'ราคา', value: 'price', align: 'end', width: 130 },
      { text: 'คงเหลือ', value: 'stock', align: 'end', width: 110 },
      { text: 'สถานะ', value: 'status', sortable: false, width: 140 },
      { text: 'จัดการ', value: 'actions', sortable: false, align: 'center', width: 110 },
    ],
  }),
}
</script>

<style scoped>
.product-table__thumb {
  width: 44px;
}
.product-table__text {
  min-width: 160px;
  max-width: 420px;
}
</style>
