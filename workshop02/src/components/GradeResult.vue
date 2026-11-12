<template>
  <div
    class="result"
    :style="{ background: item.soft, borderColor: item.color }"
    aria-live="polite"
  >
    <v-progress-circular
      class="result-ring"
      :value="displayScore"
      :color="item.color"
      :size="132"
      :width="10"
      :rotate="-90"
    >
      <span
        :key="item.grade"
        class="result-grade"
        :style="{ color: item.color }"
      >
        {{ item.grade }}
      </span>
    </v-progress-circular>

    <div>
      <div class="result-label">คะแนนที่ได้</div>
      <div class="result-score">
        {{ formattedScore }}<span class="result-max"> / 100</span>
      </div>
      <v-chip small dark :color="item.color" class="mt-2 font-weight-medium">
        {{ item.label }}
      </v-chip>
    </div>
  </div>
</template>

<script>
const DURATION = 700

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default {
  name: 'GradeResult',

  props: {
    score: { type: Number, required: true },
    item: { type: Object, required: true },
  },

  data: () => ({
    displayScore: 0,
    frameId: null,
  }),

  computed: {
    formattedScore() {
      if (Number.isInteger(this.score)) return Math.round(this.displayScore)
      const decimals = String(this.score).split('.')[1].length
      return this.displayScore.toFixed(Math.min(decimals, 2))
    },
  },

  watch: {
    score: {
      immediate: true,
      handler(to) {
        this.animateTo(to)
      },
    },
  },

  beforeDestroy() {
    cancelAnimationFrame(this.frameId)
  },

  methods: {
    animateTo(target) {
      cancelAnimationFrame(this.frameId)

      if (prefersReducedMotion()) {
        this.displayScore = target
        return
      }

      const from = this.displayScore
      const start = performance.now()

      const step = (now) => {
        const t = Math.min((now - start) / DURATION, 1)
        this.displayScore = from + (target - from) * easeOutCubic(t)
        if (t < 1) this.frameId = requestAnimationFrame(step)
      }

      this.frameId = requestAnimationFrame(step)
    },
  },
}
</script>

<style scoped>
.result {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;
  padding: 24px;
  border: 1.5px solid;
  border-radius: 20px;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.result-ring ::v-deep .v-progress-circular__overlay {
  transition: stroke 0.3s ease;
}

.result-grade {
  display: inline-block;
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  animation: grade-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes grade-pop {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.result-label {
  font-size: 0.85rem;
  color: #6b7280;
}

.result-score {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
  font-variant-numeric: tabular-nums;
}

.result-max {
  font-size: 1rem;
  font-weight: 400;
  color: #9ca3af;
}

@media (prefers-reduced-motion: reduce) {
  .result-grade {
    animation: none;
  }
}
</style>
