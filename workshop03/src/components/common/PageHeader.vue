<template>
  <div class="page-header">
    <div class="page-header__text">
      <h1 class="page-header__title">{{ title }}</h1>
      <div v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</div>
    </div>
    <div v-if="$slots.default" class="page-header__actions">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
  },
}
</script>

<style scoped>
.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 16px;
  margin-bottom: 24px;
}
.page-header__text {
  min-width: 0;
}
.page-header__title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--app-text);
}
.page-header__subtitle {
  margin-top: 4px;
  font-size: 0.95rem;
  color: var(--app-text-muted);
}
.page-header__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
@media (max-width: 600px) {
  .page-header__title {
    font-size: 1.5rem;
  }
}
</style>
