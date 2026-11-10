// ตะกร้าสินค้า: เก็บใน Vuex และบันทึกลง localStorage (ดู store/index.js)
// items: [{ product: { _id, name, description, price, stock }, quantity }]

const STORAGE_KEY = 'ws3_cart'

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
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
    total: (state) => state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    quantityOf: (state) => (productId) => {
      const found = state.items.find((item) => item.product._id === productId)
      return found ? found.quantity : 0
    },
    // มีรายการที่สั่งเกินจำนวนคงเหลือ (รวมถึงสินค้าหมด)
    hasStockProblem: (state) => state.items.some((item) => item.quantity > item.product.stock),
  },

  mutations: {
    ADD(state, { product, quantity }) {
      const found = state.items.find((item) => item.product._id === product._id)
      if (found) {
        found.quantity += quantity
        found.product = product
      } else {
        state.items.push({ product, quantity })
      }
    },
    SET_QUANTITY(state, { productId, quantity }) {
      const found = state.items.find((item) => item.product._id === productId)
      if (found) found.quantity = quantity
    },
    REMOVE(state, productId) {
      state.items = state.items.filter((item) => item.product._id !== productId)
    },
    CLEAR(state) {
      state.items = []
    },
    // อัปเดตราคา/stock ล่าสุด และตัดสินค้าที่ถูกลบออกจากตะกร้า
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
    // คืนค่า true เมื่อเพิ่มลงตะกร้าได้
    add({ getters, commit, dispatch }, { product, quantity = 1 }) {
      const remaining = product.stock - getters.quantityOf(product._id)
      if (remaining <= 0) {
        dispatch(
          'ui/notify',
          {
            text: product.stock > 0 ? 'ในตะกร้ามีสินค้านี้ครบจำนวนคงเหลือแล้ว' : 'สินค้าหมด',
            color: 'error',
          },
          { root: true }
        )
        return false
      }

      const amount = Math.min(quantity, remaining)
      commit('ADD', { product, quantity: amount })
      dispatch(
        'ui/notify',
        { text: `เพิ่ม "${product.name}" ${amount} ชิ้นลงตะกร้าแล้ว`, color: 'success' },
        { root: true }
      )
      return true
    },
  },
}
