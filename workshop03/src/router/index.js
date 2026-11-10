import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import { APP_NAME } from '../utils/constants'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import ShopView from '../views/ShopView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CartView from '../views/CartView.vue'
import ManageProductsView from '../views/admin/ManageProductsView.vue'
import OrdersView from '../views/OrdersView.vue'
import ManageUsersView from '../views/admin/ManageUsersView.vue'

Vue.use(VueRouter)

// meta.guest = เข้าได้เฉพาะตอนยังไม่ login, meta.admin = เฉพาะ admin
// หน้าอื่นทั้งหมดต้อง login ก่อน (เหมือน Back-end ที่ทุก endpoint ต้องมี token)
// สิทธิ์ตรงกับ Back-end: จัดการสินค้า/ผู้ใช้ เฉพาะ admin ส่วนหน้าคำสั่งซื้อ user เห็นแค่ของตัวเอง
const routes = [
  { path: '/login', name: 'login', component: LoginView, meta: { title: 'เข้าสู่ระบบ', guest: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { title: 'สมัครสมาชิก', guest: true } },
  { path: '/', name: 'shop', component: ShopView, meta: { title: 'เมนูอาหาร' } },
  { path: '/products/:id', name: 'product-detail', component: ProductDetailView, props: true, meta: { title: 'รายละเอียดเมนู' } },
  { path: '/cart', name: 'cart', component: CartView, meta: { title: 'ตะกร้า' } },
  { path: '/orders', name: 'orders', component: OrdersView, meta: { title: 'ออเดอร์' } },
  { path: '/admin/products', name: 'manage-products', component: ManageProductsView, meta: { title: 'จัดการเมนู', admin: true } },
  { path: '/admin/users', name: 'manage-users', component: ManageUsersView, meta: { title: 'ผู้ใช้', admin: true } },
  { path: '*', redirect: '/' },
]

const router = new VueRouter({
  routes,
  scrollBehavior: () => ({ x: 0, y: 0 }),
})

router.beforeEach((to, from, next) => {
  const loggedIn = store.getters['auth/isLoggedIn']

  if (to.meta.guest) return loggedIn ? next({ name: 'shop' }) : next()
  if (!loggedIn) {
    return next({ name: 'login', query: to.fullPath === '/' ? {} : { redirect: to.fullPath } })
  }
  if (to.meta.admin && !store.getters['auth/isAdmin']) return next({ name: 'shop' })
  next()
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'เมนูอาหาร'} | ${APP_NAME}`
})

export default router
