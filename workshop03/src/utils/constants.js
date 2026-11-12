export const APP_NAME = 'Krua TamSang'
export const APP_NAME_TH = 'ครัวตามสั่ง'

export const LOW_STOCK = 5

export const DEFAULT_CATEGORY = 'อื่นๆ'

export const NOTE_MAX_LENGTH = 200

export const ORDER_STATUS = {
  pending: { text: 'รอรับออเดอร์', color: '#7A4F00', tint: '#FFF4D6', icon: 'mdi-clock-outline' },
  cooking: { text: 'กำลังทำ', color: '#1F55C7', tint: '#E8F0FF', icon: 'mdi-pot-steam-outline' },
  done: { text: 'เสร็จแล้ว รอส่ง', color: '#6B3FA0', tint: '#F1EAFB', icon: 'mdi-bell-ring-outline' },
  delivered: { text: 'ส่งแล้ว', color: '#17663F', tint: '#E3F4EA', icon: 'mdi-check-circle-outline' },
  cancelled: { text: 'ยกเลิก', color: '#B3261E', tint: '#FDECEC', icon: 'mdi-close-circle-outline' },
}

export function orderStatus(status) {
  return ORDER_STATUS[status] || { text: status || '-', color: '#4A5568', tint: '#EEF0F4', icon: 'mdi-help-circle-outline' }
}
