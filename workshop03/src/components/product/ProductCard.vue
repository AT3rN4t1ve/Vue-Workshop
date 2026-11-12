<template>
  <v-card
    :to="{ name: 'product-detail', params: { id: product._id } }"
    class="product-card surface-card d-flex flex-column"
    :class="{ 'product-card--sold-out': soldOut }"
    height="100%"
  >
    <div class="product-card__media">
      <ProductThumb
        :name="product.name"
        :category="product.category"
        :src="product.imageUrl"
        :aspect-ratio="4 / 3"
        font-size="3.5rem"
        class="product-card__thumb"
      />
      <StockChip v-if="showStock" :stock="product.stock" show-amount class="product-card__badge" />
    </div>

    <div class="product-card__body">
      <div v-if="product.category" class="product-card__category text-truncate">{{ product.category }}</div>
      <div class="product-card__name line-clamp-2">{{ product.name }}</div>
      <div v-if="product.description" class="product-card__desc text-truncate">{{ product.description }}</div>

      <div class="product-card__footer">
        <div class="product-card__price-wrap">
          <span v-if="hasOptions" class="product-card__from">เริ่มต้น</span>
          <span class="product-card__price tabular">{{ product.price | price }}</span>
        </div>
        <v-btn
          fab
          small
          depressed
          color="primary"
          class="product-card__add"
          :disabled="soldOut"
          :aria-label="hasOptions ? `เลือกตัวเลือกของ ${product.name}` : `เพิ่ม ${product.name} ลงตะกร้า`"
          @click.stop.prevent="$emit('add', product)"
        >
          <v-icon>{{ hasOptions ? 'mdi-tune-variant' : 'mdi-plus' }}</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
import ProductThumb from '../common/ProductThumb.vue'
import StockChip from '../common/StockChip.vue'
import { LOW_STOCK } from '../../utils/constants'

export default {
  name: 'ProductCard',
  components: { ProductThumb, StockChip },
  props: {
    product: { type: Object, required: true },
  },
  computed: {
    soldOut() {
      return this.product.stock <= 0
    },
    showStock() {
      return this.product.stock <= LOW_STOCK
    },
    hasOptions() {
      return (this.product.optionGroups || []).length > 0
    },
  },
}
</script>

<style scoped>
.product-card {
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md) !important;
}
.product-card:focus-visible {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}
.product-card__media {
  position: relative;
  overflow: hidden;
}
.product-card__media .product-card__thumb {
  border-radius: 0;
  transition: transform 0.35s ease;
}
.product-card:hover .product-card__thumb {
  transform: scale(1.03);
}
.product-card--sold-out .product-card__thumb {
  filter: grayscale(1);
  opacity: 0.55;
}
.product-card__badge {
  position: absolute;
  top: 10px;
  left: 10px;
  box-shadow: 0 2px 8px rgba(43, 33, 24, 0.12);
}
.product-card__body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 14px 16px 16px;
}
.product-card__category {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--app-text-soft);
  margin-bottom: 2px;
}
.product-card__name {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--app-text);
}
.product-card__desc {
  margin-top: 2px;
  font-size: 0.85rem;
  color: var(--app-text-muted);
}
.product-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
}
.product-card__price-wrap {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.product-card__from {
  font-size: 0.72rem;
  color: var(--app-text-soft);
}
.product-card__price {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--v-primary-base);
}
.product-card__add {
  flex-shrink: 0;
  box-shadow: 0 6px 14px var(--shadow-primary) !important;
}
.product-card__add.v-btn--disabled {
  box-shadow: none !important;
}
@media (max-width: 600px) {
  .product-card__body {
    padding: 10px 10px 12px;
  }
  .product-card__name {
    font-size: 0.92rem;
  }
  .product-card__price {
    font-size: 1.05rem;
  }
}
</style>
