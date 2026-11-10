<template>
  <v-app-bar app color="white" height="64" class="app-header" flat>
    <v-container class="app-container d-flex align-center py-0">
      <router-link to="/" class="brand d-flex align-center">
        <v-avatar color="primary" size="36" rounded class="mr-3">
          <v-icon dark size="22">mdi-shopping</v-icon>
        </v-avatar>
        <span class="brand-name">WorkShop Store</span>
      </router-link>

      <v-spacer />

      <!-- ยังไม่ login: แสดงแค่โลโก้ -->
      <template v-if="isLoggedIn">
        <!-- เมนูบนจอใหญ่ -->
        <nav class="d-none d-md-flex align-center mr-2">
          <v-btn
            v-for="item in menu"
            :key="item.to"
            :to="item.to"
            :exact="item.exact"
            text
            class="nav-btn mx-1"
            active-class="nav-btn--active"
          >
            <v-icon left size="20">{{ item.icon }}</v-icon>
            {{ item.label }}
          </v-btn>
        </nav>

        <v-btn icon to="/cart" aria-label="ตะกร้าสินค้า" class="mr-1">
          <v-badge :content="cartCount" :value="cartCount > 0" color="primary" overlap>
            <v-icon>mdi-cart-outline</v-icon>
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

export default {
  name: 'AppHeader',
  components: { UserMenu },
  computed: {
    ...mapGetters('cart', { cartCount: 'count' }),
    ...mapGetters('auth', ['isLoggedIn', 'isAdmin']),
    menu() {
      const items = [
        { label: 'ร้านค้า', to: '/', icon: 'mdi-storefront-outline', exact: true },
        { label: 'จัดการสินค้า', to: '/admin/products', icon: 'mdi-package-variant-closed' },
        { label: 'คำสั่งซื้อ', to: '/admin/orders', icon: 'mdi-clipboard-text-outline' },
      ]
      if (this.isAdmin) {
        items.push({ label: 'ผู้ใช้', to: '/admin/users', icon: 'mdi-account-multiple-outline' })
      }
      return items
    },
  },
}
</script>

<style scoped>
.app-header {
  border-bottom: 1px solid #e8eaee !important;
}
.app-header >>> .v-toolbar__content {
  padding: 0;
}
.brand {
  text-decoration: none;
}
.brand-name {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
}
.nav-btn {
  color: #4b5563 !important;
  font-weight: 500;
}
.nav-btn--active {
  color: #e4572e !important;
}
</style>
