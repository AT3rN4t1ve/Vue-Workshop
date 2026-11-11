import { prefersReducedMotion } from '../utils/motion'

// ท่าที่ใช้ได้: v-reveal (up), v-reveal="'left'", v-reveal="'right'", v-reveal="'zoom'"
const VARIANTS = ['up', 'left', 'right', 'zoom']
const STAGGER_MS = 120
// true = เล่นใหม่ทุกครั้งที่เลื่อนกลับขึ้นไปแล้วเลื่อนลงมาเจออีกรอบ
const REPLAY = true

let observer = null

function indexItems(el) {
  el.querySelectorAll('.reveal-item').forEach((item, i) => {
    item.style.setProperty('--i', i)
  })
}

function show(el, delay = 0) {
  indexItems(el)
  el.style.setProperty('--reveal-delay', `${delay}ms`)
  el.classList.add('is-revealed')
}

function hide(el) {
  el.style.setProperty('--reveal-delay', '0ms')
  el.classList.remove('is-revealed')
}

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      let i = 0
      entries.forEach((entry) => {
        const el = entry.target
        if (entry.isIntersecting) {
          if (!el.classList.contains('is-revealed')) show(el, i++ * STAGGER_MS)
          if (!REPLAY) observer.unobserve(el)
        } else if (entry.boundingClientRect.top > 0) {
          // ซ่อนเฉพาะตอนหลุดลงไปด้านล่างจอ (ผู้ใช้เลื่อนกลับขึ้น)
          // ถ้าหลุดออกทางด้านบนจะไม่ซ่อน กันการ์ดกระพริบที่ขอบบน
          hide(el)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  )
  return observer
}

function setVariant(el, value) {
  el.dataset.reveal = VARIANTS.includes(value) ? value : 'up'
}

export default {
  inserted(el, binding) {
    setVariant(el, binding.value)
    el.classList.add('reveal')
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      show(el)
      return
    }
    getObserver().observe(el)
  },
  update(el, binding) {
    if (binding.value !== binding.oldValue) setVariant(el, binding.value)
  },
  unbind(el) {
    if (observer) observer.unobserve(el)
  },
}
