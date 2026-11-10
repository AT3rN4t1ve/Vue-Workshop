<template>
  <div class="empty-state text-center py-12 px-4">
    <v-avatar color="grey lighten-4" size="88" class="mb-4">
      <v-icon size="44" color="grey lighten-1">{{ icon }}</v-icon>
    </v-avatar>
    <div class="text-h6 font-weight-medium mb-1">{{ title }}</div>
    <div v-if="text" class="text-body-2 grey--text text--darken-1 mb-5">{{ text }}</div>
    <slot />
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
