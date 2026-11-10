<template>
  <v-chip :color="status.color" :text-color="status.textColor" small label class="font-weight-medium">
    {{ status.label }}
  </v-chip>
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
        return { label: 'หมดแล้ว', color: '#FDECEC', textColor: '#B93838' }
      }
      if (this.stock <= LOW_STOCK) {
        return {
          label: this.showAmount ? `เหลือ ${this.stock} จาน` : 'ใกล้หมด',
          color: '#FFF4DC',
          textColor: '#8A5A00',
        }
      }
      return { label: 'พร้อมสั่ง', color: '#E6F5EC', textColor: '#17714A' }
    },
  },
}
</script>
