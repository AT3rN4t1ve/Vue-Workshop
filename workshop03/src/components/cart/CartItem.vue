<template>
  <div class="cart-item d-flex py-4">
    <router-link :to="detailLink" class="cart-item__thumb mr-4 flex-shrink-0">
      <ProductThumb :name="product.name" :src="product.imageUrl" font-size="1.8rem" />
    </router-link>

    <div class="flex-grow-1 cart-item__body">
      <div class="d-flex align-start">
        <div class="flex-grow-1 mr-2">
          <router-link :to="detailLink" class="cart-item__name line-clamp-2">{{ product.name }}</router-link>
          <div v-if="optionsLabel" class="text-body-2 grey--text text--darken-2">{{ optionsLabel }}</div>
          <div v-if="item.note" class="text-body-2 grey--text text--darken-2">หมายเหตุ: {{ item.note }}</div>
          <div class="text-body-2 grey--text text--darken-1 tabular">{{ unit | price }} / จาน</div>
        </div>
        <v-btn icon small :disabled="disabled" :aria-label="`ลบ ${product.name} ออกจากตะกร้า`" @click="$emit('remove', item.key)">
          <v-icon small>mdi-trash-can-outline</v-icon>
        </v-btn>
      </div>

      <div class="d-flex align-center justify-space-between mt-3">
        <QuantityInput
          :value="item.quantity"
          :max="Math.max(max, 1)"
          :disabled="disabled || product.stock <= 0"
          @input="$emit('update-quantity', { key: item.key, quantity: $event })"
        />
        <div class="cart-item__total tabular">{{ unit * item.quantity | price }}</div>
      </div>

      <div v-if="problem" class="error--text text-caption mt-2">
        <v-icon x-small color="error" class="mr-1">mdi-alert-circle-outline</v-icon>{{ problem }}
      </div>
    </div>
  </div>
</template>

<script>
import { optionsText, unitPrice } from '../../utils/options'
import ProductThumb from '../common/ProductThumb.vue'
import QuantityInput from '../common/QuantityInput.vue'

// สินค้า 1 รายการในตะกร้า (สินค้า + ตัวเลือก + หมายเหตุ)
// ปรับจำนวน (emit 'update-quantity' { key, quantity }) และลบ (emit 'remove' key)
export default {
  name: 'CartItem',
  components: { ProductThumb, QuantityInput },
  props: {
    item: { type: Object, required: true },
    // จำนวนสูงสุดของรายการนี้ (stock หักรายการอื่นของสินค้าเดียวกันแล้ว)
    max: { type: Number, default: 99 },
    // ข้อความปัญหาที่ต้องแก้ก่อนสั่งซื้อ ('' = ไม่มี)
    problem: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    product() {
      return this.item.product
    },
    detailLink() {
      return { name: 'product-detail', params: { id: this.product._id } }
    },
    optionsLabel() {
      return optionsText(this.item.options)
    },
    unit() {
      return unitPrice(this.product, this.item.options)
    },
  },
}
</script>

<style scoped>
.cart-item + .cart-item {
  border-top: 1px solid #eef0f3;
}
.cart-item__thumb {
  display: block;
  width: 84px;
  text-decoration: none;
}
.cart-item__body {
  min-width: 0;
}
.cart-item__name {
  font-weight: 500;
  color: #1f2937;
  text-decoration: none;
}
.cart-item__name:hover {
  color: #e4572e;
}
.cart-item__total {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1f2937;
}
</style>
