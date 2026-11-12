<template>
  <router-link to="/" class="brand-logo" :class="{ 'brand-logo--dark': dark }" :aria-label="`${APP_NAME} หน้าแรก`">
    <span class="brand-mark" :style="markStyle" aria-hidden="true">
      <svg :width="iconSize" :height="iconSize" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 11h18a9 9 0 0 1-18 0z" />
        <path d="M8 7c0-1.5 1-1.5 1-3" />
        <path d="M12 7c0-1.5 1-1.5 1-3" />
        <path d="M16 7c0-1.5 1-1.5 1-3" />
      </svg>
    </span>
    <span class="brand-logo__text">
      <span class="brand-logo__name">{{ APP_NAME }}</span>
      <span v-if="subtitle" class="brand-logo__sub">{{ subtitle }}</span>
    </span>
  </router-link>
</template>

<script>
import { APP_NAME } from '../../utils/constants'

export default {
  name: 'BrandLogo',
  props: {
    subtitle: { type: String, default: '' },
    dark: { type: Boolean, default: false },
    size: { type: Number, default: 40 },
  },
  data: () => ({ APP_NAME }),
  computed: {
    iconSize() {
      return Math.round(this.size * 0.55)
    },
    markStyle() {
      return { width: `${this.size}px`, height: `${this.size}px`, borderRadius: `${Math.round(this.size * 0.3)}px` }
    },
  },
}
</script>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  text-decoration: none;
  color: var(--app-text);
}
.brand-logo--dark {
  color: #fff;
}
.brand-logo__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.15;
}
.brand-logo__name {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 600;
  white-space: nowrap;
}
.brand-logo__sub {
  font-size: 0.72rem;
  letter-spacing: 0.6px;
  color: var(--app-text-muted);
  white-space: nowrap;
}
.brand-logo--dark .brand-logo__sub {
  color: rgba(255, 255, 255, 0.8);
}
</style>
