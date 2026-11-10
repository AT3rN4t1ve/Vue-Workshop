import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import { configureHttp } from './services/http'
import { formatPrice, formatNumber, formatDate } from './utils/format'

Vue.config.productionTip = false

// ให้ทุก request แนบ token ของผู้ใช้ที่ login อยู่
// ถ้า Back-end ตอบ 401 (token หมดอายุ / ใช้ไม่ได้) ให้ออกจากระบบแล้วกลับไปหน้าเข้าสู่ระบบ
configureHttp({
  getToken: () => store.state.auth.token,
  onUnauthorized: () => {
    if (!store.getters['auth/isLoggedIn']) return
    store.dispatch('auth/logout')
    store.dispatch('ui/notify', { text: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่', color: 'error' })
    router.replace({ name: 'login' }).catch(() => {})
  },
})

// ใช้ใน template ได้ทุกหน้า เช่น {{ product.price | price }}
Vue.filter('price', formatPrice)
Vue.filter('number', formatNumber)
Vue.filter('date', formatDate)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
