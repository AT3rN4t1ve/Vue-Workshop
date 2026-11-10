export function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function onScrollFrame(callback) {
  let ticking = false
  const handler = () => {
    if (ticking) return
    ticking = true
    window.requestAnimationFrame(() => {
      callback(window.scrollY)
      ticking = false
    })
  }
  window.addEventListener('scroll', handler, { passive: true })
  callback(window.scrollY)
  return () => window.removeEventListener('scroll', handler)
}
