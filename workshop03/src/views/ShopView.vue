<template>
  <div>
    <h1 class="d-sr-only">เมนูอาหาร</h1>
    <MenuStrip :products="products" :loading="loading" class="mb-4" />

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
import MenuStrip from '../components/product/MenuStrip.vue'
import ProductFilterBar from '../components/product/ProductFilterBar.vue'
import ProductGrid from '../components/product/ProductGrid.vue'
import EmptyState from '../components/common/EmptyState.vue'
import { DEFAULT_CATEGORY } from '../utils/constants'
import { compareRecommended } from '../utils/productVisual'

const ALL_CATEGORIES = '__all__'
const DEFAULT_FILTER = { search: '', sort: 'recommended', inStockOnly: false, category: ALL_CATEGORIES }
const categoryOf = (product) => product.category || DEFAULT_CATEGORY

const SORTERS = {
  recommended: compareRecommended,
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name, 'th'),
}

export default {
  name: 'ShopView',
  components: { MenuStrip, ProductFilterBar, ProductGrid, EmptyState },
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
        .sort(SORTERS[this.filter.sort] || SORTERS.recommended)
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

