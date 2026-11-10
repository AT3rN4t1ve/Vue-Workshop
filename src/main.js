import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { loadTheme, applyTheme } from './utils/theme'

Vue.config.productionTip = false

// ใส่ธีมก่อน mount เพื่อไม่ให้หน้าเว็บกะพริบเป็นสีเริ่มต้นก่อน
applyTheme(loadTheme())

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
