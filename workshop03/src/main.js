import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import { formatPrice, formatNumber, formatDate } from './utils/format'

Vue.config.productionTip = false

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
