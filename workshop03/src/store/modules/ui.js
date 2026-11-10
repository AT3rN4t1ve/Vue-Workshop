export default {
  namespaced: true,

  state: () => ({
    snackbar: { show: false, text: '', color: 'success' },
  }),

  mutations: {
    SHOW_SNACKBAR(state, { text, color = 'success' }) {
      state.snackbar = { show: true, text, color }
    },
    HIDE_SNACKBAR(state) {
      state.snackbar.show = false
    },
  },

  actions: {
    notify({ commit }, payload) {
      commit('SHOW_SNACKBAR', typeof payload === 'string' ? { text: payload } : payload)
    },
  },
}
