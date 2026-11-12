<template>
  <v-card class="stat-card surface-card pa-4 d-flex align-center" height="100%">
    <v-avatar :color="tint" size="48" class="mr-4 stat-card__icon">
      <v-icon :color="color">{{ icon }}</v-icon>
    </v-avatar>
    <div class="stat-card__body">
      <div class="text-caption grey--text text--darken-1">{{ label }}</div>
      <div class="stat-card__value tabular">{{ value }}</div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], required: true },
    icon: { type: String, default: 'mdi-chart-box-outline' },
    color: { type: String, default: '#C8441F' },
    tint: { type: String, default: '#FCEBE3' },
  },
}
</script>

<style scoped>
.stat-card__body {
  min-width: 0;
}
.stat-card__icon {
  border-radius: 14px !important;
}
.stat-card__value {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-text);
  line-height: 1.3;
  white-space: nowrap;
}
@media (max-width: 600px) {
  .stat-card .v-avatar {
    display: none;
  }
  .stat-card__value {
    font-size: 1.15rem;
  }
}
</style>
