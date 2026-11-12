<template>
  <v-app>
    <AppHeader />

    <v-main class="app-main">
      <v-container class="app-container py-6 py-md-8">
        <transition name="page" mode="out-in">
          <router-view :key="$route.path" />
        </transition>
      </v-container>
    </v-main>

    <AppFooter />
    <MobileNav />
    <AppSnackbar />
  </v-app>
</template>

<script>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import AppSnackbar from './components/layout/AppSnackbar.vue'
import MobileNav from './components/layout/MobileNav.vue'

export default {
  name: 'App',
  components: { AppHeader, AppFooter, AppSnackbar, MobileNav },
}
</script>
