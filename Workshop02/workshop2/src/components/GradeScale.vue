<template>
  <div>
    <div class="scale-title mb-3">เกณฑ์การตัดเกรด</div>

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
    // เกรดที่ต้องไฮไลต์ ('' = ไม่ไฮไลต์)
    activeGrade: { type: String, default: '' },
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

.scale-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px 8px 8px;
  border: 1.5px solid transparent;
  border-radius: 14px;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.scale-row + .scale-row {
  margin-top: 4px;
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
</style>
