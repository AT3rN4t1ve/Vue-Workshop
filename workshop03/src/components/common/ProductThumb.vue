<template>
  <v-img
    v-if="src && !failed"
    :src="src"
    :alt="name"
    :aspect-ratio="aspectRatio"
    class="product-thumb"
    @error="failed = true"
  />
  <v-responsive v-else :aspect-ratio="aspectRatio" class="product-thumb" :style="{ background: visual.bg }">
    <div class="product-thumb__inner" role="img" :aria-label="name" :style="{ fontSize: fontSize }">
      <span class="product-thumb__emoji">{{ visual.emoji }}</span>
    </div>
  </v-responsive>
</template>

<script>
import { productVisual } from '../../utils/productVisual'

export default {
  name: 'ProductThumb',
  props: {
    name: { type: String, default: '' },
    category: { type: String, default: '' },
    src: { type: String, default: '' },
    aspectRatio: { type: Number, default: 1 },
    fontSize: { type: String, default: '3rem' },
  },
  data: () => ({
    failed: false,
  }),
  computed: {
    visual() {
      return productVisual(this.name, this.category)
    },
  },
  watch: {
    src() {
      this.failed = false
    },
  },
}
</script>

<style scoped>
.product-thumb {
  border-radius: var(--radius-md);
  user-select: none;
}
.product-thumb__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  line-height: 1;
}
.product-thumb__emoji {
  font-family: var(--font-emoji);
  filter: drop-shadow(0 6px 10px rgba(43, 33, 24, 0.18));
}
</style>
