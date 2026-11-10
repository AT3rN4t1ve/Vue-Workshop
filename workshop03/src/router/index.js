import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import ShopView from '../views/ShopView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CartView from '../views/CartView.vue'
import ManageProductsView from '../views/admin/ManageProductsView.vue'
import ManageOrdersView from '../views/admin/ManageOrdersView.vue'
import ManageUsersView from '../views/admin/ManageUsersView.vue'

Vue.use(VueRouter)

// meta.guest = เข้าได้เฉพาะตอนยังไม่ login, meta.admin = เฉพาะ admin
// หน้าอื่นทั้งหมดต้อง login ก่อน (เหมือน Back-end ที่ทุก endpoint ต้องมี token)
const routes = [
  { path: '/login', name: 'login', component: LoginView, meta: { title: 'เข้าสู่ระบบ', guest: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { title: 'สมัครสมาชิก', guest: true } },
  { path: '/', name: 'shop', component: ShopView, meta: { title: 'ร้านค้า' } },
  { path: '/products/:id', name: 'product-detail', component: ProductDetailView, props: true, meta: { title: 'รายละเอียดสินค้า' } },
  { path: '/cart', name: 'cart', component: CartView, meta: { title: 'ตะกร้าสินค้า' } },
  { path: '/admin/products', name: 'manage-products', component: ManageProductsView, meta: { title: 'จัดการสินค้า' } },
  { path: '/admin/orders', name: 'manage-orders', component: ManageOrdersView, meta: { title: 'คำสั่งซื้อ' } },
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
  document.title = `${to.meta.title || 'ร้านค้า'} | WorkShop Store`
})

export default router
