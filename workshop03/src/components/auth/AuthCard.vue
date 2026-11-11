<template>
  <div class="auth-wrap">
    <v-card class="surface-card auth-card pa-6 pa-sm-8">
      <div class="text-center mb-6">
        <v-avatar color="primary" size="52" rounded class="mb-4">
          <v-icon dark size="30">mdi-shopping</v-icon>
        </v-avatar>
        <h1 class="auth-card__title">{{ title }}</h1>
        <div class="text-body-2 grey--text text--darken-1">{{ subtitle }}</div>
      </div>

      <slot />

      <div class="text-center text-body-2 mt-5">
        <slot name="footer" />
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'AuthCard',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
  },
}
</script>

<style scoped>
.auth-wrap {
  display: flex;
  justify-content: center;
  padding-top: 24px;
}
.auth-card {
  width: 100%;
  max-width: 440px;
}
.auth-card__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--app-text);
}
</style>
