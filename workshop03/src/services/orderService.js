import http from './http'

export default {
  getAll() {
    return http.get('/orders')
  },

  getByProduct(productId) {
    return http.get(`/products/${productId}/orders`)
  },

  create(productId, { quantity, options = [], note = '' }) {
    return http.post(`/products/${productId}/orders`, {
      quantity: Number(quantity),
      options: options.map(({ group, choice }) => ({ group, choice })),
      note: String(note || '').trim(),
    })
  },

  updateStatus(id, status) {
    return http.put(`/orders/${id}/status`, { status })
  },
}
