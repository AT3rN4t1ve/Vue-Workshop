<template>
  <v-card class="surface-card pa-5 cart-summary">
    <div class="text-subtitle-1 font-weight-bold mb-4">สรุปคำสั่งซื้อ</div>

    <div class="d-flex justify-space-between text-body-2 mb-2">
      <span class="grey--text text--darken-1">จำนวนสินค้า</span>
      <span class="tabular">{{ count | number }} ชิ้น</span>
    </div>
    <div class="d-flex justify-space-between text-body-2 mb-2">
      <span class="grey--text text--darken-1">ค่าจัดส่ง</span>
      <span class="success--text">ฟรี</span>
    </div>

    <v-divider class="my-4" />

    <div class="d-flex justify-space-between align-center mb-5">
      <span class="font-weight-medium">ยอดรวมทั้งหมด</span>
      <span class="cart-summary__total tabular">{{ total | price }}</span>
    </div>

    <v-btn color="primary" block large depressed :loading="loading" :disabled="disabled" @click="$emit('checkout')">
      สั่งซื้อสินค้า
    </v-btn>
    <div v-if="disabled && hint" class="text-caption error--text text-center mt-2">{{ hint }}</div>

    <v-btn text block class="mt-2" to="/" :disabled="loading">เลือกซื้อสินค้าต่อ</v-btn>
  </v-card>
</template>

<script>
// กล่องสรุปยอดและปุ่มสั่งซื้อ (emit 'checkout')
export default {
  name: 'CartSummary',
  props: {
    count: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    hint: { type: String, default: '' },
  },
}
</script>

<style scoped>
.cart-summary {
  position: sticky;
  top: 88px;
}
.cart-summary__total {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e4572e;
}
</style>
