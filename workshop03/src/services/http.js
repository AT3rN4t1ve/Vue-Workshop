// ตัวยิง request กลางไปที่ Workshop Back-end — service ทุกไฟล์เรียกผ่านไฟล์นี้
//   - แนบ Authorization: Bearer <token> ให้อัตโนมัติ
//   - Back-end ตอบ { status, message, data } เสมอ: สำเร็จคืน data, ไม่สำเร็จ throw Error(ข้อความภาษาไทย)
//   - 401 ขณะ login อยู่ (token หมดอายุ / ใช้ไม่ได้) จะเรียก onUnauthorized ให้ออกจากระบบ ยกเว้นกรณีไม่มีสิทธิ์ admin
// เปลี่ยนที่อยู่ API ได้ด้วยตัวแปร VUE_APP_API_URL ในไฟล์ .env.local

import { orderStatus } from '../utils/constants'

const BASE_URL =process.env.VUE_APP_API_URL || 'http://localhost:3000/api/v1'

// main.js เป็นคนกำหนด (เลี่ยงการ import store ตรงนี้ซึ่งจะวนกลับมาหา service)
const handlers = {
  getToken: () => null,
  onUnauthorized: () => {},
}

export function configureHttp(options) {
  Object.assign(handlers, options)
}

// Back-end ใช้ 401 ทั้งกรณี token ใช้ไม่ได้และกรณีไม่มีสิทธิ์ แยกกันด้วยข้อความนี้
const FORBIDDEN = 'forbidden: admin only'

// ข้อความจาก Back-end (อังกฤษ) -> ข้อความที่แสดงบนหน้าจอ
const MESSAGES = {
  'email and password are required': 'กรุณากรอกอีเมลและรหัสผ่าน',
  'email already exists': 'อีเมลนี้ถูกใช้แล้ว',
  'invalid email format': 'รูปแบบอีเมลไม่ถูกต้อง',
  'invalid email or password, please register':
    'อีเมลหรือรหัสผ่านไม่ถูกต้อง หากยังไม่มีบัญชีกรุณาสมัครสมาชิก',
  'waiting for approval': 'บัญชีนี้ยังรอผู้ดูแลระบบอนุมัติ',
  unauthorized: 'กรุณาเข้าสู่ระบบใหม่',
  'invalid or expired token': 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',
  [FORBIDDEN]: 'เฉพาะผู้ดูแลระบบเท่านั้น',
  'product not found': 'ไม่พบเมนูนี้',
  'user not found': 'ไม่พบผู้ใช้',
  'not found': 'ไม่พบข้อมูล',
  'order not found': 'ไม่พบออเดอร์',
  'quantity must be an integer greater than 0': 'จำนวนต้องเป็นจำนวนเต็มตั้งแต่ 1 ขึ้นไป',
  'note must be text up to 200 characters': 'หมายเหตุยาวได้ไม่เกิน 200 ตัวอักษร',
  'options must be an array': 'ตัวเลือกไม่ถูกต้อง',
  'each option must have group and choice': 'ตัวเลือกไม่ถูกต้อง',
  'invalid status': 'สถานะไม่ถูกต้อง',
  'stock must be an integer': 'จำนวนที่ขายได้ต้องเป็นจำนวนเต็ม',
  'option group must have at least one choice': 'กลุ่มตัวเลือกต้องมีอย่างน้อย 1 ตัวเลือก',
  'duplicate choice name in option group': 'ชื่อตัวเลือกในกลุ่มเดียวกันซ้ำกัน',
  'duplicate option group name': 'ชื่อกลุ่มตัวเลือกซ้ำกัน',
  'invalid JSON body': 'ข้อมูลที่ส่งไม่ถูกต้อง',
  'internal server error': 'เซิร์ฟเวอร์ขัดข้อง กรุณาลองใหม่อีกครั้ง',
}

// ข้อความที่มีค่าแปรผันอยู่ข้างใน
const PATTERNS = [
  [/quantity exceeds stock \(stock: (\d+)\)/, (m) => `เมนูนี้เหลือไม่พอ (เหลือ ${m[1]} จาน)`],
  [/^option required: (.+)$/, (m) => `กรุณาเลือก "${m[1]}"`],
  [/^only one choice allowed: (.+)$/, (m) => `"${m[1]}" เลือกได้เพียงอย่างเดียว`],
  [/^duplicate option: (.+)$/, (m) => `เลือก "${m[1]}" ซ้ำกัน`],
  [/^invalid option: (.+)$/, (m) => `ตัวเลือก "${m[1]}" ไม่มีในเมนูนี้แล้ว`],
  [
    /^cannot change status from (\w+) to (\w+)$/,
    (m) => `เปลี่ยนสถานะจาก "${orderStatus(m[1]).text}" เป็น "${orderStatus(m[2]).text}" ไม่ได้`,
  ],
  [/^duplicate value/, () => 'ข้อมูลนี้มีอยู่ในระบบแล้ว'],
  [/^route not found/, () => 'ไม่พบ API ที่เรียก กรุณาตรวจสอบเวอร์ชันของ Back-end'],
]

function translate(body) {
  const message = (body && body.message) || ''

  if (message === 'validation error') {
    const details = Array.isArray(body.data) ? body.data.map((text) => MESSAGES[text] || text).join(', ') : ''
    return details ? `ข้อมูลไม่ถูกต้อง: ${details}` : 'ข้อมูลไม่ถูกต้อง'
  }

  for (const [pattern, toText] of PATTERNS) {
    const match = message.match(pattern)
    if (match) return toText(match)
  }

  return MESSAGES[message] || message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
}

async function request(method, path, body) {
  const token = handlers.getToken()
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (e) {
    throw new Error('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบว่า Back-end เปิดอยู่')
  }

  const result = await response.json().catch(() => null)
  if (response.ok && result) return result.data

  // ไม่มีสิทธิ์ (ไม่ใช่ admin) ไม่ต้องออกจากระบบ แค่แจ้ง error
  const forbidden = result && result.message === FORBIDDEN
  if (response.status === 401 && token && !forbidden) handlers.onUnauthorized()

  const error = new Error(translate(result))
  error.status = response.status
  throw error
}

export default {
  get: (path) => request('GET', path),
  post: (path, body = {}) => request('POST', path, body),
  put: (path, body = {}) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
}
