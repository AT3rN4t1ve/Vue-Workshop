<template>
  <v-app>
    <AppHeader />

    <v-main class="app-main">
      <v-container class="app-container py-6 py-md-8">
        <router-view />
      </v-container>
    </v-main>

    <AppFooter />
    <AppSnackbar />
  </v-app>
</template>

<script>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import AppSnackbar from './components/layout/AppSnackbar.vue'

export default {
  name: 'App',
  components: { AppHeader, AppFooter, AppSnackbar },
}
</script>

<style>
.v-application {
  font-family: 'Prompt', 'Roboto', sans-serif !important;
}
.v-application .text-h4,
.v-application .text-h5,
.v-application .text-h6,
.v-application .text-subtitle-1,
.v-application .text-subtitle-2,
.v-application .text-body-1,
.v-application .text-body-2,
.v-application .text-caption,
.v-application .text-overline {
  font-family: 'Prompt', 'Roboto', sans-serif !important;
}
.app-main {
  background: #f6f7f9;
}
.app-container {
  max-width: 1200px;
}
.v-btn {
  letter-spacing: 0.2px !important;
  text-transform: none !important;
}
.surface-card {
  border: 1px solid #e8eaee !important;
  border-radius: 14px !important;
  box-shadow: none !important;
}
.tabular {
  font-variant-numeric: tabular-nums;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
