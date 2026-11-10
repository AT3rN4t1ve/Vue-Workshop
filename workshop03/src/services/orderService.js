// บริการข้อมูล Order — ตอนนี้ใช้ข้อมูลจำลอง เมื่อต่อ API ให้เปลี่ยนเป็น request จริง
//   getAll       -> GET  /orders
//   getByProduct -> GET  /products/:id/orders
//   create       -> POST /products/:id/orders   body: { quantity }
// กติกาเดียวกับ Back-end: quantity ต้องเป็นจำนวนเต็ม >= 1 และไม่เกิน stock
// สั่งสำเร็จแล้วตัด stock และเก็บ unitPrice / totalPrice ณ เวลาที่สั่ง

import { db, generateId, respond, reject, currentUser } from './mockDb'

function pickUser(user) {
  return { _id: user._id, username: user.username, firstName: user.firstName, lastName: user.lastName }
}

// เลียนแบบ populate ของ Back-end: product ที่ถูกลบไปแล้วจะเป็น null
function populate(orders) {
  const products = db.getProducts()
  return orders
    .map((order) => {
      const product = products.find((item) => item._id === order.product)
      return {
        ...order,
        product: product
          ? { _id: product._id, name: product.name, price: product.price, stock: product.stock }
          : null,
      }
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export default {
  getAll() {
    return respond(populate(db.getOrders()))
  },

  getByProduct(productId) {
    return respond(populate(db.getOrders().filter((order) => order.product === productId)))
  },

  create(productId, quantity) {
    const amount = Number(quantity)
    if (!Number.isInteger(amount) || amount < 1) {
      return reject('จำนวนต้องเป็นจำนวนเต็มตั้งแต่ 1 ขึ้นไป')
    }

    const products = db.getProducts()
    const product = products.find((item) => item._id === productId)
    if (!product) return reject('ไม่พบสินค้า')
    if (product.stock < amount) {
      return reject(`สินค้าคงเหลือไม่พอ (เหลือ ${product.stock} ชิ้น)`)
    }

    product.stock -= amount
    db.saveProducts(products)

    const now = new Date().toISOString()
    const order = {
      _id: generateId(),
      product: product._id,
      // เก็บชื่อไว้ด้วยเพื่อให้ยังแสดงได้หลังสินค้าถูกลบ (เฉพาะข้อมูลจำลอง)
      productName: product.name,
      user: pickUser(currentUser()),
      quantity: amount,
      unitPrice: product.price,
      totalPrice: product.price * amount,
      createdAt: now,
      updatedAt: now,
    }
    db.saveOrders([order, ...db.getOrders()])
    return respond(populate([order])[0])
  },
}
