<template>
  <v-card class="stat-card surface-card pa-4 d-flex align-center" height="100%">
    <v-avatar :color="tint" size="46" rounded class="mr-4">
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
    color: { type: String, default: '#E4572E' },
    tint: { type: String, default: '#FFF1E8' },
  },
}
</script>

<style scoped>
.stat-card__body {
  min-width: 0;
}
.stat-card__value {
  font-size: 1.35rem;
  font-weight: 600;
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
