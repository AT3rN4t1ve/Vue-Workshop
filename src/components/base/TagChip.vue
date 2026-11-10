<template>
  <span class="chip" :class="`chip--${variant}`">
    <span v-if="icon" class="chip__icon">{{ icon }}</span>
    <slot />
  </span>
</template>

<script>
// ใช้เยอะ: ป้ายแท็กเล็กๆ (งานอดิเรก, ชอบ/ไม่ชอบ, เครื่องมือ)
export default {
  name: 'TagChip',
  props: {
    icon: { type: String, default: '' },
    variant: {
      type: String,
      default: 'default',
      validator: (v) => ['default', 'like', 'dislike'].includes(v),
    },
  },
}
</script>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  background: var(--chip);
  color: var(--text);
  border: 1px solid var(--border);
  white-space: nowrap;
}
.chip--like {
  background: rgba(52, 211, 153, 0.12);
  border-color: rgba(52, 211, 153, 0.35);
  color: #34d399;
}
.chip--dislike {
  background: rgba(251, 113, 133, 0.12);
  border-color: rgba(251, 113, 133, 0.35);
  color: #fb7185;
}
</style>
