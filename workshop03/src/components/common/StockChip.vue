<template>
  <v-chip :color="status.color" :text-color="status.textColor" small label class="font-weight-medium">
    {{ status.label }}
  </v-chip>
</template>

<script>
import { LOW_STOCK } from '../../utils/constants'

// ป้ายสถานะสินค้าคงเหลือ: หมด / ใกล้หมด / พร้อมส่ง
export default {
  name: 'StockChip',
  props: {
    stock: { type: Number, default: 0 },
    showAmount: { type: Boolean, default: false },
  },
  computed: {
    status() {
      if (this.stock <= 0) {
        return { label: 'สินค้าหมด', color: '#FDECEC', textColor: '#B93838' }
      }
      if (this.stock <= LOW_STOCK) {
        return { label: `เหลือ ${this.stock} ชิ้น`, color: '#FFF4DC', textColor: '#8A5A00' }
      }
      return {
        label: this.showAmount ? `คงเหลือ ${this.stock.toLocaleString('th-TH')} ชิ้น` : 'พร้อมส่ง',
        color: '#E6F5EC',
        textColor: '#17714A',
      }
    },
  },
}
</script>
