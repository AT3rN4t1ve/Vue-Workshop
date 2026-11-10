import { prefersReducedMotion } from '../utils/motion'

const STAGGER_MS = 90
let observer = null

function show(el, delay = 0) {
  el.style.setProperty('--reveal-delay', `${delay}ms`)
  el.classList.add('is-revealed')
}

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, i) => {
          show(entry.target, i * STAGGER_MS)
          observer.unobserve(entry.target)
        })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  )
  return observer
}

export default {
  inserted(el) {
    el.classList.add('reveal')
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      show(el)
      return
    }
    getObserver().observe(el)
  },
  unbind(el) {
    if (observer) observer.unobserve(el)
  },
}
