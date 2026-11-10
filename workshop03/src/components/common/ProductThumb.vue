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
    <div class="product-thumb__inner" :style="{ color: visual.fg, fontSize: fontSize }">
      {{ visual.initial }}
    </div>
  </v-responsive>
</template>

<script>
import { productVisual } from '../../utils/productVisual'

export default {
  name: 'ProductThumb',
  props: {
    name: { type: String, default: '' },
    src: { type: String, default: '' },
    aspectRatio: { type: Number, default: 1 },
    fontSize: { type: String, default: '3rem' },
  },
  data: () => ({
    failed: false,
  }),
  computed: {
    visual() {
      return productVisual(this.name)
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
  border-radius: 10px;
  user-select: none;
}
.product-thumb__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-weight: 600;
  line-height: 1;
}
</style>
