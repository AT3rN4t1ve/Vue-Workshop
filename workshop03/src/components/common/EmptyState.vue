<template>
  <div class="empty-state">
    <div class="empty-state__art" aria-hidden="true">
      <v-icon size="56" color="primary">{{ icon }}</v-icon>
      <span class="empty-state__dot" />
    </div>
    <div class="empty-state__title">{{ title }}</div>
    <div v-if="text" class="empty-state__text">{{ text }}</div>
    <div v-if="$slots.default" class="empty-state__actions">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    icon: { type: String, default: 'mdi-inbox-outline' },
    title: { type: String, required: true },
    text: { type: String, default: '' },
  },
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 56px 16px;
  text-align: center;
}
.empty-state__art {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 128px;
  height: 128px;
  margin-bottom: 8px;
  border-radius: 50%;
  background: var(--app-primary-tint);
}
.empty-state__dot {
  position: absolute;
  top: 14px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--app-accent);
}
.empty-state__title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--app-text);
}
.empty-state__text {
  max-width: 340px;
  font-size: 0.95rem;
  color: var(--app-text-muted);
}
.empty-state__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}
</style>
