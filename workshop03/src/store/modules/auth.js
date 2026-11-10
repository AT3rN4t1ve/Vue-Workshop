// สถานะการเข้าสู่ระบบ: token + ข้อมูลผู้ใช้ บันทึกลง localStorage (ดู store/index.js)
// token ถูกแนบไปกับทุก request โดย services/http.js (ตั้งค่าใน main.js)

import authService from '../../services/authService'

const STORAGE_KEY = 'ws3_auth'

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function saveSession(state) {
  if (state.token) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: state.token, user: state.user }))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export default {
  namespaced: true,

  state: () => {
    const session = loadSession()
    return {
      token: session ? session.token : null,
      user: session ? session.user : null,
    }
  },

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => !!state.user && state.user.role === 'admin',
    displayName: (state) => {
      if (!state.user) return ''
      const fullName = [state.user.firstName, state.user.lastName].filter(Boolean).join(' ')
      return fullName || state.user.email || ''
    },
  },

  mutations: {
    SET_SESSION(state, { token, user }) {
      state.token = token
      state.user = user
    },
    CLEAR_SESSION(state) {
      state.token = null
      state.user = null
    },
  },

  actions: {
    async login({ commit }, credentials) {
      commit('SET_SESSION', await authService.login(credentials))
    },
    logout({ commit }) {
      commit('CLEAR_SESSION')
      // ตะกร้าเป็นของผู้ใช้คนเดิม ออกจากระบบแล้วล้างทิ้ง
      commit('cart/CLEAR', null, { root: true })
    },
  },
}
