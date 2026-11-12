<template>
  <span class="stock-chip" :style="{ background: status.color, color: status.textColor }">
    {{ status.label }}
  </span>
</template>

<script>
import { LOW_STOCK } from '../../utils/constants'

export default {
  name: 'StockChip',
  props: {
    stock: { type: Number, default: 0 },
    showAmount: { type: Boolean, default: false },
  },
  computed: {
    status() {
      if (this.stock <= 0) {
        return { label: 'หมดแล้ว', color: '#FDECEC', textColor: '#B3261E' }
      }
      if (this.stock <= LOW_STOCK) {
        return {
          label: this.showAmount ? `เหลือ ${this.stock} จาน` : 'ใกล้หมด',
          color: '#FFF4D6',
          textColor: '#7A4F00',
        }
      }
      return { label: 'พร้อมสั่ง', color: '#E3F4EA', textColor: '#17663F' }
    },
  },
}
</script>

<style scoped>
.stock-chip {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}
</style>
