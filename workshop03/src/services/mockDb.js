// ฐานข้อมูลจำลองเก็บใน localStorage ใช้ระหว่างที่ยังไม่ได้ต่อ Workshop Back-end
// รูปร่างข้อมูลตั้งให้ตรงกับ API จริง (_id, name, description, price, stock ...)
// ตอนต่อ API ให้แก้เฉพาะ productService.js / orderService.js ไฟล์นี้ลบทิ้งได้เลย

const KEYS = {
  products: 'ws3_products',
  orders: 'ws3_orders',
  users: 'ws3_users',
  session: 'ws3_auth',
}

const SEED_PRODUCTS = [
  { name: 'หูฟังไร้สาย AirBeat Pro', description: 'หูฟังบลูทูธตัดเสียงรบกวน แบตเตอรี่ใช้งานต่อเนื่อง 30 ชั่วโมง พร้อมเคสชาร์จไร้สาย', price: 1590, stock: 24 },
  { name: 'คีย์บอร์ด Mechanical K87', description: 'คีย์บอร์ดขนาด 87 ปุ่ม สวิตช์ Red ไฟ RGB เชื่อมต่อได้ทั้งสายและบลูทูธ', price: 2290, stock: 12 },
  { name: 'เมาส์ไร้สาย Glide M2', description: 'เมาส์ทรง Ergonomic เสียงคลิกเงียบ ใช้ถ่าน AA ก้อนเดียวได้นาน 12 เดือน', price: 490, stock: 40 },
  { name: 'เครื่องคิดเลข', description: 'เครื่องคิดเลขตั้งโต๊ะ 12 หลัก จอใหญ่ ใช้พลังงานแสงอาทิตย์', price: 250, stock: 1 },
  { name: 'สมุดโน้ต A5 ปกแข็ง', description: 'สมุดเส้นจุด 160 หน้า กระดาษถนอมสายตา 100 แกรม มีสายคาดและที่คั่นหน้า', price: 129, stock: 80 },
  { name: 'ปากกาเจล 0.5 (แพ็ก 12 ด้าม)', description: 'หมึกเจลสีน้ำเงิน เขียนลื่น แห้งไว ไม่ซึมหลังกระดาษ', price: 99, stock: 150 },
  { name: 'กระเป๋าเป้ Urban 20L', description: 'กระเป๋าเป้กันน้ำ มีช่องใส่โน้ตบุ๊ก 15.6 นิ้ว และพอร์ต USB สำหรับชาร์จ', price: 890, stock: 18 },
  { name: 'แก้วเก็บความเย็น 600ml', description: 'สแตนเลส 2 ชั้น เก็บความเย็นได้ 24 ชั่วโมง ฝาปิดกันหก', price: 359, stock: 0 },
  { name: 'โคมไฟตั้งโต๊ะ LED', description: 'ปรับแสงได้ 3 โทน 5 ระดับ ก้านปรับองศาได้ ถนอมสายตา', price: 599, stock: 9 },
  { name: 'Power Bank 20000mAh', description: 'ชาร์จเร็ว PD 22.5W ชาร์จพร้อมกันได้ 3 อุปกรณ์ มีจอแสดงเปอร์เซ็นต์แบตเตอรี่', price: 790, stock: 33 },
  { name: 'ขาตั้งโน้ตบุ๊กอะลูมิเนียม', description: 'ปรับระดับได้ 6 ระดับ พับเก็บได้ ช่วยระบายความร้อน', price: 450, stock: 4 },
  { name: 'ไฟฉายพกพา Mini', description: 'ไฟฉาย LED ขนาดพกพา ชาร์จผ่าน USB-C กันน้ำระดับ IPX4', price: 199, stock: 56 },
]

// บัญชีทดสอบ ชุดเดียวกับ seed ของ Back-end (รหัสผ่านเก็บตรงๆ เพราะเป็นแค่ข้อมูลจำลอง)
const SEED_USERS = [
  { username: 'admin', password: 'admin1234', firstName: 'Admin', lastName: 'System', role: 'admin', approved: true },
  { username: 'somchai', password: '123456', firstName: 'สมชาย', lastName: 'ใจดี', role: 'user', approved: true },
  { username: 'somying', password: '123456', firstName: 'สมหญิง', lastName: 'รักเรียน', role: 'user', approved: true },
  { username: 'newbie', password: '123456', firstName: 'น้องใหม่', lastName: 'รออนุมัติ', role: 'user', approved: false },
]

const GUEST_USER = { _id: 'guest', username: 'guest', firstName: '', lastName: '' }

// ผู้ใช้ที่ login อยู่ (อ่านจาก session ที่ store บันทึกไว้)
export function currentUser() {
  const session = read(KEYS.session)
  return (session && session.user) || GUEST_USER
}

export function generateId() {
  let id = ''
  for (let i = 0; i < 24; i++) {
    id += Math.floor(Math.random() * 16).toString(16)
  }
  return id
}

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function seedProducts() {
  const now = Date.now()
  return SEED_PRODUCTS.map((item, index) => {
    const timestamp = new Date(now - index * 3600 * 1000).toISOString()
    return { _id: generateId(), ...item, createdAt: timestamp, updatedAt: timestamp }
  })
}

export const db = {
  getProducts() {
    let products = read(KEYS.products)
    if (!products) {
      products = seedProducts()
      write(KEYS.products, products)
    }
    return products
  },
  saveProducts(products) {
    write(KEYS.products, products)
  },
  getUsers() {
    let users = read(KEYS.users)
    if (!users) {
      const now = new Date().toISOString()
      users = SEED_USERS.map((user) => ({ _id: generateId(), ...user, createdAt: now, updatedAt: now }))
      write(KEYS.users, users)
    }
    return users
  },
  saveUsers(users) {
    write(KEYS.users, users)
  },
  getOrders() {
    return read(KEYS.orders) || []
  },
  saveOrders(orders) {
    write(KEYS.orders, orders)
  },
}

// จำลองการรอ network และคืนสำเนาข้อมูล (กันหน้าจอแก้ข้อมูลในฐานข้อมูลตรงๆ)
export function respond(data, ms = 250) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), ms)
  })
}

export function reject(message, ms = 250) {
  return new Promise((_, fail) => {
    setTimeout(() => fail(new Error(message)), ms)
  })
}
