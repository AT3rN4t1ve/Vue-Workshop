<template>
  <div>
    <v-btn text class="mb-3 ml-n3" to="/" exact>
      <v-icon left>mdi-arrow-left</v-icon>
      กลับไปหน้าเมนู
    </v-btn>

    <v-card v-if="loading" class="surface-card pa-6">
      <v-row>
        <v-col cols="12" md="5"><v-skeleton-loader type="image, image" /></v-col>
        <v-col cols="12" md="7"><v-skeleton-loader type="heading, paragraph, sentences, actions" /></v-col>
      </v-row>
    </v-card>

    <v-card v-else-if="!product" class="surface-card">
      <EmptyState icon="mdi-food-off-outline" title="ไม่พบเมนูนี้" text="เมนูอาจถูกลบไปแล้ว">
        <v-btn depressed color="primary" to="/">กลับไปเลือกเมนู</v-btn>
      </EmptyState>
    </v-card>

    <v-card v-else class="surface-card pa-4 pa-md-6">
      <v-row>
        <v-col cols="12" sm="5">
          <ProductThumb
            :name="product.name"
            :src="product.imageUrl"
            font-size="6rem"
            :class="{ 'thumb--sold-out': soldOut }"
          />
        </v-col>

        <v-col cols="12" sm="7" class="d-flex flex-column">
          <div class="d-flex align-center flex-wrap mb-3">
            <StockChip :stock="product.stock" class="mr-2" />
            <v-chip v-if="product.category" small outlined>{{ product.category }}</v-chip>
          </div>
          <h1 class="detail-name mb-3">{{ product.name }}</h1>

          <div class="detail-price-box mb-5">
            <span class="detail-price tabular">{{ unit | price }}</span>
            <span v-if="unit !== product.price" class="text-body-2 grey--text text--darken-1 ml-2">
              (ราคาเริ่มต้น {{ product.price | price }} + ตัวเลือก)
            </span>
          </div>

          <div class="text-subtitle-2 font-weight-bold mb-1">รายละเอียด</div>
          <p class="detail-description text-body-1 grey--text text--darken-2 mb-5">
            {{ product.description || 'ไม่มีรายละเอียดเพิ่มเติม' }}
          </p>

          <div v-for="group in optionGroups" :key="group.name" class="mb-4">
            <div class="d-flex align-center flex-wrap">
              <span class="text-subtitle-2 font-weight-bold mr-2">{{ group.name }}</span>
              <v-chip x-small label :color="group.isRequired ? 'primary' : ''" class="mr-2">
                {{ group.isRequired ? 'ต้องเลือก' : 'ไม่บังคับ' }}
              </v-chip>
              <span class="text-caption grey--text text--darken-1">
                {{ group.isMultiple ? 'เลือกได้หลายอย่าง' : 'เลือกได้ 1 อย่าง' }}
              </span>
            </div>
            <v-chip-group v-model="picked[group.name]" :multiple="group.isMultiple" column active-class="primary--text">
              <v-chip v-for="choice in group.choices" :key="choice.name" :value="choice.name" filter outlined>
                {{ choice.name }}
                <span v-if="choice.price > 0" class="ml-1 tabular">+{{ choice.price | price }}</span>
              </v-chip>
            </v-chip-group>
          </div>

          <v-textarea
            v-model="note"
            label="หมายเหตุถึงร้าน (ถ้ามี)"
            placeholder="เช่น ไม่ใส่ผัก เผ็ดน้อย"
            rows="2"
            auto-grow
            outlined
            dense
            :counter="NOTE_MAX_LENGTH"
            :maxlength="NOTE_MAX_LENGTH"
          />

          <div class="mt-auto">
            <div class="d-flex align-center flex-wrap mb-5">
              <span class="text-body-2 grey--text text--darken-1 mr-4">จำนวน</span>
              <QuantityInput v-model="quantity" :max="Math.max(available, 1)" :disabled="available <= 0" />
              <span v-if="inCart > 0" class="text-caption grey--text text--darken-1 ml-4">
                มีในตะกร้าแล้ว {{ inCart }} จาน
              </span>
            </div>

            <div class="d-flex flex-wrap detail-actions">
              <v-btn color="primary" outlined large :disabled="!canAdd" @click="addToCart">
                <v-icon left>mdi-cart-plus</v-icon>
                เพิ่มลงตะกร้า · {{ unit * quantity | price }}
              </v-btn>
              <v-btn color="primary" depressed large :disabled="!canAdd" @click="buyNow">
                สั่งเลย
              </v-btn>
            </div>

            <div v-if="soldOut" class="text-body-2 error--text mt-3">เมนูนี้หมดชั่วคราว</div>
            <div v-else-if="available <= 0" class="text-body-2 grey--text text--darken-1 mt-3">
              คุณใส่เมนูนี้ในตะกร้าครบจำนวนที่เหลือแล้ว
            </div>
            <div v-else-if="optionError" class="text-body-2 grey--text text--darken-1 mt-3">{{ optionError }}</div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import productService from '../services/productService'
import { NOTE_MAX_LENGTH } from '../utils/constants'
import { optionProblem, unitPrice } from '../utils/options'
import ProductThumb from '../components/common/ProductThumb.vue'
import StockChip from '../components/common/StockChip.vue'
import QuantityInput from '../components/common/QuantityInput.vue'
import EmptyState from '../components/common/EmptyState.vue'

// หน้ารายละเอียดสินค้า: เลือกตัวเลือก/จำนวน ใส่หมายเหตุ แล้วเพิ่มลงตะกร้าหรือซื้อเลย
export default {
  name: 'ProductDetailView',
  components: { ProductThumb, StockChip, QuantityInput, EmptyState },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    NOTE_MAX_LENGTH,
    product: null,
    loading: true,
    quantity: 1,
    note: '',
    // { ชื่อกลุ่ม: ชื่อตัวเลือก } หรือ { ชื่อกลุ่ม: [ชื่อตัวเลือก] } เมื่อกลุ่มนั้นเลือกได้หลายอย่าง
    picked: {},
  }),
  computed: {
    soldOut() {
      return this.product.stock <= 0
    },
    optionGroups() {
      return this.product.optionGroups || []
    },
    // รูปแบบที่ Back-end รับ: [{ group, choice }]
    selectedOptions() {
      return this.optionGroups.flatMap((group) => {
        const value = this.picked[group.name]
        const choices = Array.isArray(value) ? value : value ? [value] : []
        return choices.map((choice) => ({ group: group.name, choice }))
      })
    },
    optionError() {
      return optionProblem(this.product, this.selectedOptions)
    },
    unit() {
      return unitPrice(this.product, this.selectedOptions)
    },
    inCart() {
      return this.$store.getters['cart/quantityOf'](this.product._id)
    },
    // จำนวนที่ยังเพิ่มลงตะกร้าได้อีก
    available() {
      return this.product.stock - this.inCart
    },
    canAdd() {
      return this.available > 0 && !this.optionError
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
      this.note = ''
      try {
        const product = await productService.getById(this.id)
        const picked = {}
        ;(product.optionGroups || []).forEach((group) => {
          picked[group.name] = group.isMultiple ? [] : null
        })
        this.picked = picked
        this.product = product
      } catch (e) {
        this.product = null
      } finally {
        this.loading = false
      }
    },
    async addToCart() {
      const added = await this.$store.dispatch('cart/add', {
        product: this.product,
        quantity: this.quantity,
        options: this.selectedOptions,
        note: this.note,
      })
      if (added) {
        this.quantity = 1
        this.note = ''
      }
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
