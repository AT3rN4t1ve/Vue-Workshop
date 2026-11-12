<template>
  <ol class="order-progress" aria-label="สถานะออเดอร์">
    <li
      v-for="(step, i) in steps"
      :key="step.key"
      class="order-progress__step"
      :class="`order-progress__step--${stateOf(i)}`"
      :aria-current="stateOf(i) === 'current' ? 'step' : null"
    >
      <span class="order-progress__bar"><span class="order-progress__fill" /></span>
      <span class="order-progress__label">
        <v-icon v-if="stateOf(i) === 'done'" small class="order-progress__icon">mdi-check</v-icon>
        <span v-else class="order-progress__dot" />
        {{ step.label }}
      </span>
    </li>
  </ol>
</template>

<script>
const STEPS = [
  { key: 'pending', label: 'ส่งออเดอร์แล้ว' },
  { key: 'cooking', label: 'กำลังทำ' },
  { key: 'done', label: 'เสร็จแล้ว รอส่ง' },
  { key: 'delivered', label: 'ได้รับแล้ว' },
]
const POSITION = { pending: 0, cooking: 1, done: 2, delivered: 3 }

export default {
  name: 'OrderProgress',
  props: {
    status: { type: String, required: true },
  },
  data: () => ({ steps: STEPS }),
  methods: {
    stateOf(index) {
      const at = POSITION[this.status]
      if (at === undefined) return 'todo'
      if (index < at || this.status === 'delivered') return 'done'
      return index === at ? 'current' : 'todo'
    },
  },
}
</script>

<style scoped>
.order-progress {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.order-progress__step {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.order-progress__bar {
  height: 8px;
  border-radius: var(--radius-pill);
  background: var(--app-border);
  overflow: hidden;
}
.order-progress__fill {
  display: block;
  width: 0;
  height: 100%;
  border-radius: inherit;
  transition: width 0.3s ease;
}
.order-progress__label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--app-text-muted);
}
.order-progress__dot {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #cfc3b6;
  box-sizing: border-box;
}

.order-progress__step--done .order-progress__fill {
  width: 100%;
  background: #17663f;
}
.order-progress__step--done .order-progress__label,
.order-progress__step--done .order-progress__icon {
  color: #17663f !important;
  font-weight: 600;
}

.order-progress__step--current .order-progress__bar {
  background: #e8f0ff;
}
.order-progress__step--current .order-progress__fill {
  width: 55%;
  background: #1f55c7;
}
.order-progress__step--current .order-progress__label {
  color: #1f55c7;
  font-weight: 600;
}
.order-progress__step--current .order-progress__dot {
  border: none;
  background: #1f55c7;
  box-shadow: 0 0 0 4px #e8f0ff;
}
@media (max-width: 600px) {
  .order-progress__label {
    font-size: 0.75rem;
  }
}
</style>
