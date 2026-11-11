<template>
  <div>
    <section class="shop-hero mb-2">
      <div class="shop-hero__content">
        <span v-if="!loading && products.length" class="shop-hero__eyebrow">
          <v-icon x-small color="white" class="mr-1">mdi-silverware-fork-knife</v-icon>
          เมนูวันนี้ {{ products.length | number }} รายการ
        </span>
        <h1 class="shop-hero__title">อาหารตามสั่ง<br>ทำใหม่ร้อนๆ ทุกจาน</h1>
        <p class="shop-hero__text mb-0">เลือกเมนู ปรับตัวเลือกได้ตามใจ แล้วกดสั่งได้เลย</p>
      </div>

      <div class="shop-hero__art" aria-hidden="true">
        <span class="shop-hero__plate shop-hero__plate--main">🍛</span>
        <span class="shop-hero__plate shop-hero__plate--a">🍳</span>
        <span class="shop-hero__plate shop-hero__plate--b">🌶️</span>
        <span class="shop-hero__plate shop-hero__plate--c">🥤</span>
      </div>
    </section>

    <ProductFilterBar v-model="filter" :categories="categories" :all-value="ALL_CATEGORIES" />

    <v-alert v-if="error" type="error" text class="mb-5">
      {{ error }}
      <template #append>
        <v-btn small text color="error" @click="load">ลองใหม่</v-btn>
      </template>
    </v-alert>

    <div v-if="!loading && !error" class="text-body-2 grey--text text--darken-1 mb-3">
      พบ {{ visibleProducts.length | number }} เมนู
    </div>

    <ProductGrid :products="visibleProducts" :loading="loading" @add="addToCart" />

    <EmptyState
      v-if="!loading && !error && visibleProducts.length === 0"
      icon="mdi-food-off-outline"
      :title="products.length ? 'ไม่พบเมนูที่ตรงกับเงื่อนไข' : 'ยังไม่มีเมนูในร้าน'"
      :text="products.length ? 'ลองเปลี่ยนคำค้นหาหรือปิดตัวกรอง' : emptyShopText"
    >
      <v-btn v-if="products.length" outlined color="primary" @click="resetFilter">ล้างตัวกรอง</v-btn>
      <v-btn v-else-if="isAdmin" depressed color="primary" to="/admin/products">ไปหน้าจัดการเมนู</v-btn>
    </EmptyState>
  </div>
</template>

<script>
import productService from '../services/productService'
import ProductFilterBar from '../components/product/ProductFilterBar.vue'
import ProductGrid from '../components/product/ProductGrid.vue'
import EmptyState from '../components/common/EmptyState.vue'
import { DEFAULT_CATEGORY } from '../utils/constants'

const ALL_CATEGORIES = '__all__'
const DEFAULT_FILTER = { search: '', sort: 'newest', inStockOnly: false, category: ALL_CATEGORIES }
const categoryOf = (product) => product.category || DEFAULT_CATEGORY

const SORTERS = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name, 'th'),
}

export default {
  name: 'ShopView',
  components: { ProductFilterBar, ProductGrid, EmptyState },
  data: () => ({
    ALL_CATEGORIES,
    products: [],
    loading: true,
    error: '',
    filter: { ...DEFAULT_FILTER },
  }),
  computed: {
    isAdmin() {
      return this.$store.getters['auth/isAdmin']
    },
    emptyShopText() {
      return this.isAdmin ? 'เพิ่มเมนูได้ที่หน้าจัดการเมนู' : 'รอทางร้านเพิ่มเมนู'
    },
    categories() {
      return [...new Set(this.products.map(categoryOf))].sort((a, b) => a.localeCompare(b, 'th'))
    },
    visibleProducts() {
      const keyword = this.filter.search.trim().toLowerCase()
      const { category } = this.filter
      return this.products
        .filter((product) => !this.filter.inStockOnly || product.stock > 0)
        .filter((product) => category === ALL_CATEGORIES || categoryOf(product) === category)
        .filter((product) => {
          if (!keyword) return true
          return `${product.name} ${product.description || ''} ${categoryOf(product)}`.toLowerCase().includes(keyword)
        })
        .sort(SORTERS[this.filter.sort] || SORTERS.newest)
    },
  },
  created() {
    this.load()
  },
  methods: {
    async load() {
      this.loading = true
      this.error = ''
      try {
        this.products = await productService.getAll()
      } catch (e) {
        this.error = e.message || 'โหลดเมนูไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },
    addToCart(product) {
      if ((product.optionGroups || []).length > 0) {
        this.$router.push({ name: 'product-detail', params: { id: product._id } })
        return
      }
      this.$store.dispatch('cart/add', { product, quantity: 1 })
    },
    resetFilter() {
      this.filter = { ...DEFAULT_FILTER }
    },
  },
}
</script>

<style scoped>
.shop-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 220px;
  padding: 36px 44px;
  border-radius: var(--radius-xl);
  background:
    radial-gradient(circle at 85% 20%, rgba(255, 255, 255, 0.22) 0, rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 10% 110%, rgba(242, 165, 65, 0.55) 0, rgba(242, 165, 65, 0) 50%),
    linear-gradient(125deg, var(--v-primary-base) 0%, #ef7442 55%, #f39a4c 100%);
  color: #fff;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(228, 87, 46, 0.25);
}
.shop-hero__content {
  position: relative;
  z-index: 1;
  max-width: 520px;
}
.shop-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.2);
  font-size: 0.8rem;
  font-weight: 500;
}
.shop-hero__title {
  font-size: 2.1rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 10px;
}
.shop-hero__text {
  font-size: 1rem;
  opacity: 0.92;
}
.shop-hero__art {
  position: relative;
  flex-shrink: 0;
  width: 240px;
  height: 180px;
}
.shop-hero__plate {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff;
  font-family: var(--font-emoji);
  line-height: 1;
  box-shadow: 0 12px 28px rgba(122, 38, 12, 0.25);
}
.shop-hero__plate--main {
  top: 10px;
  left: 50px;
  width: 160px;
  height: 160px;
  font-size: 88px;
  box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.18), 0 18px 36px rgba(122, 38, 12, 0.3);
}
.shop-hero__plate--a {
  top: 0;
  left: 0;
  width: 64px;
  height: 64px;
  font-size: 34px;
}
.shop-hero__plate--b {
  bottom: 0;
  left: 14px;
  width: 52px;
  height: 52px;
  font-size: 26px;
}
.shop-hero__plate--c {
  top: 26px;
  right: 0;
  width: 56px;
  height: 56px;
  font-size: 28px;
}
@media (max-width: 960px) {
  .shop-hero {
    padding: 28px;
  }
  .shop-hero__title {
    font-size: 1.7rem;
  }
}
@media (max-width: 600px) {
  .shop-hero {
    min-height: 0;
    padding: 22px 20px;
    border-radius: var(--radius-lg);
  }
  .shop-hero__title {
    font-size: 1.35rem;
  }
  .shop-hero__text {
    font-size: 0.9rem;
  }
  .shop-hero__art {
    position: absolute;
    right: -18px;
    bottom: -22px;
    width: 120px;
    height: 120px;
    opacity: 0.95;
  }
  .shop-hero__plate--main {
    top: 0;
    left: 0;
    width: 110px;
    height: 110px;
    font-size: 58px;
  }
  .shop-hero__plate--a,
  .shop-hero__plate--b,
  .shop-hero__plate--c {
    display: none;
  }
  .shop-hero__content {
    max-width: calc(100% - 96px);
  }
}
</style>
