<template>
  <div class="quantity-input" :class="{ 'quantity-input--disabled': disabled, 'quantity-input--large': large }">
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
export default {
  name: 'QuantityInput',
  props: {
    value: { type: Number, default: 1 },
    min: { type: Number, default: 1 },
    max: { type: Number, default: 99 },
    disabled: { type: Boolean, default: false },
    large: { type: Boolean, default: false },
  },
  methods: {
    change(raw, event) {
      let next = Math.floor(Number(raw))
      if (!Number.isFinite(next)) next = this.min
      next = Math.max(this.min, Math.min(this.max, next))
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
  gap: 2px;
  padding: 2px;
  border: 1.5px solid var(--app-border-strong);
  border-radius: var(--radius-pill);
  background: var(--app-surface);
}
.quantity-input--disabled {
  opacity: 0.55;
}
.quantity-input__btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--app-surface-muted);
  cursor: pointer;
  transition: background 0.15s ease;
}
.quantity-input--large .quantity-input__btn {
  width: 44px;
  height: 44px;
}
.quantity-input__btn:hover:not(:disabled) {
  background: var(--app-primary-tint);
}
.quantity-input__btn:focus-visible {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 1px;
}
.quantity-input__btn:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}
.quantity-input__field {
  width: 44px;
  height: 38px;
  text-align: center;
  outline: none;
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  color: var(--app-text);
  -moz-appearance: textfield;
}
.quantity-input--large .quantity-input__field {
  height: 44px;
  font-size: 1.1rem;
}
.quantity-input__field::-webkit-outer-spin-button,
.quantity-input__field::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
