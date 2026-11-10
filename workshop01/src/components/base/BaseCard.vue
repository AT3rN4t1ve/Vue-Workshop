<template>
  <div
    v-reveal
    class="base-card"
    :class="{ 'base-card--glow': glow, 'is-clickable': to, 'is-active': isActive }"
    :role="to ? 'link' : null"
    :tabindex="to ? 0 : null"
    @click="go"
    @keydown.enter="go"
  >
    <span v-if="to" class="base-card__arrow" aria-hidden="true">↗</span>
    <slot />
  </div>
</template>

<script>
import { goToSection } from '../../router'

export default {
  name: 'BaseCard',
  props: {
    glow: { type: Boolean, default: false },
    to: { type: String, default: '' },
  },
  computed: {
    isActive() {
      return Boolean(this.to) && this.$route.params.section === this.to
    },
  },
  methods: {
    go() {
      if (this.to) goToSection(this.to)
    },
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
  /* opacity/translate = แอนิเมชันโผล่ตอนเลื่อนถึง (v-reveal) */
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease,
    opacity 0.6s ease var(--reveal-delay, 0ms), translate 0.6s ease var(--reveal-delay, 0ms);
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

/* กดได้ */
.is-clickable {
  cursor: pointer;
}
.is-clickable:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
.base-card__arrow {
  position: absolute;
  top: 18px;
  right: 20px;
  font-size: 16px;
  color: var(--accent);
  opacity: 0;
  transform: translate(-4px, 4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.is-clickable:hover .base-card__arrow,
.is-active .base-card__arrow {
  opacity: 1;
  transform: none;
}

/* การ์ดที่ตรงกับ path ปัจจุบัน */
.is-active {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent),
    0 16px 48px -16px var(--shadow);
}
</style>
