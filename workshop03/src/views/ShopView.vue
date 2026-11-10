<template>
  <div>
    <section class="shop-hero mb-5">
      <div>
        <h1 class="shop-hero__title">อาหารตามสั่ง ทำใหม่ทุกจาน</h1>
        <p class="shop-hero__text mb-0">เลือกเมนู ปรับตัวเลือกได้ตามใจ แล้วกดสั่งได้เลย</p>
      </div>
      <v-icon class="shop-hero__icon d-none d-sm-flex" size="96">mdi-silverware-fork-knife</v-icon>
    </section>

    <ProductFilterBar v-model="filter" />

    <v-chip-group
      v-if="categories.length > 1"
      v-model="filter.category"
      mandatory
      show-arrows
      active-class="primary--text"
      class="mb-3"
    >
      <v-chip :value="ALL_CATEGORIES" outlined>ทั้งหมด</v-chip>
      <v-chip v-for="category in categories" :key="category" :value="category" outlined>{{ category }}</v-chip>
    </v-chip-group>

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

// หน้าร้าน: แสดงสินค้าทั้งหมด ค้นหา/เรียง/กรองตามหมวดหมู่ และเพิ่มลงตะกร้า
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
      // สินค้าที่มีตัวเลือก ต้องไปเลือกที่หน้ารายละเอียดก่อน
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
  border-radius: 16px;
  background: linear-gradient(120deg, #e4572e 0%, #f2854a 60%, #f2a541 100%);
  color: #fff;
  overflow: hidden;
}
.shop-hero__title {
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 1.35;
  margin-bottom: 6px;
  text-wrap: balance;
}
.shop-hero__text {
  opacity: 0.92;
}
.shop-hero__icon {
  color: rgba(255, 255, 255, 0.35) !important;
  margin: -16px 0;
}
@media (max-width: 600px) {
  .shop-hero {
    padding: 20px;
  }
  .shop-hero__title {
    font-size: 1.25rem;
  }
}
</style>
