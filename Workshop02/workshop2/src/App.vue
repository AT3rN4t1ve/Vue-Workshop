<template>
  <v-app class="app-root">
    <v-main>
      <GradeCalculator />
    </v-main>
  </v-app>
</template>

<script>
import GradeCalculator from './components/GradeCalculator'

export default {
  name: 'App',

  components: {
    GradeCalculator,
  },
}
</script>

<style>
.v-application.app-root {
  font-family: 'Prompt', 'Roboto', sans-serif !important;
  background:
    radial-gradient(circle at 15% 0%, rgba(124, 58, 237, 0.14), transparent 45%),
    radial-gradient(circle at 90% 20%, rgba(79, 70, 229, 0.14), transparent 40%),
    #f5f6fb !important;
}

.v-application.app-root .text-h1,
.v-application.app-root .text-h2,
.v-application.app-root .text-h3,
.v-application.app-root .text-h4,
.v-application.app-root .text-h5,
.v-application.app-root .text-h6 {
  font-family: 'Prompt', 'Roboto', sans-serif !important;
}
</style>
