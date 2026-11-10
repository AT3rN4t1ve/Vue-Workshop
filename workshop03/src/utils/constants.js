export const APP_NAME = 'WorkShop ตามสั่ง'

export const LOW_STOCK = 5

export const DEFAULT_CATEGORY = 'อื่นๆ'

export const NOTE_MAX_LENGTH = 200

export const ORDER_STATUS = {
  pending: { text: 'รอรับออเดอร์', color: '#C98A00', tint: '#FFF8E1', icon: 'mdi-clock-outline' },
  cooking: { text: 'กำลังทำ', color: '#2F6FED', tint: '#E8F3FF', icon: 'mdi-pot-steam-outline' },
  done: { text: 'เสร็จแล้ว', color: '#1E8E5A', tint: '#E6F5EC', icon: 'mdi-check-circle-outline' },
  cancelled: { text: 'ยกเลิก', color: '#D64545', tint: '#FDECEC', icon: 'mdi-close-circle-outline' },
}

export function orderStatus(status) {
  return ORDER_STATUS[status] || { text: status || '-', color: '#4A5568', tint: '#EEF0F4', icon: 'mdi-help-circle-outline' }
}
