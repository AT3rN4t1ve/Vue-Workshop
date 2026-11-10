// บริการสมาชิก — ตอนนี้ใช้ข้อมูลจำลอง เมื่อต่อ API ให้เปลี่ยนเป็น request จริง
//   register    -> POST /register            body: { username, password, firstName, lastName }
//   login       -> POST /login               body: { username, password } -> { token, user }
//   approveUser -> PUT  /users/:id/approve   (admin เท่านั้น)
//   getUsers    -> ** Back-end ยังไม่มี endpoint นี้ ** ต้องเพิ่ม GET /users ก่อนหน้า "ผู้ใช้" จะใช้กับ API จริงได้
// กติกาเดียวกับ Back-end: สมัครแล้ว approved = false ต้องรอ admin อนุมัติก่อนจึง login ได้

import { db, generateId, respond, reject } from './mockDb'

// ตัด password ออกก่อนส่งให้หน้าจอ เหมือนที่ Back-end ทำ
function toPublic(user) {
  const copy = { ...user }
  delete copy.password
  return copy
}

export default {
  register(payload) {
    const username = String(payload.username || '').trim()
    const password = String(payload.password || '')
    if (username.length < 3) return reject('ชื่อผู้ใช้ต้องยาวอย่างน้อย 3 ตัวอักษร')
    if (password.length < 6) return reject('รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร')

    const users = db.getUsers()
    if (users.some((user) => user.username === username)) {
      return reject('ชื่อผู้ใช้นี้ถูกใช้แล้ว')
    }

    const now = new Date().toISOString()
    const user = {
      _id: generateId(),
      username,
      password,
      firstName: String(payload.firstName || '').trim(),
      lastName: String(payload.lastName || '').trim(),
      role: 'user',
      approved: false,
      createdAt: now,
      updatedAt: now,
    }
    db.saveUsers([...users, user])
    return respond(toPublic(user))
  },

  login({ username, password }) {
    const user = db.getUsers().find((item) => item.username === String(username || '').trim())
    if (!user || user.password !== password) {
      return reject('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หากยังไม่มีบัญชีกรุณาสมัครสมาชิก')
    }
    if (!user.approved) {
      return reject('บัญชีนี้ยังรอผู้ดูแลระบบอนุมัติ')
    }
    return respond({ token: `mock-token-${user._id}`, user: toPublic(user) })
  },

  getUsers() {
    const users = db.getUsers().map(toPublic)
    return respond(users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  },

  approveUser(id) {
    const users = db.getUsers()
    const user = users.find((item) => item._id === id)
    if (!user) return reject('ไม่พบผู้ใช้')

    user.approved = true
    user.updatedAt = new Date().toISOString()
    db.saveUsers(users)
    return respond(toPublic(user))
  },
}
