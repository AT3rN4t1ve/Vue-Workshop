<template>
  <div>
    <v-btn text rounded class="mb-3 ml-n3 back-btn" to="/" exact>
      <v-icon left>mdi-chevron-left</v-icon>
      กลับไปหน้าเมนู
    </v-btn>

    <div v-if="loading" class="detail-layout">
      <v-skeleton-loader type="image" class="detail-media surface-card" />
      <v-card class="surface-card detail-panel"><v-skeleton-loader type="heading, paragraph, sentences, actions" /></v-card>
    </div>

    <v-card v-else-if="!product" class="surface-card">
      <EmptyState icon="mdi-food-off-outline" title="ไม่พบเมนูนี้" text="เมนูอาจถูกลบไปแล้ว">
        <v-btn depressed rounded color="primary" to="/">กลับไปเลือกเมนู</v-btn>
      </EmptyState>
    </v-card>

    <div v-else class="detail-layout">
      <div class="detail-media">
        <ProductThumb
          :name="product.name"
          :category="product.category"
          :src="product.imageUrl"
          :aspect-ratio="4 / 3"
          font-size="7rem"
          class="detail-thumb"
          :class="{ 'thumb--sold-out': soldOut }"
        />
        <div class="d-flex flex-wrap detail-tags">
          <StockChip :stock="product.stock" show-amount />
          <span v-if="inCart > 0" class="detail-tag">มีในตะกร้าแล้ว {{ inCart }} จาน</span>
        </div>
      </div>

      <v-card class="surface-card detail-panel">
        <div class="detail-head">
          <div v-if="product.category" class="detail-category">{{ product.category }}</div>
          <h1 class="detail-name">{{ product.name }}</h1>
          <p v-if="product.description" class="detail-description">{{ product.description }}</p>
          <div class="detail-price tabular">
            {{ unit | price }}
            <span v-if="unit !== product.price" class="detail-price__base">
              เริ่มต้น {{ product.price | price }} + ตัวเลือก
            </span>
          </div>
        </div>

        <fieldset v-for="group in optionGroups" :key="group.name" class="option-group">
          <legend class="option-group__legend">
            {{ group.name }}
            <span class="option-group__badge" :class="{ 'option-group__badge--required': group.isRequired }">
              {{ group.isRequired ? 'ต้องเลือก' : 'ไม่บังคับ' }} · {{ group.isMultiple ? 'เลือกได้หลายอย่าง' : 'เลือก 1 อย่าง' }}
            </span>
          </legend>
          <v-chip-group
            v-model="picked[group.name]"
            :multiple="group.isMultiple"
            column
            active-class="option-chip--active"
          >
            <v-chip v-for="choice in group.choices" :key="choice.name" :value="choice.name" class="option-chip" outlined>
              {{ choice.name }}
              <span v-if="choice.price > 0" class="option-chip__price tabular">+{{ choice.price | price }}</span>
            </v-chip>
          </v-chip-group>
        </fieldset>

        <v-textarea
          v-model="note"
          label="หมายเหตุถึงแม่ครัว (ถ้ามี)"
          placeholder="เช่น ไม่ใส่ผัก เผ็ดน้อย"
          rows="2"
          auto-grow
          outlined
          :counter="NOTE_MAX_LENGTH"
          :maxlength="NOTE_MAX_LENGTH"
          class="mt-2"
        />

        <div class="detail-footer">
          <QuantityInput v-model="quantity" large :max="Math.max(available, 1)" :disabled="available <= 0" />
          <v-btn color="primary" depressed rounded x-large class="detail-add" :disabled="!canAdd" @click="addToCart">
            <v-icon left>mdi-basket-plus-outline</v-icon>
            ใส่ตะกร้า · {{ unit * quantity | price }}
          </v-btn>
          <v-btn outlined rounded x-large color="primary" :disabled="!canAdd" @click="buyNow">สั่งเลย</v-btn>
        </div>

        <div v-if="soldOut" class="detail-hint error--text">เมนูนี้หมดชั่วคราว</div>
        <div v-else-if="available <= 0" class="detail-hint">คุณใส่เมนูนี้ในตะกร้าครบจำนวนที่เหลือแล้ว</div>
        <div v-else-if="optionError" class="detail-hint">{{ optionError }}</div>
      </v-card>
    </div>
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
    picked: {},
  }),
  computed: {
    soldOut() {
      return this.product.stock <= 0
    },
    optionGroups() {
      return this.product.optionGroups || []
    },
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
.back-btn {
  color: var(--app-text-muted) !important;
}
.detail-layout {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 28px;
}
.detail-media {
  flex: 1 1 380px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.detail-thumb {
  border-radius: var(--radius-xl) !important;
  overflow: hidden;
}
.thumb--sold-out {
  filter: grayscale(1);
  opacity: 0.6;
}
.detail-tags {
  gap: 8px;
}
.detail-tag {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  font-size: 0.8rem;
  color: var(--app-text-muted);
}
.detail-panel {
  flex: 1 1 420px;
  min-width: 0;
  padding: 28px;
}
.detail-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}
.detail-category {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--app-text-muted);
}
.detail-name {
  margin: 0;
  font-size: 1.85rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--app-text);
}
.detail-description {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--app-text-muted);
  white-space: pre-line;
}
.detail-price {
  margin-top: 4px;
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--v-primary-base);
}
.detail-price__base {
  margin-left: 6px;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--app-text-muted);
}
.option-group {
  border: none;
  margin: 0 0 16px;
  padding: 16px 0 0;
  border-top: 1px solid var(--app-border);
}
.option-group__legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 0;
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--app-text);
}
.option-group__badge {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  border-radius: var(--radius-pill);
  background: var(--app-surface-muted);
  font-family: 'IBM Plex Sans Thai', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--app-text-muted);
}
.option-group__badge--required {
  background: var(--app-primary-tint);
  color: var(--app-primary-dark);
}
.option-chip.v-chip {
  height: 44px;
  padding: 0 18px;
  border: 1.5px solid var(--app-border) !important;
  background: var(--app-surface) !important;
  font-size: 0.95rem;
  color: var(--app-text);
}
.option-chip--active.v-chip {
  border-color: var(--v-primary-base) !important;
  background: var(--app-primary-tint) !important;
  color: var(--app-primary-dark) !important;
  font-weight: 600;
}
.option-chip__price {
  margin-left: 6px;
  color: var(--app-text-muted);
}
.detail-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--app-border);
}
.detail-add {
  flex: 1 1 220px;
  box-shadow: var(--shadow-primary) !important;
}
.detail-add.v-btn--disabled {
  box-shadow: none !important;
}
.detail-hint {
  margin-top: 12px;
  font-size: 0.9rem;
  color: var(--app-text-muted);
}
@media (max-width: 600px) {
  .detail-panel {
    padding: 20px;
  }
  .detail-name {
    font-size: 1.5rem;
  }
}
</style>
