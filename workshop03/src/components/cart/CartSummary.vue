<template>
  <v-card class="surface-card pa-5 cart-summary">
    <h2 class="cart-summary__title">สรุปคำสั่งซื้อ</h2>

    <div class="d-flex justify-space-between text-body-2 mb-2">
      <span class="grey--text text--darken-1">จำนวน</span>
      <span class="tabular">{{ count | number }} จาน</span>
    </div>

    <v-divider class="my-4 cart-summary__divider" />

    <div class="d-flex justify-space-between align-center mb-5">
      <span class="font-weight-medium">ยอดรวมทั้งหมด</span>
      <span class="cart-summary__total tabular">{{ total | price }}</span>
    </div>

    <v-btn color="primary" block x-large rounded depressed class="cart-summary__checkout" :loading="loading" :disabled="disabled" @click="$emit('checkout')">
      ยืนยันสั่งอาหาร
    </v-btn>
    <div v-if="disabled && hint" class="text-caption error--text text-center mt-2">{{ hint }}</div>

    <v-btn text block rounded class="mt-2" to="/" :disabled="loading">+ เลือกเมนูเพิ่ม</v-btn>
    <p class="cart-summary__note">กดยืนยันแล้วติดตามสถานะได้ที่ “ออเดอร์ของฉัน”</p>
  </v-card>
</template>

<script>
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
  top: 92px;
  padding: 24px !important;
  box-shadow: var(--shadow-md) !important;
}
.cart-summary__title {
  margin: 0 0 16px;
  font-size: 1.25rem;
  font-weight: 600;
}
.cart-summary__divider {
  border-style: dashed;
  border-color: var(--app-border-strong) !important;
}
.cart-summary__checkout {
  box-shadow: var(--shadow-primary) !important;
}
.cart-summary__note {
  margin: 8px 0 0;
  font-size: 0.8rem;
  text-align: center;
  color: var(--app-text-muted);
}
.cart-summary__total {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--v-primary-base);
}
</style>
