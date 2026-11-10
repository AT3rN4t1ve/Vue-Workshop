import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const SECTIONS = [
  'home',
  'personal',
  'hobbies',
  'likes',
  'dislikes',
  'teams',
  'skills',
  'education',
  'free-design',
  'strengths',
]

const NAV_OFFSET = 80

function scrollTarget(section) {
  if (!section || section === 'home') return { x: 0, y: 0, behavior: 'smooth' }
  return { selector: `#${section}`, offset: { x: 0, y: NAV_OFFSET }, behavior: 'smooth' }
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: '/home' },
    { path: `/:section(${SECTIONS.join('|')})`, name: 'section' },
    { path: '*', redirect: '/home' },
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || scrollTarget(to.params.section)
  },
})

function scrollToSection(section) {
  const el = section === 'home' ? null : document.getElementById(section)
  const top = el ? el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET : 0
  window.scrollTo({ top, behavior: 'smooth' })
}

export function goToSection(section) {
  if (router.currentRoute.params.section === section) {
    scrollToSection(section)
    return
  }
  router.push(`/${section}`).catch(() => {})
}

export default router
