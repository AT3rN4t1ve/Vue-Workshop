<template>
  <article class="order-card surface-card" :class="{ 'order-card--active': active, 'order-card--compact': !active }">
    <header class="order-card__head">
      <div class="order-card__meta">
        <span class="order-card__code">ออเดอร์ #{{ order.code }}</span>
        <span class="order-card__date">{{ order.createdAt | date }}</span>
      </div>
      <span class="order-card__status" :style="{ background: order.statusInfo.tint, color: order.statusInfo.color }">
        <v-icon small :color="order.statusInfo.color">{{ order.statusInfo.icon }}</v-icon>
        {{ order.statusText }}
      </span>
    </header>

    <h3 v-if="active" class="order-card__headline">{{ headline }}</h3>

    <OrderProgress v-if="active" :status="order.status" class="order-card__progress" />

    <div class="order-card__body">
      <div class="order-card__thumb">
        <ProductThumb :name="order.productName" :category="order.productCategory" :src="order.imageUrl" font-size="1.6rem" />
      </div>
      <div class="order-card__item">
        <div class="order-card__name">
          <span class="tabular">{{ order.quantity | number }}×</span> {{ order.productName }}
        </div>
        <div v-if="order.optionsText" class="order-card__sub">{{ order.optionsText }}</div>
        <div v-if="order.note" class="order-card__note">หมายเหตุ: {{ order.note }}</div>
        <div v-if="order.productDeleted" class="order-card__sub error--text">เมนูนี้ถูกลบแล้ว</div>
      </div>
      <div class="order-card__total">
        <span class="order-card__total-label">ยอดรวม</span>
        <span class="tabular">{{ order.totalPrice | price }}</span>
      </div>
    </div>

    <footer v-if="order.canCancel || reorderable" class="order-card__actions">
      <v-btn
        v-if="order.canCancel"
        text
        rounded
        color="error"
        :disabled="updating"
        @click="$emit('change-status', { order, status: 'cancelled' })"
      >
        ยกเลิกออเดอร์
      </v-btn>
      <v-btn
        v-if="reorderable"
        depressed
        rounded
        class="order-card__reorder"
        :to="{ name: 'product-detail', params: { id: order.product._id } }"
      >
        สั่งอีกครั้ง
      </v-btn>
    </footer>
  </article>
</template>

<script>
import OrderProgress from './OrderProgress.vue'
import ProductThumb from '../common/ProductThumb.vue'
import { ACTIVE_STATUSES } from '../../utils/orderRows'

const HEADLINES = {
  pending: 'ส่งออเดอร์แล้ว รอร้านรับออเดอร์',
  cooking: 'แม่ครัวกำลังทำอาหารของคุณ',
  done: 'อาหารเสร็จแล้ว กำลังส่งให้คุณ',
}

export default {
  name: 'OrderCard',
  components: { OrderProgress, ProductThumb },
  props: {
    order: { type: Object, required: true },
    updating: { type: Boolean, default: false },
  },
  computed: {
    active() {
      return ACTIVE_STATUSES.includes(this.order.status)
    },
    reorderable() {
      return !this.active && !this.order.productDeleted
    },
    headline() {
      return HEADLINES[this.order.status] || HEADLINES.pending
    },
  },
}
</script>

<style scoped>
.order-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}
.order-card--active {
  padding: 24px;
  border-color: #c9d9fb !important;
  box-shadow: 0 16px 36px rgba(31, 85, 199, 0.08) !important;
}
.order-card__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.order-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
}
.order-card__code {
  font-weight: 600;
  color: var(--app-text);
}
.order-card__date {
  font-size: 0.85rem;
  color: var(--app-text-muted);
}
.order-card__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
  font-weight: 600;
}
.order-card__headline {
  margin: -4px 0 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--app-text);
}
.order-card__body {
  display: flex;
  align-items: center;
  gap: 16px;
}
.order-card--active .order-card__body {
  padding-top: 16px;
  border-top: 1px solid var(--app-border);
}
.order-card__thumb {
  flex-shrink: 0;
  width: 64px;
}
.order-card__thumb >>> .product-thumb {
  border-radius: 14px;
}
.order-card__item {
  flex: 1;
  min-width: 0;
}
.order-card__name {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--app-text);
}
.order-card__sub {
  font-size: 0.875rem;
  color: var(--app-text-muted);
}
.order-card__note {
  display: inline-block;
  margin-top: 4px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  background: #fff4d6;
  color: #7a4f00;
  font-size: 0.85rem;
}
.order-card__total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--app-text);
}
.order-card__total-label {
  font-family: 'IBM Plex Sans Thai', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--app-text-muted);
}
.order-card__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}
.order-card__reorder {
  background: var(--app-primary-tint) !important;
  color: var(--app-primary-dark) !important;
  font-weight: 600;
}
@media (max-width: 600px) {
  .order-card,
  .order-card--active {
    padding: 16px;
  }
  .order-card__body {
    flex-wrap: wrap;
  }
  .order-card__total {
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
  }
}
</style>
