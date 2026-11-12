<template>
  <v-app-bar app color="white" :height="68" class="app-header" flat>
    <v-container class="app-container d-flex align-center py-0">
      <BrandLogo :subtitle="isAdmin ? `${APP_NAME_TH} · กิน 1 คำ สวดอภิธรรม 7 คืน` : APP_NAME_TH" />

      <v-spacer />

      <template v-if="isLoggedIn">
        <nav class="d-none d-md-flex align-center mr-3" aria-label="เมนูหลัก">
          <v-btn
            v-for="item in menu"
            :key="item.to"
            :to="item.to"
            :exact="item.exact"
            text
            rounded
            class="nav-btn mx-1"
            active-class="nav-btn--active"
          >
            {{ item.label }}
          </v-btn>
        </nav>

        <v-btn
          to="/cart"
          depressed
          rounded
          color="primary"
          class="cart-btn d-none d-sm-flex mr-2"
          active-class="cart-btn--active"
          :aria-label="`ตะกร้า ${cartCount} รายการ`"
        >
          <v-icon left size="20">mdi-basket-outline</v-icon>
          ตะกร้า
          <span v-if="cartCount > 0" :key="bumpKey" class="cart-btn__count tabular" :class="{ 'badge-bump': bumpKey > 0 }">{{ cartCount }}</span>
        </v-btn>

        <v-btn icon to="/cart" class="d-sm-none mr-1" :aria-label="`ตะกร้า ${cartCount} รายการ`">
          <v-badge :content="cartCount" :value="cartCount > 0" color="primary" overlap>
            <v-icon>mdi-basket-outline</v-icon>
          </v-badge>
        </v-btn>

        <UserMenu :menu="menu" />
      </template>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import UserMenu from './UserMenu.vue'
import BrandLogo from './BrandLogo.vue'
import { APP_NAME_TH } from '../../utils/constants'
import { mainMenu } from './menu'

export default {
  name: 'AppHeader',
  components: { UserMenu, BrandLogo },
  data: () => ({
    APP_NAME_TH,
    bumpKey: 0,
  }),
  watch: {
    cartCount(next, prev) {
      if (next > prev) this.bumpKey += 1
    },
  },
  computed: {
    ...mapGetters('cart', { cartCount: 'count' }),
    ...mapGetters('auth', ['isLoggedIn', 'isAdmin']),
    menu() {
      return mainMenu(this.isAdmin)
    },
  },
}
</script>

<style scoped>
.app-header {
  border-bottom: 1px solid var(--app-border) !important;
  background: rgba(255, 255, 255, 0.94) !important;
  backdrop-filter: saturate(1.4) blur(8px);
}
.app-header >>> .v-toolbar__content {
  padding: 0;
}
.nav-btn {
  height: 40px !important;
  padding: 0 16px !important;
  color: var(--app-text-muted) !important;
  font-size: 0.95rem;
  font-weight: 500;
}
.nav-btn::before {
  display: none;
}
.nav-btn:hover {
  background: var(--app-hover);
}
.nav-btn--active {
  color: var(--app-primary-dark) !important;
  background: var(--app-primary-tint);
  font-weight: 600;
}
.cart-btn {
  height: 44px !important;
  padding: 0 14px 0 12px !important;
  font-weight: 600;
  box-shadow: var(--shadow-primary) !important;
}
.cart-btn--active {
  background: var(--app-primary-dark) !important;
}
.cart-btn__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  margin-left: 8px;
  padding: 0 6px;
  border-radius: var(--radius-pill);
  background: #fff;
  color: var(--app-primary-dark);
  font-size: 0.75rem;
}
</style>
