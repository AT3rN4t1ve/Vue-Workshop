<template>
  <v-app-bar app color="white" height="64" class="app-header" flat>
    <v-container class="app-container d-flex align-center py-0">
      <router-link to="/" class="brand d-flex align-center">
        <v-avatar color="primary" size="36" rounded class="mr-3">
          <v-icon dark size="22">mdi-silverware-fork-knife</v-icon>
        </v-avatar>
        <span class="brand-name">{{ APP_NAME }}</span>
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

        <v-btn icon to="/cart" aria-label="ตะกร้า" class="mr-1">
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
import { APP_NAME } from '../../utils/constants'

export default {
  name: 'AppHeader',
  components: { UserMenu },
  data: () => ({
    APP_NAME,
  }),
  computed: {
    ...mapGetters('cart', { cartCount: 'count' }),
    ...mapGetters('auth', ['isLoggedIn', 'isAdmin']),
    menu() {
      const shop = { label: 'เมนูอาหาร', to: '/', icon: 'mdi-food-outline', exact: true }
      // user: สั่งอาหารและดู Order ของตัวเอง / admin: จัดการเมนู ดู Order ทั้งร้าน และอนุมัติผู้ใช้
      if (!this.isAdmin) {
        return [shop, { label: 'ออเดอร์ของฉัน', to: '/orders', icon: 'mdi-clipboard-text-outline' }]
      }
      return [
        shop,
        { label: 'จัดการเมนู', to: '/admin/products', icon: 'mdi-notebook-edit-outline' },
        { label: 'ออเดอร์', to: '/orders', icon: 'mdi-clipboard-text-outline' },
        { label: 'ผู้ใช้', to: '/admin/users', icon: 'mdi-account-multiple-outline' },
      ]
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
