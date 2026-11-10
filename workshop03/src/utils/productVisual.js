
const PALETTE = [
  { bg: '#FFF1E8', fg: '#E4572E' },
  { bg: '#E8F3FF', fg: '#2F6FED' },
  { bg: '#E9F7EF', fg: '#1E8E5A' },
  { bg: '#FFF8E1', fg: '#C98A00' },
  { bg: '#F3ECFF', fg: '#7A4FD6' },
  { bg: '#FFE9EF', fg: '#D6336C' },
  { bg: '#E6F7F8', fg: '#0E8A94' },
  { bg: '#EEF0F4', fg: '#4A5568' },
]

const LEADING_VOWELS = 'เแโใไ'

export function productVisual(name = '') {
  const text = String(name).trim()
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) % 100000
  }
  const color = PALETTE[hash % PALETTE.length]
  const length = LEADING_VOWELS.includes(text.charAt(0)) ? 2 : 1
  const initial = text.slice(0, length).toUpperCase() || '?'
  return { ...color, initial }
}
