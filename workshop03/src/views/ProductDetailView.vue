<template>
  <div>
    <v-btn text class="mb-3 ml-n3" to="/" exact>
      <v-icon left>mdi-arrow-left</v-icon>
      กลับไปหน้าร้าน
    </v-btn>

    <v-card v-if="loading" class="surface-card pa-6">
      <v-row>
        <v-col cols="12" md="5"><v-skeleton-loader type="image, image" /></v-col>
        <v-col cols="12" md="7"><v-skeleton-loader type="heading, paragraph, sentences, actions" /></v-col>
      </v-row>
    </v-card>

    <v-card v-else-if="!product" class="surface-card">
      <EmptyState icon="mdi-package-variant-remove" title="ไม่พบสินค้านี้" text="สินค้าอาจถูกลบไปแล้ว">
        <v-btn depressed color="primary" to="/">กลับไปเลือกสินค้า</v-btn>
      </EmptyState>
    </v-card>

    <v-card v-else class="surface-card pa-4 pa-md-6">
      <v-row>
        <v-col cols="12" sm="5">
          <ProductThumb :name="product.name" font-size="6rem" :class="{ 'thumb--sold-out': soldOut }" />
        </v-col>

        <v-col cols="12" sm="7" class="d-flex flex-column">
          <StockChip :stock="product.stock" show-amount class="align-self-start mb-3" />
          <h1 class="detail-name mb-3">{{ product.name }}</h1>

          <div class="detail-price-box mb-5">
            <span class="detail-price tabular">{{ product.price | price }}</span>
          </div>

          <div class="text-subtitle-2 font-weight-bold mb-1">รายละเอียดสินค้า</div>
          <p class="detail-description text-body-1 grey--text text--darken-2 mb-6">
            {{ product.description || 'ไม่มีรายละเอียดเพิ่มเติม' }}
          </p>

          <div class="mt-auto">
            <div class="d-flex align-center flex-wrap mb-5">
              <span class="text-body-2 grey--text text--darken-1 mr-4">จำนวน</span>
              <QuantityInput v-model="quantity" :max="Math.max(available, 1)" :disabled="available <= 0" />
              <span v-if="inCart > 0" class="text-caption grey--text text--darken-1 ml-4">
                มีในตะกร้าแล้ว {{ inCart }} ชิ้น
              </span>
            </div>

            <div class="d-flex flex-wrap detail-actions">
              <v-btn color="primary" outlined large :disabled="available <= 0" @click="addToCart">
                <v-icon left>mdi-cart-plus</v-icon>
                เพิ่มลงตะกร้า
              </v-btn>
              <v-btn color="primary" depressed large :disabled="available <= 0" @click="buyNow">
                ซื้อเลย
              </v-btn>
            </div>

            <div v-if="soldOut" class="text-body-2 error--text mt-3">สินค้าหมดชั่วคราว</div>
            <div v-else-if="available <= 0" class="text-body-2 grey--text text--darken-1 mt-3">
              คุณใส่สินค้านี้ในตะกร้าครบจำนวนคงเหลือแล้ว
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import productService from '../services/productService'
import ProductThumb from '../components/common/ProductThumb.vue'
import StockChip from '../components/common/StockChip.vue'
import QuantityInput from '../components/common/QuantityInput.vue'
import EmptyState from '../components/common/EmptyState.vue'

// หน้ารายละเอียดสินค้า: เลือกจำนวน แล้วเพิ่มลงตะกร้าหรือซื้อเลย
export default {
  name: 'ProductDetailView',
  components: { ProductThumb, StockChip, QuantityInput, EmptyState },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    product: null,
    loading: true,
    quantity: 1,
  }),
  computed: {
    soldOut() {
      return this.product.stock <= 0
    },
    inCart() {
      return this.$store.getters['cart/quantityOf'](this.product._id)
    },
    // จำนวนที่ยังเพิ่มลงตะกร้าได้อีก
    available() {
      return this.product.stock - this.inCart
    },
  },
  watch: {
    id: {
      immediate: true,
      handler: 'load',
    },
  },
  methods: {
    async load() {
      this.loading = true
      this.quantity = 1
      try {
        this.product = await productService.getById(this.id)
      } catch (e) {
        this.product = null
      } finally {
        this.loading = false
      }
    },
    async addToCart() {
      const added = await this.$store.dispatch('cart/add', { product: this.product, quantity: this.quantity })
      if (added) this.quantity = 1
      return added
    },
    async buyNow() {
      if (await this.addToCart()) this.$router.push({ name: 'cart' })
    },
  },
}
</script>

<style scoped>
.thumb--sold-out {
  filter: grayscale(1);
  opacity: 0.6;
}
.detail-name {
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 1.35;
  color: #1f2937;
}
.detail-price-box {
  background: #fff6f2;
  border-radius: 10px;
  padding: 14px 18px;
}
.detail-price {
  font-size: 2rem;
  font-weight: 700;
  color: #e4572e;
}
.detail-description {
  white-space: pre-line;
}
.detail-actions {
  gap: 12px;
}
</style>
