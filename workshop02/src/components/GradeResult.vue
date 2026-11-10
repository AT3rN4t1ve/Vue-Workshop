<template>
  <div
    class="result"
    :style="{ background: item.soft, borderColor: item.color }"
  >
    <v-progress-circular
      :value="score"
      :color="item.color"
      :size="132"
      :width="10"
      :rotate="-90"
    >
      <span class="result-grade" :style="{ color: item.color }">
        {{ item.grade }}
      </span>
    </v-progress-circular>

    <div>
      <div class="result-label">คะแนนที่ได้</div>
      <div class="result-score">
        {{ score }}<span class="result-max"> / 100</span>
      </div>
      <v-chip small dark :color="item.color" class="mt-2 font-weight-medium">
        {{ item.label }}
      </v-chip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GradeResult',

  props: {
    score: { type: Number, required: true },
    // รายการเกรดที่ได้ จาก gradeTable: { grade, label, color, soft }
    item: { type: Object, required: true },
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
}

.result-grade {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
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
</style>
