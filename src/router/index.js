import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// ทุก path ของหน้า = id ของการ์ด/section ในหน้า
// หน้าเว็บยังเป็นหน้าเดียว: เปลี่ยน path → เลื่อนไปที่การ์ดนั้น + ไฮไลต์
export const SECTIONS = [
  'home', // ชื่อ + รูปโปรไฟล์
  'education',
  'teams',
  'hobbies',
  'likes',
  'dislikes',
  'free-design',
  'strengths',
]

const NAV_OFFSET = 80 // ความสูง navbar ที่ sticky อยู่ด้านบน

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
    { path: '*', redirect: '/home' }, // path แปลกๆ → กลับ home
  ],
  scrollBehavior(to, from, savedPosition) {
    // กด back/forward ของเบราว์เซอร์ → กลับไปตำแหน่งเดิม
    return savedPosition || scrollTarget(to.params.section)
  },
})

function scrollToSection(section) {
  const el = section === 'home' ? null : document.getElementById(section)
  const top = el ? el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET : 0
  window.scrollTo({ top, behavior: 'smooth' })
}

// ใช้ตอนกดการ์ด/เมนู: ถ้าอยู่ path นั้นอยู่แล้วก็แค่เลื่อนกลับไปหา
export function goToSection(section) {
  if (router.currentRoute.params.section === section) {
    scrollToSection(section)
    return
  }
  router.push(`/${section}`).catch(() => {})
}

export default router
