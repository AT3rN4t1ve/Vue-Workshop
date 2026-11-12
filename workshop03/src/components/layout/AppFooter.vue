<template>
  <v-footer class="app-footer" padless>
    <v-container class="app-container app-footer__inner">
      <div class="app-footer__grid">
        <div class="app-footer__brand">
          <BrandLogo :subtitle="APP_NAME_TH" :size="36" />
          <p class="app-footer__tagline">ผัดร้อน ๆ ทำตามสั่งทุกจาน สั่งออนไลน์แล้วติดตามสถานะได้ทันที</p>
        </div>

        <nav v-if="isLoggedIn" class="app-footer__col" aria-label="ลิงก์ด่วน">
          <div class="app-footer__heading">เมนู</div>
          <router-link v-for="item in links" :key="item.to" :to="item.to" class="app-footer__link">
            {{ item.label }}
          </router-link>
        </nav>
      </div>

      <div class="app-footer__bottom">
        <span>©2026 WorkShop - {{ APP_NAME }}</span>
        <span>Front-end (Vue 2 + Vuetify)</span>
      </div>
    </v-container>
  </v-footer>
</template>

<script>
import { mapGetters } from 'vuex'
import BrandLogo from './BrandLogo.vue'
import { APP_NAME, APP_NAME_TH } from '../../utils/constants'
import { mainMenu } from './menu'

export default {
  name: 'AppFooter',
  components: { BrandLogo },
  data: () => ({ APP_NAME, APP_NAME_TH }),
  computed: {
    ...mapGetters('auth', ['isLoggedIn', 'isAdmin']),
    links() {
      const items = mainMenu(this.isAdmin)
      return this.isAdmin ? items : [...items.slice(0, 1), { label: 'ตะกร้า', to: '/cart' }, ...items.slice(1)]
    },
  },
}
</script>

<style scoped>
.app-footer.v-footer {
  background: var(--app-soft) !important;
  border-top: 1px solid var(--app-border) !important;
  color: var(--app-text);
}
.app-footer__inner {
  padding: 36px 12px 20px;
}
.app-footer__grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 28px 48px;
}
.app-footer__brand {
  flex: 1 1 280px;
  max-width: 420px;
}
.app-footer__tagline {
  margin: 12px 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--app-text-muted);
}
.app-footer__col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 160px;
}
.app-footer__heading {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--app-primary-dark);
}
.app-footer__link {
  font-size: 0.875rem;
  color: var(--app-text);
  text-decoration: none;
}
.app-footer__link:hover {
  color: var(--app-primary-dark);
  text-decoration: underline;
}
.app-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  margin-top: 28px;
  padding-top: 16px;
  border-top: 1px solid var(--app-soft-raised);
  font-size: 0.8rem;
  color: var(--app-text-muted);
}
</style>
