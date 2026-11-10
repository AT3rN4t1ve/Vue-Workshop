<template>
  <div>
    <section class="shop-hero mb-5">
      <div>
        <h1 class="shop-hero__title">เลือกซื้อสินค้าที่ใช่ ในราคาที่ชอบ</h1>
        <p class="shop-hero__text mb-0">ส่งฟรีทุกคำสั่งซื้อ · เลือกสินค้าใส่ตะกร้าแล้วสั่งซื้อได้ทันที</p>
      </div>
      <v-icon class="shop-hero__icon d-none d-sm-flex" size="96">mdi-shopping-outline</v-icon>
    </section>

    <ProductFilterBar v-model="filter" />

    <v-alert v-if="error" type="error" text class="mb-5">
      {{ error }}
      <template #append>
        <v-btn small text color="error" @click="load">ลองใหม่</v-btn>
      </template>
    </v-alert>

    <div v-if="!loading && !error" class="text-body-2 grey--text text--darken-1 mb-3">
      พบสินค้า {{ visibleProducts.length | number }} รายการ
    </div>

    <ProductGrid :products="visibleProducts" :loading="loading" @add="addToCart" />

    <EmptyState
      v-if="!loading && !error && visibleProducts.length === 0"
      icon="mdi-package-variant"
      :title="products.length ? 'ไม่พบสินค้าที่ตรงกับเงื่อนไข' : 'ยังไม่มีสินค้าในร้าน'"
      :text="products.length ? 'ลองเปลี่ยนคำค้นหาหรือปิดตัวกรอง' : 'เพิ่มสินค้าได้ที่หน้าจัดการสินค้า'"
    >
      <v-btn v-if="products.length" outlined color="primary" @click="resetFilter">ล้างตัวกรอง</v-btn>
      <v-btn v-else depressed color="primary" to="/admin/products">ไปหน้าจัดการสินค้า</v-btn>
    </EmptyState>
  </div>
</template>

<script>
import productService from '../services/productService'
import ProductFilterBar from '../components/product/ProductFilterBar.vue'
import ProductGrid from '../components/product/ProductGrid.vue'
import EmptyState from '../components/common/EmptyState.vue'

const DEFAULT_FILTER = { search: '', sort: 'newest', inStockOnly: false }

const SORTERS = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name, 'th'),
}

// หน้าร้าน: แสดงสินค้าทั้งหมด ค้นหา/เรียง/กรอง และเพิ่มลงตะกร้า
export default {
  name: 'ShopView',
  components: { ProductFilterBar, ProductGrid, EmptyState },
  data: () => ({
    products: [],
    loading: true,
    error: '',
    filter: { ...DEFAULT_FILTER },
  }),
  computed: {
    visibleProducts() {
      const keyword = this.filter.search.trim().toLowerCase()
      return this.products
        .filter((product) => !this.filter.inStockOnly || product.stock > 0)
        .filter((product) => {
          if (!keyword) return true
          return `${product.name} ${product.description || ''}`.toLowerCase().includes(keyword)
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
        this.error = e.message || 'โหลดสินค้าไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },
    addToCart(product) {
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
