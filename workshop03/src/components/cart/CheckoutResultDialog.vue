<template>
  <v-dialog :value="value" max-width="480" @input="$emit('input', $event)">
    <v-card class="pa-6 text-center result-card">
      <v-avatar :color="allSuccess ? '#E3F4EA' : '#FFF4D6'" size="96" class="mb-3 mt-2">
        <v-icon size="40" :color="allSuccess ? 'success' : 'warning'">
          {{ allSuccess ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}
        </v-icon>
      </v-avatar>

      <div class="result-title mb-1">
        {{ allSuccess ? 'ส่งออเดอร์ให้ร้านแล้ว' : 'สั่งได้บางรายการ' }}
      </div>
      <div class="text-body-2 grey--text text--darken-1 mb-4">
        สำเร็จ {{ orders.length }} รายการ
        <span v-if="orders.length">· ยอดรวม {{ total | price }}</span>
      </div>

      <v-alert v-for="(item, index) in failed" :key="index" type="error" text dense class="text-left text-body-2">
        <strong>{{ item.name }}</strong> — {{ item.message }}
      </v-alert>

      <v-card-actions class="justify-center flex-wrap result-actions">
        <v-btn outlined rounded large @click="$emit('input', false)">ปิด</v-btn>
        <v-btn color="primary" depressed rounded large to="/orders">ติดตามออเดอร์</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CheckoutResultDialog',
  props: {
    value: { type: Boolean, default: false },
    orders: { type: Array, default: () => [] },
    failed: { type: Array, default: () => [] },
  },
  computed: {
    allSuccess() {
      return this.failed.length === 0
    },
    total() {
      return this.orders.reduce((sum, order) => sum + order.totalPrice, 0)
    },
  },
}
</script>

<style scoped>
.result-card {
  border-radius: var(--radius-lg) !important;
}
.result-title {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 600;
}
.result-actions {
  gap: 8px;
}
</style>
