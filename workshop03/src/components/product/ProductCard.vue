<template>
  <v-card
    :to="{ name: 'product-detail', params: { id: product._id } }"
    class="product-card surface-card d-flex flex-column"
    :class="{ 'product-card--sold-out': soldOut }"
    height="100%"
  >
    <div class="pa-3 pb-0">
      <ProductThumb :name="product.name" :src="product.imageUrl" :aspect-ratio="4 / 3" />
    </div>

    <div class="pa-3 d-flex flex-column flex-grow-1">
      <div v-if="product.category" class="text-caption grey--text text--darken-1 text-truncate">
        {{ product.category }}
      </div>
      <div class="product-card__name line-clamp-2 mb-2">{{ product.name }}</div>

      <div class="mt-auto">
        <StockChip :stock="product.stock" class="mb-2" />
        <div class="d-flex align-center justify-space-between">
          <div>
            <div v-if="hasOptions" class="text-caption grey--text text--darken-1 product-card__from">เริ่มต้น</div>
            <span class="product-card__price tabular">{{ product.price | price }}</span>
          </div>
          <v-btn
            fab
            x-small
            depressed
            color="primary"
            :disabled="soldOut"
            :aria-label="hasOptions ? `เลือกตัวเลือกของ ${product.name}` : `เพิ่ม ${product.name} ลงตะกร้า`"
            @click.stop.prevent="$emit('add', product)"
          >
            <v-icon small>{{ hasOptions ? 'mdi-tune-variant' : 'mdi-cart-plus' }}</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import ProductThumb from '../common/ProductThumb.vue'
import StockChip from '../common/StockChip.vue'

// การ์ดสินค้า 1 ชิ้นในหน้าร้าน กดการ์ดไปหน้ารายละเอียด กดปุ่มมุมขวาจะ emit 'add'
// (สินค้าที่มีตัวเลือก หน้าร้านจะพาไปเลือกที่หน้ารายละเอียดแทนการเพิ่มทันที)
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
    hasOptions() {
      return (this.product.optionGroups || []).length > 0
    },
  },
}
</script>

<style scoped>
.product-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}
.product-card:hover {
  transform: translateY(-3px);
  border-color: #e4572e !important;
  box-shadow: 0 8px 20px rgba(31, 41, 55, 0.08) !important;
}
.product-card--sold-out .product-thumb {
  filter: grayscale(1);
  opacity: 0.6;
}
.product-card__name {
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
  color: #1f2937;
  min-height: 2.8em;
}
.product-card__from {
  line-height: 1.1;
}
.product-card__price {
  font-size: 1.15rem;
  font-weight: 600;
  color: #e4572e;
}
</style>
