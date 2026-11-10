import { lineKey, optionProblem, unitPrice } from '../../utils/options'

const STORAGE_KEY = 'ws3_cart'

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const items = raw ? JSON.parse(raw) : []
    return items.map((item) => {
      const options = item.options || []
      const note = item.note || ''
      return { ...item, options, note, key: item.key || lineKey(item.product._id, options, note) }
    })
  } catch (e) {
    return []
  }
}

export function saveCart(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
}

export default {
  namespaced: true,

  state: () => ({
    items: loadItems(),
  }),

  getters: {
    count: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    total: (state) =>
      state.items.reduce((sum, item) => sum + unitPrice(item.product, item.options) * item.quantity, 0),
    quantityOf: (state) => (productId) =>
      state.items
        .filter((item) => item.product._id === productId)
        .reduce((sum, item) => sum + item.quantity, 0),
    problemOf: (state, getters) => (item) => {
      const { product } = item
      if (product.stock <= 0) return 'เมนูนี้หมดแล้ว กรุณาลบออกจากตะกร้า'
      const optionError = optionProblem(product, item.options)
      if (optionError) return `${optionError} กรุณาลบรายการนี้แล้วเลือกใหม่`
      if (getters.quantityOf(product._id) > product.stock) {
        return `เมนูนี้เหลือ ${product.stock} จาน กรุณาลดจำนวน`
      }
      return ''
    },
    hasProblem: (state, getters) => state.items.some((item) => getters.problemOf(item)),
  },

  mutations: {
    ADD(state, { product, quantity, options = [], note = '' }) {
      const key = lineKey(product._id, options, note)
      const found = state.items.find((item) => item.key === key)
      if (found) {
        found.quantity += quantity
        found.product = product
      } else {
        state.items.push({ key, product, quantity, options, note: note.trim() })
      }
    },
    SET_QUANTITY(state, { key, quantity }) {
      const found = state.items.find((item) => item.key === key)
      if (found) found.quantity = quantity
    },
    REMOVE(state, key) {
      state.items = state.items.filter((item) => item.key !== key)
    },
    REMOVE_PRODUCT(state, productId) {
      state.items = state.items.filter((item) => item.product._id !== productId)
    },
    CLEAR(state) {
      state.items = []
    },
    SYNC(state, products) {
      state.items = state.items
        .map((item) => {
          const latest = products.find((product) => product._id === item.product._id)
          return latest ? { ...item, product: latest } : null
        })
        .filter(Boolean)
    },
  },

  actions: {
    add({ getters, commit, dispatch }, { product, quantity = 1, options = [], note = '' }) {
      const notify = (text, color) => dispatch('ui/notify', { text, color }, { root: true })

      const optionError = optionProblem(product, options)
      if (optionError) {
        notify(optionError, 'error')
        return false
      }

      const remaining = product.stock - getters.quantityOf(product._id)
      if (remaining <= 0) {
        notify(product.stock > 0 ? 'ในตะกร้ามีเมนูนี้ครบจำนวนที่เหลือแล้ว' : 'เมนูนี้หมดแล้ว', 'error')
        return false
      }

      const amount = Math.min(quantity, remaining)
      commit('ADD', { product, quantity: amount, options, note })
      notify(`เพิ่ม "${product.name}" ${amount} จานลงตะกร้าแล้ว`, 'success')
      return true
    },
  },
}
