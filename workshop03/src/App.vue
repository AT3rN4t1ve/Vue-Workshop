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
