const STORAGE_KEY = 'about-me:theme'

export const PALETTES = [
  { id: 'violet', label: 'Violet', swatch: 'linear-gradient(135deg, #7c3aed, #ec4899)' },
  { id: 'ocean', label: 'Ocean', swatch: 'linear-gradient(135deg, #0ea5e9, #6366f1)' },
  { id: 'emerald', label: 'Emerald', swatch: 'linear-gradient(135deg, #10b981, #84cc16)' },
  { id: 'sunset', label: 'Sunset', swatch: 'linear-gradient(135deg, #f97316, #e11d48)' },
  { id: 'mono', label: 'Mono', swatch: 'linear-gradient(135deg, #334155, #94a3b8)' },
]

export const MODES = [
  { id: 'auto', label: 'ตามเครื่อง', icon: '🖥️' },
  { id: 'light', label: 'สว่าง', icon: '☀️' },
  { id: 'dark', label: 'มืด', icon: '🌙' },
]

const DEFAULT_THEME = { palette: 'violet', mode: 'auto' }

const isValid = (list, id) => list.some((item) => item.id === id)

export function loadTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
    return {
      palette: isValid(PALETTES, saved.palette) ? saved.palette : DEFAULT_THEME.palette,
      mode: isValid(MODES, saved.mode) ? saved.mode : DEFAULT_THEME.mode,
    }
  } catch (e) {
    return { ...DEFAULT_THEME }
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
  } catch (e) {
    // บันทึกไม่ได้ก็ไม่เป็นไร ธีมยังใช้ได้ในหน้านี้
  }
}

export function applyTheme({ palette, mode }) {
  const root = document.documentElement
  root.dataset.palette = palette
  root.dataset.mode = mode
}
