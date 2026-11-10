<template>
  <div class="d-flex flex-wrap align-center mb-5">
    <div class="mr-4 mb-2">
      <h1 class="text-h5 font-weight-bold secondary--text">{{ title }}</h1>
      <div v-if="subtitle" class="text-body-2 grey--text text--darken-1">{{ subtitle }}</div>
    </div>
    <v-spacer />
    <div class="mb-2">
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
