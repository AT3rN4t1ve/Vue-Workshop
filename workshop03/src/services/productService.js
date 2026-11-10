// บริการข้อมูลสินค้า — หน้าจอทุกหน้าเรียกผ่านไฟล์นี้เท่านั้น
// ตอนนี้ใช้ข้อมูลจำลอง (mockDb) เมื่อต่อ API ให้เปลี่ยนเนื้อในแต่ละฟังก์ชันเป็น request จริง
//   getAll  -> GET    /products
//   getById -> GET    /products/:id
//   create  -> POST   /products
//   update  -> PUT    /products/:id
//   remove  -> DELETE /products/:id

import { db, generateId, respond, reject } from './mockDb'

function validate(payload) {
  if (!payload.name || !String(payload.name).trim()) return 'กรุณากรอกชื่อสินค้า'
  if (!(Number(payload.price) >= 0)) return 'ราคาต้องไม่ติดลบ'
  if (!(Number(payload.stock) >= 0)) return 'จำนวนคงเหลือต้องไม่ติดลบ'
  return null
}

function clean(payload) {
  return {
    name: String(payload.name).trim(),
    description: String(payload.description || '').trim(),
    price: Number(payload.price),
    stock: Math.floor(Number(payload.stock)),
  }
}

export default {
  getAll() {
    return respond(db.getProducts())
  },

  getById(id) {
    const product = db.getProducts().find((item) => item._id === id)
    return product ? respond(product) : reject('ไม่พบสินค้า')
  },

  create(payload) {
    const error = validate(payload)
    if (error) return reject(error)

    const now = new Date().toISOString()
    const product = { _id: generateId(), ...clean(payload), createdAt: now, updatedAt: now }
    db.saveProducts([product, ...db.getProducts()])
    return respond(product)
  },

  update(id, payload) {
    const error = validate(payload)
    if (error) return reject(error)

    const products = db.getProducts()
    const index = products.findIndex((item) => item._id === id)
    if (index === -1) return reject('ไม่พบสินค้า')

    products[index] = { ...products[index], ...clean(payload), updatedAt: new Date().toISOString() }
    db.saveProducts(products)
    return respond(products[index])
  },

  remove(id) {
    const products = db.getProducts()
    const product = products.find((item) => item._id === id)
    if (!product) return reject('ไม่พบสินค้า')

    db.saveProducts(products.filter((item) => item._id !== id))
    return respond(product)
  },
}
