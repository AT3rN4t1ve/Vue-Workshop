<template>
  <div>
    <div class="scale-title mb-3">เกณฑ์การตัดเกรด</div>

    <div class="band-wrap mb-5">
      <div class="band">
        <div
          v-for="seg in segments"
          :key="seg.grade"
          class="band-seg"
          :class="{ 'band-seg--dim': activeGrade && seg.grade !== activeGrade }"
          :style="{ flex: seg.width + ' 1 0', background: seg.color }"
        />
      </div>

      <div
        class="band-marker"
        :class="{ 'band-marker--visible': hasScore }"
        :style="{ left: markerLeft + '%' }"
      >
        <span class="band-marker-pin" />
      </div>

      <div class="band-ticks">
        <span
          v-for="tick in ticks"
          :key="tick"
          class="band-tick"
          :style="{ left: tick + '%' }"
        >{{ tick }}</span>
      </div>
    </div>

    <div
      v-for="item in items"
      :key="item.grade"
      class="scale-row"
      :class="{ 'scale-row--active': item.grade === activeGrade }"
      :style="
        item.grade === activeGrade
          ? { background: item.soft, borderColor: item.color }
          : {}
      "
    >
      <v-avatar size="36" :color="item.color">
        <span class="white--text font-weight-bold">{{ item.grade }}</span>
      </v-avatar>
      <span class="scale-label">{{ item.label }}</span>
      <v-spacer />
      <span class="scale-range">{{ item.range }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GradeScale',

  props: {
    items: { type: Array, required: true },
    activeGrade: { type: String, default: '' },
    score: { type: Number, default: null },
  },

  data: () => ({
    lastScore: 0,
  }),

  computed: {
    sortedItems() {
      return [...this.items].sort((a, b) => a.min - b.min)
    },

    segments() {
      return this.sortedItems.map((item, i) => {
        const next = this.sortedItems[i + 1]
        const end = next ? next.min : 100
        return { grade: item.grade, color: item.color, width: end - item.min }
      })
    },

    ticks() {
      return [...this.sortedItems.map((item) => item.min), 100]
    },

    hasScore() {
      return this.score !== null
    },

    markerLeft() {
      return this.hasScore ? this.score : this.lastScore
    },
  },

  watch: {
    score(value) {
      if (value !== null) this.lastScore = value
    },
  },
}
</script>

<style scoped>
.scale-title {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #6b7280;
}

.band-wrap {
  position: relative;
  padding-top: 14px;
}

.band {
  display: flex;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  gap: 2px;
}

.band-seg {
  height: 100%;
  transition: opacity 0.25s ease;
}

.band-seg--dim {
  opacity: 0.3;
}

.band-marker {
  position: absolute;
  top: 0;
  width: 0;
  opacity: 0;
  transition: left 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease;
  pointer-events: none;
}

.band-marker--visible {
  opacity: 1;
}

.band-marker-pin {
  position: absolute;
  top: 0;
  left: -7px;
  width: 14px;
  height: 28px;
  border-radius: 7px;
  background: #fff;
  border: 3px solid #1e1b4b;
  box-shadow: 0 2px 6px rgba(30, 27, 75, 0.3);
}

.band-ticks {
  position: relative;
  height: 18px;
  margin-top: 8px;
}

.band-tick {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
}

.band-tick:first-child {
  transform: none;
}

.band-tick:last-child {
  transform: translateX(-100%);
}

.scale-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px 8px 8px;
  border: 1.5px solid transparent;
  border-radius: 14px;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
}

.scale-row + .scale-row {
  margin-top: 4px;
}

.scale-row--active {
  transform: translateX(4px);
  box-shadow: 0 6px 16px rgba(30, 27, 75, 0.08);
}

.scale-label {
  color: #374151;
}

.scale-row--active .scale-label {
  font-weight: 600;
}

.scale-range {
  color: #6b7280;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .band-marker,
  .scale-row {
    transition: none;
  }

  .scale-row--active {
    transform: none;
  }
}
</style>
