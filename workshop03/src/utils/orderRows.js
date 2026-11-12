import { orderStatus } from './constants'
import { optionsText } from './options'

export const NEXT_STEP = {
  pending: { status: 'cooking', text: 'รับออเดอร์' },
  cooking: { status: 'done', text: 'เสร็จแล้ว' },
  done: { status: 'delivered', text: 'ส่งให้ลูกค้า' },
}

// ออเดอร์ที่ยังไม่จบ (ลูกค้ายังต้องติดตาม)
export const ACTIVE_STATUSES = ['pending', 'cooking', 'done']
// ออเดอร์ที่ร้านยังยกเลิกได้ (เสร็จแล้วยกเลิกไม่ได้)
export const CANCELLABLE_STATUSES = ['pending', 'cooking']

// แปลงออเดอร์จาก API ให้อยู่ในรูปที่ตาราง การ์ด และบอร์ดใช้ร่วมกัน
export function toOrderRow(order, admin = false) {
  const user = order.user || {}
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')
  const statusInfo = orderStatus(order.status)
  return {
    ...order,
    code: String(order._id).slice(-6).toUpperCase(),
    productName: order.product ? order.product.name : order.productName || 'ไม่ทราบชื่อเมนู',
    productCategory: order.product ? order.product.category : '',
    imageUrl: order.product ? order.product.imageUrl : '',
    productDeleted: !order.product,
    optionsText: optionsText(order.options),
    customer: fullName || user.email || '-',
    statusInfo,
    statusText: statusInfo.text,
    next: admin ? NEXT_STEP[order.status] : null,
    canCancel: admin ? CANCELLABLE_STATUSES.includes(order.status) : order.status === 'pending',
  }
}

export function matchesOrder(row, keyword) {
  const text = String(keyword || '').trim().toLowerCase()
  if (!text) return true
  return `${row.code} ${row.productName} ${row.customer} ${row.optionsText} ${row.note || ''}`.toLowerCase().includes(text)
}

export const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
