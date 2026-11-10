import http from './http'
import { DEFAULT_CATEGORY } from '../utils/constants'

const text = (value) => String(value || '').trim()

function clean(payload) {
  return {
    name: text(payload.name),
    description: text(payload.description),
    category: text(payload.category) || DEFAULT_CATEGORY,
    imageUrl: text(payload.imageUrl),
    price: Number(payload.price),
    stock: Number(payload.stock),
    optionGroups: (payload.optionGroups || []).map((group) => ({
      name: text(group.name),
      isRequired: !!group.isRequired,
      isMultiple: !!group.isMultiple,
      choices: (group.choices || []).map((choice) => ({
        name: text(choice.name),
        price: Number(choice.price) || 0,
      })),
    })),
  }
}

export default {
  getAll() {
    return http.get('/products')
  },

  getById(id) {
    return http.get(`/products/${id}`)
  },

  create(payload) {
    return http.post('/products', clean(payload))
  },

  update(id, payload) {
    return http.put(`/products/${id}`, clean(payload))
  },

  remove(id) {
    return http.delete(`/products/${id}`)
  },
}
