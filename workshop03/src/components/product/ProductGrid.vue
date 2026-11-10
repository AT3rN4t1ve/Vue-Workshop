<template>
  <v-row dense>
    <template v-if="loading">
      <v-col v-for="n in 8" :key="n" cols="6" sm="4" md="3">
        <v-skeleton-loader type="image, article" class="surface-card" />
      </v-col>
    </template>

    <template v-else>
      <v-col v-for="product in products" :key="product._id" cols="6" sm="4" md="3">
        <ProductCard :product="product" @add="$emit('add', $event)" />
      </v-col>
    </template>
  </v-row>
</template>

<script>
import ProductCard from './ProductCard.vue'

export default {
  name: 'ProductGrid',
  components: { ProductCard },
  props: {
    products: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },
}
</script>
