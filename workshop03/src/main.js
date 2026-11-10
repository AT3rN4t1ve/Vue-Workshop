import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import { configureHttp } from './services/http'
import { formatPrice, formatNumber, formatDate } from './utils/format'

Vue.config.productionTip = false

configureHttp({
  getToken: () => store.state.auth.token,
  onUnauthorized: () => {
    if (!store.getters['auth/isLoggedIn']) return
    store.dispatch('auth/logout')
    store.dispatch('ui/notify', { text: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่', color: 'error' })
    router.replace({ name: 'login' }).catch(() => {})
  },
})

Vue.filter('price', formatPrice)
Vue.filter('number', formatNumber)
Vue.filter('date', formatDate)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
