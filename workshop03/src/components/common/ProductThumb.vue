<template>
  <v-responsive :aspect-ratio="aspectRatio" class="product-thumb" :style="{ background: visual.bg }">
    <div class="product-thumb__inner" :style="{ color: visual.fg, fontSize: fontSize }">
      {{ visual.initial }}
    </div>
  </v-responsive>
</template>

<script>
import { productVisual } from '../../utils/productVisual'

// ภาพแทนสินค้า สร้างจากชื่อ (Back-end ยังไม่มีรูปสินค้า)
export default {
  name: 'ProductThumb',
  props: {
    name: { type: String, default: '' },
    aspectRatio: { type: Number, default: 1 },
    fontSize: { type: String, default: '3rem' },
  },
  computed: {
    visual() {
      return productVisual(this.name)
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
