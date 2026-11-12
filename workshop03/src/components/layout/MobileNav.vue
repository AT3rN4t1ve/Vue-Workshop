<template>
  <v-bottom-navigation
    v-if="isLoggedIn && $vuetify.breakpoint.smAndDown"
    app
    grow
    :height="68"
    color="primary"
    class="mobile-nav"
    aria-label="เมนูหลัก"
  >
    <v-btn v-for="item in items" :key="item.to" :to="item.to" :exact="item.exact" class="mobile-nav__btn">
      <span>{{ item.short }}</span>
      <v-badge v-if="item.badge" :content="item.badge" color="primary" overlap offset-x="6" offset-y="8">
        <v-icon>{{ item.icon }}</v-icon>
      </v-badge>
      <v-icon v-else>{{ item.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import { mapGetters } from 'vuex'
import { mainMenu } from './menu'

export default {
  name: 'MobileNav',
  computed: {
    ...mapGetters('cart', { cartCount: 'count' }),
    ...mapGetters('auth', ['isLoggedIn', 'isAdmin']),
    items() {
      const menu = mainMenu(this.isAdmin)
      if (this.isAdmin) return menu
      return [
        ...menu,
        { short: 'ตะกร้า', to: '/cart', icon: 'mdi-basket-outline', badge: this.cartCount || 0 },
        { short: 'โปรไฟล์', to: '/profile', icon: 'mdi-account-circle-outline' },
      ]
    },
  },
}
</script>

<style scoped>
.mobile-nav {
  border-top: 1px solid var(--app-border);
  box-shadow: none !important;
}
.mobile-nav__btn {
  font-size: 0.75rem !important;
  color: var(--app-text-muted) !important;
}
.mobile-nav__btn.v-btn--active {
  color: var(--app-primary-dark) !important;
  font-weight: 600;
}
.mobile-nav__btn.v-btn--active .v-icon {
  color: var(--app-primary-dark) !important;
}
</style>
