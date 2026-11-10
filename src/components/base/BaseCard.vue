<template>
  <div class="base-card" :class="{ 'base-card--glow': glow }">
    <slot />
  </div>
</template>

<script>
// ใช้เยอะ: กล่องการ์ดพื้นฐาน ทุก section ใช้ตัวนี้
export default {
  name: 'BaseCard',
  props: {
    glow: { type: Boolean, default: false },
  },
}
</script>

<style scoped>
.base-card {
  position: relative;
  height: 100%;
  padding: 24px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
  backdrop-filter: blur(12px);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}
.base-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-strong);
  box-shadow: 0 12px 40px -12px var(--shadow);
}
.base-card--glow {
  background:
    linear-gradient(var(--surface), var(--surface)) padding-box,
    var(--gradient) border-box;
  border: 1px solid transparent;
}
</style>
