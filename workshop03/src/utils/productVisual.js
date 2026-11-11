
const PALETTE = [
  { bg: '#FFEBDD', fg: '#E4572E' },
  { bg: '#FFF4D6', fg: '#C98A00' },
  { bg: '#E7F4E4', fg: '#2F8F4E' },
  { bg: '#FDE6E4', fg: '#D64545' },
  { bg: '#F3E9DD', fg: '#8A5A3C' },
  { bg: '#E6F2F1', fg: '#0E8A94' },
]

const LEADING_VOWELS = 'เแโใไ'

const DRINK_PREFIXES = ['น้ำ', 'ชา', 'กาแฟ', 'โกโก้', 'นม', 'โซดา', 'ไมโล', 'โอเลี้ยง', 'โค้ก', 'เป๊ปซี่']

const EMOJI_RULES = [
  { emoji: '🍨', words: ['ของหวาน', 'ขนม', 'ไอศกรีม', 'ไอติม', 'บัวลอย', 'ทับทิมกรอบ', 'ลอดช่อง', 'เค้ก'] },
  { emoji: '🍜', words: ['ก๋วยเตี๋ยว', 'บะหมี่', 'ราดหน้า', 'ผัดซีอิ๊ว', 'ผัดไทย', 'เส้น', 'มาม่า', 'สุกี้'] },
  { emoji: '🍲', words: ['ต้มยำ', 'ต้มข่า', 'ต้มจืด', 'แกง', 'ซุป', 'พะโล้'] },
  { emoji: '🥗', words: ['ส้มตำ', 'สลัด', 'ยำ', 'ลาบ', 'น้ำตก'] },
  { emoji: '🍤', words: ['กุ้ง'] },
  { emoji: '🍗', words: ['ไก่ทอด', 'ปีกไก่', 'ไก่ย่าง'] },
  { emoji: '🍛', words: ['ข้าว', 'กะเพรา', 'กระเพรา', 'ผัด', 'คะน้า'] },
  { emoji: '🍳', words: ['ไข่'] },
]

function hashOf(text) {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) % 100000
  }
  return hash
}

export function productEmoji(name = '', category = '') {
  const text = String(name).trim()
  const group = String(category).trim()
  if (group.includes('เครื่องดื่ม') || DRINK_PREFIXES.some((prefix) => text.startsWith(prefix))) return '🥤'
  const haystack = `${group} ${text}`
  const rule = EMOJI_RULES.find(({ words }) => words.some((word) => haystack.includes(word)))
  return rule ? rule.emoji : '🍽️'
}

export function productVisual(name = '', category = '') {
  const text = String(name).trim()
  const color = PALETTE[hashOf(text) % PALETTE.length]
  const length = LEADING_VOWELS.includes(text.charAt(0)) ? 2 : 1
  const initial = text.slice(0, length).toUpperCase() || '?'
  return { ...color, initial, emoji: productEmoji(text, category) }
}
