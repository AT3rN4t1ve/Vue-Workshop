<template>
  <div class="quantity-input" :class="{ 'quantity-input--disabled': disabled }">
    <button type="button" class="quantity-input__btn" aria-label="ลดจำนวน" :disabled="disabled || value <= min" @click="change(value - 1)">
      <v-icon small>mdi-minus</v-icon>
    </button>
    <input
      class="quantity-input__field tabular"
      type="number"
      inputmode="numeric"
      aria-label="จำนวน"
      :value="value"
      :min="min"
      :max="max"
      :disabled="disabled"
      @change="change($event.target.value, $event)"
    />
    <button type="button" class="quantity-input__btn" aria-label="เพิ่มจำนวน" :disabled="disabled || value >= max" @click="change(value + 1)">
      <v-icon small>mdi-plus</v-icon>
    </button>
  </div>
</template>

<script>
// ตัวเลือกจำนวน (- จำนวน +) ใช้กับ v-model ได้ ค่าจะอยู่ในช่วง min..max เสมอ
export default {
  name: 'QuantityInput',
  props: {
    value: { type: Number, default: 1 },
    min: { type: Number, default: 1 },
    max: { type: Number, default: 99 },
    disabled: { type: Boolean, default: false },
  },
  methods: {
    change(raw, event) {
      let next = Math.floor(Number(raw))
      if (!Number.isFinite(next)) next = this.min
      next = Math.max(this.min, Math.min(this.max, next))
      // ถ้าพิมพ์ค่านอกช่วง ให้ช่องกรอกกลับมาแสดงค่าที่ถูกต้อง
      if (event) event.target.value = next
      if (next !== this.value) this.$emit('input', next)
    },
  },
}
</script>

<style scoped>
.quantity-input {
  display: inline-flex;
  align-items: center;
  border: 1px solid #d5d9e0;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}
.quantity-input--disabled {
  opacity: 0.55;
}
.quantity-input__btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.quantity-input__btn:hover:not(:disabled) {
  background: #f1f3f6;
}
.quantity-input__btn:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}
.quantity-input__field {
  width: 48px;
  height: 36px;
  text-align: center;
  border-left: 1px solid #d5d9e0;
  border-right: 1px solid #d5d9e0;
  outline: none;
  font-size: 0.95rem;
  -moz-appearance: textfield;
}
.quantity-input__field::-webkit-outer-spin-button,
.quantity-input__field::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
