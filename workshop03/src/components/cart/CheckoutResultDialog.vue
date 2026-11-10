<template>
  <v-dialog :value="value" max-width="480" @input="$emit('input', $event)">
    <v-card class="pa-4 text-center">
      <v-avatar :color="allSuccess ? '#E6F5EC' : '#FFF4DC'" size="72" class="mb-3 mt-2">
        <v-icon size="40" :color="allSuccess ? 'success' : 'warning'">
          {{ allSuccess ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}
        </v-icon>
      </v-avatar>

      <div class="text-h6 font-weight-bold mb-1">
        {{ allSuccess ? 'สั่งซื้อสำเร็จ' : 'สั่งซื้อได้บางรายการ' }}
      </div>
      <div class="text-body-2 grey--text text--darken-1 mb-4">
        สำเร็จ {{ orders.length }} รายการ
        <span v-if="orders.length">· ยอดรวม {{ total | price }}</span>
      </div>

      <v-alert v-for="item in failed" :key="item.name" type="error" text dense class="text-left text-body-2">
        <strong>{{ item.name }}</strong> — {{ item.message }}
      </v-alert>

      <v-card-actions class="justify-center flex-wrap">
        <v-btn text @click="$emit('input', false)">ปิด</v-btn>
        <v-btn color="primary" depressed to="/admin/orders">ดูคำสั่งซื้อ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// แสดงผลหลังกดสั่งซื้อ: orders = รายการที่สำเร็จ, failed = [{ name, message }]
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
