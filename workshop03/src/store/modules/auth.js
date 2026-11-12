
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
    SET_USER(state, user) {
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
    async fetchMe({ commit }) {
      commit('SET_USER', await authService.getMe())
    },
    async updateProfile({ commit }, profile) {
      commit('SET_USER', await authService.updateMe(profile))
    },
    async updateAvatar({ commit }, avatar) {
      commit('SET_USER', await authService.updateAvatar(avatar))
    },
    async removeAvatar({ commit }) {
      commit('SET_USER', await authService.removeAvatar())
    },
    logout({ commit }) {
      commit('CLEAR_SESSION')
      commit('cart/CLEAR', null, { root: true })
    },
  },
}
