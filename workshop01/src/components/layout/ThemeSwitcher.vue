<template>
  <div ref="root" class="switcher">
    <button
      class="trigger"
      type="button"
      aria-label="เลือกธีม"
      :aria-expanded="String(open)"
      @click="open = !open"
    >
      <span class="trigger__swatch" :style="{ background: currentSwatch }" />
      <span class="trigger__icon">{{ currentModeIcon }}</span>
    </button>

    <transition name="pop">
      <div v-if="open" class="panel" role="dialog" aria-label="ตั้งค่าธีม">
        <p class="panel__label">โหมด</p>
        <div class="modes">
          <button
            v-for="m in modes"
            :key="m.id"
            type="button"
            class="mode"
            :class="{ 'is-active': theme.mode === m.id }"
            @click="theme.mode = m.id"
          >
            <span>{{ m.icon }}</span>{{ m.label }}
          </button>
        </div>

        <p class="panel__label">โทนสี</p>
        <div class="palettes">
          <button
            v-for="p in palettes"
            :key="p.id"
            type="button"
            class="palette"
            :class="{ 'is-active': theme.palette === p.id }"
            :title="p.label"
            @click="theme.palette = p.id"
          >
            <span class="palette__dot" :style="{ background: p.swatch }" />
            <span class="palette__name">{{ p.label }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { PALETTES, MODES, loadTheme, saveTheme, applyTheme } from '../../utils/theme'

export default {
  name: 'ThemeSwitcher',
  data() {
    return {
      open: false,
      theme: loadTheme(),
      palettes: PALETTES,
      modes: MODES,
    }
  },
  computed: {
    currentSwatch() {
      return this.palettes.find((p) => p.id === this.theme.palette).swatch
    },
    currentModeIcon() {
      return this.modes.find((m) => m.id === this.theme.mode).icon
    },
  },
  watch: {
    theme: {
      deep: true,
      handler(value) {
        applyTheme(value)
        saveTheme(value)
      },
    },
  },
  mounted() {
    document.addEventListener('click', this.onOutsideClick)
    document.addEventListener('keydown', this.onKeydown)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onOutsideClick)
    document.removeEventListener('keydown', this.onKeydown)
  },
  methods: {
    onOutsideClick(e) {
      if (this.open && !this.$refs.root.contains(e.target)) this.open = false
    },
    onKeydown(e) {
      if (e.key === 'Escape') this.open = false
    },
  },
}
</script>

<style scoped>
.switcher {
  position: relative;
}
.trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 4px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--chip);
  cursor: pointer;
  font-size: 14px;
  transition: border-color 0.2s;
}
.trigger:hover {
  border-color: var(--border-strong);
}
.trigger__swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.panel {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 260px;
  padding: 16px;
  border-radius: 20px;
  background: var(--panel);
  border: 1px solid var(--border);
  box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.35);
}
.panel__label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
}
.panel__label:not(:first-child) {
  margin-top: 16px;
}

.modes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: var(--chip);
}
.mode {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 4px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.mode.is-active {
  background: var(--surface-solid);
  color: var(--text);
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.palettes {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}
.palette {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 0;
  border: 0;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  font: inherit;
}
.palette__dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition: outline-color 0.2s, transform 0.2s;
}
.palette:hover .palette__dot {
  transform: scale(1.08);
}
.palette.is-active .palette__dot {
  outline-color: var(--accent);
}
.palette__name {
  font-size: 11px;
  color: var(--muted);
}
.palette.is-active .palette__name {
  color: var(--text);
  font-weight: 600;
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
