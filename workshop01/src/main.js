import Vue from 'vue'
import App from './App.vue'
import router from './router'
import reveal from './directives/reveal'
import { loadTheme, applyTheme } from './utils/theme'

Vue.config.productionTip = false

Vue.directive('reveal', reveal)

applyTheme(loadTheme())

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
