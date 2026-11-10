import http from './http'

export default {
  getAll() {
    return http.get('/orders')
  },

  getByProduct(productId) {
    return http.get(`/products/${productId}/orders`)
  },

  // options: [{ group, choice }] — ราคาตัวเลือก Back-end คิดเองจากเมนู
  create(productId, { quantity, options = [], note = '' }) {
    return http.post(`/products/${productId}/orders`, {
      quantity: Number(quantity),
      options: options.map(({ group, choice }) => ({ group, choice })),
      note: String(note || '').trim(),
    })
  },

  // status: 'cooking' | 'done' | 'cancelled' (user ธรรมดายกเลิกได้เฉพาะ Order ของตัวเองที่ยังรอรับ)
  updateStatus(id, status) {
    return http.put(`/orders/${id}/status`, { status })
  },
}
