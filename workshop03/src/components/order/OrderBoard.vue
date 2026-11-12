<template>
  <div class="order-board">
    <section v-for="column in columns" :key="column.key" class="order-board__col" :aria-label="column.title">
      <header class="order-board__col-head">
        <span class="order-board__col-title">
          <span class="order-board__dot" :style="{ background: column.dot }" />
          {{ column.title }}
        </span>
        <span class="order-board__count tabular">{{ column.items.length }}</span>
      </header>

      <template v-if="loading">
        <v-skeleton-loader v-for="n in 2" :key="n" type="list-item-three-line" class="order-board__card" />
      </template>

      <div v-else-if="column.items.length === 0" class="order-board__empty">{{ column.empty }}</div>

      <template v-else>
      <article
        v-for="order in column.items"
        :key="order._id"
        class="order-board__card"
      >
        <div class="order-board__row">
          <span class="order-board__code">#{{ order.code }}</span>
          <span class="order-board__time">{{ order.createdAt | date }}</span>
        </div>
        <div class="order-board__customer">{{ order.customer }}</div>
        <div class="order-board__item">
          <span class="tabular">{{ order.quantity | number }}×</span> {{ order.productName }}
        </div>
        <div v-if="order.optionsText" class="order-board__sub">{{ order.optionsText }}</div>
        <div v-if="order.note" class="order-board__note">หมายเหตุ: {{ order.note }}</div>
        <div class="order-board__row order-board__row--foot">
          <span class="order-board__total tabular">{{ order.totalPrice | price }}</span>
          <v-btn
            v-if="order.canCancel"
            small
            text
            rounded
            color="error"
            :disabled="!!updatingId"
            @click="$emit('change-status', { order, status: 'cancelled' })"
          >
            ยกเลิก
          </v-btn>
        </div>
        <v-btn
          v-if="order.next"
          block
          depressed
          rounded
          :color="column.action.color"
          :loading="updatingId === order._id"
          :disabled="!!updatingId"
          @click="$emit('change-status', { order, status: order.next.status })"
        >
          <v-icon left small>{{ column.action.icon }}</v-icon>
          {{ column.action.text }}
        </v-btn>
      </article>
      </template>

      <div v-if="column.hidden > 0" class="order-board__more">และอีก {{ column.hidden }} รายการ (ดูได้ในมุมมองตาราง)</div>
    </section>
  </div>
</template>

<script>
import { toOrderRow, byNewest } from '../../utils/orderRows'

const ACTIONS = {
  pending: { text: 'รับออเดอร์ · เริ่มทำ', color: 'primary', icon: 'mdi-pot-steam-outline' },
  cooking: { text: 'ทำเสร็จแล้ว', color: 'info', icon: 'mdi-check' },
  done: { text: 'ส่งให้ลูกค้า', color: 'success', icon: 'mdi-moped-outline' },
}

export default {
  name: 'OrderBoard',
  props: {
    orders: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    updatingId: { type: String, default: null },
  },
  computed: {
    columns() {
      const rows = this.orders.map((order) => toOrderRow(order, true))
      const pick = (status) => rows.filter((row) => row.status === status)
      const oldestFirst = (a, b) => -byNewest(a, b)
      // ออเดอร์ที่ส่งแล้วจะออกจากบอร์ด ดูย้อนหลังได้ในมุมมองตาราง
      return [
        { key: 'pending', title: 'รอรับออเดอร์', dot: '#E9A23B', empty: 'ยังไม่มีออเดอร์ใหม่' },
        { key: 'cooking', title: 'กำลังทำ', dot: '#1F55C7', empty: 'ยังไม่มีออเดอร์ที่กำลังทำ' },
        { key: 'done', title: 'เสร็จแล้ว รอส่ง', dot: '#6B3FA0', empty: 'ยังไม่มีออเดอร์ที่รอส่ง' },
      ].map((column) => ({
        ...column,
        action: ACTIONS[column.key],
        items: pick(column.key).sort(oldestFirst),
        hidden: 0,
      }))
    },
  },
}
</script>

<style scoped>
.order-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  align-items: start;
}
.order-board__col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 320px;
  padding: 14px;
  border-radius: var(--radius-lg);
  background: var(--app-surface-muted);
}
.order-board__col-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 4px;
}
.order-board__col-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 600;
}
.order-board__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.order-board__count {
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-pill);
  background: var(--app-surface);
  font-size: 0.85rem;
  font-weight: 600;
}
.order-board__empty,
.order-board__more {
  padding: 16px 8px;
  text-align: center;
  font-size: 0.875rem;
  color: var(--app-text-muted);
}
.order-board__card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  border-radius: 16px;
  background: var(--app-surface);
  box-shadow: var(--shadow-sm);
}
.order-board__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.order-board__row--foot {
  align-items: center;
  margin-top: 4px;
}
.order-board__code {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 600;
}
.order-board__time,
.order-board__customer,
.order-board__sub {
  font-size: 0.85rem;
  color: var(--app-text-muted);
}
.order-board__item {
  font-weight: 600;
}
.order-board__note {
  padding: 6px 8px;
  border-radius: var(--radius-sm);
  background: #fff4d6;
  color: #7a4f00;
  font-size: 0.85rem;
}
.order-board__total {
  font-family: var(--font-heading);
  font-weight: 600;
}
</style>
