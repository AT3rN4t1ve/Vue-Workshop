import Vue from 'vue'
import Vuex from 'vuex'
import auth, { saveSession } from './modules/auth'
import cart, { saveCart } from './modules/cart'
import ui from './modules/ui'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: { auth, cart, ui },
})

store.subscribe((mutation, state) => {
  if (mutation.type.startsWith('cart/')) saveCart(state.cart)
  if (mutation.type.startsWith('auth/')) saveSession(state.auth)
})

export default store
