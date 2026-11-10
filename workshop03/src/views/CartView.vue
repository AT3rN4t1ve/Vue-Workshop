<template>
  <div>
    <PageHeader title="ตะกร้าสินค้า" :subtitle="items.length ? `${items.length} รายการ` : ''">
      <v-btn v-if="items.length" text color="error" :disabled="processing" @click="clearDialog = true">
        <v-icon left>mdi-trash-can-outline</v-icon>
        ล้างตะกร้า
      </v-btn>
    </PageHeader>

    <v-card v-if="items.length === 0" class="surface-card">
      <EmptyState icon="mdi-cart-outline" title="ตะกร้ายังว่างอยู่" text="เลือกสินค้าที่ชอบแล้วกดเพิ่มลงตะกร้าได้เลย">
        <v-btn depressed color="primary" to="/">ไปเลือกซื้อสินค้า</v-btn>
      </EmptyState>
    </v-card>

    <v-row v-else>
      <v-col cols="12" md="8">
        <v-card class="surface-card px-5 py-1">
          <CartItem
            v-for="item in items"
            :key="item.product._id"
            :item="item"
            :disabled="processing"
            @update-quantity="updateQuantity"
            @remove="remove"
          />
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <CartSummary
          :count="count"
          :total="total"
          :loading="processing"
          :disabled="hasStockProblem"
          hint="มีสินค้าที่เกินจำนวนคงเหลือ กรุณาแก้ไขก่อนสั่งซื้อ"
          @checkout="confirmDialog = true"
        />
      </v-col>
    </v-row>

    <ConfirmDialog
      v-model="confirmDialog"
      title="ยืนยันการสั่งซื้อ"
      confirm-text="ยืนยันสั่งซื้อ"
      :loading="processing"
      @confirm="checkout"
    >
      สั่งซื้อสินค้า {{ count | number }} ชิ้น ยอดรวม <strong>{{ total | price }}</strong> ใช่หรือไม่
    </ConfirmDialog>

    <ConfirmDialog
      v-model="clearDialog"
      title="ล้างตะกร้า"
      message="ต้องการลบสินค้าทั้งหมดออกจากตะกร้าใช่หรือไม่"
      confirm-text="ล้างตะกร้า"
      color="error"
      @confirm="clear"
    />

    <CheckoutResultDialog v-model="resultDialog" :orders="result.orders" :failed="result.failed" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import productService from '../services/productService'
import orderService from '../services/orderService'
import PageHeader from '../components/common/PageHeader.vue'
import EmptyState from '../components/common/EmptyState.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import CartItem from '../components/cart/CartItem.vue'
import CartSummary from '../components/cart/CartSummary.vue'
import CheckoutResultDialog from '../components/cart/CheckoutResultDialog.vue'

// หน้าตะกร้า: ปรับจำนวน/ลบสินค้า และสั่งซื้อ (สร้าง Order ทีละสินค้า ตามรูปแบบ API)
export default {
  name: 'CartView',
  components: { PageHeader, EmptyState, ConfirmDialog, CartItem, CartSummary, CheckoutResultDialog },
  data: () => ({
    processing: false,
    confirmDialog: false,
    clearDialog: false,
    resultDialog: false,
    result: { orders: [], failed: [] },
  }),
  computed: {
    ...mapState('cart', ['items']),
    ...mapGetters('cart', ['count', 'total', 'hasStockProblem']),
  },
  created() {
    this.syncWithLatestProducts()
  },
  methods: {
    // ดึงราคา/stock ล่าสุดมาอัปเดตตะกร้า
    async syncWithLatestProducts() {
      if (this.items.length === 0) return
      try {
        this.$store.commit('cart/SYNC', await productService.getAll())
      } catch (e) {
        this.$store.dispatch('ui/notify', { text: 'อัปเดตข้อมูลสินค้าในตะกร้าไม่สำเร็จ', color: 'error' })
      }
    },
    updateQuantity(payload) {
      this.$store.commit('cart/SET_QUANTITY', payload)
    },
    remove(productId) {
      this.$store.commit('cart/REMOVE', productId)
    },
    clear() {
      this.$store.commit('cart/CLEAR')
      this.clearDialog = false
    },
    async checkout() {
      this.processing = true
      const orders = []
      const failed = []

      // API รับ Order ทีละสินค้า (POST /products/:id/orders) จึงส่งทีละรายการ
      for (const item of [...this.items]) {
        try {
          orders.push(await orderService.create(item.product._id, item.quantity))
          this.$store.commit('cart/REMOVE', item.product._id)
        } catch (e) {
          failed.push({ name: item.product.name, message: e.message || 'สั่งซื้อไม่สำเร็จ' })
        }
      }

      await this.syncWithLatestProducts()
      this.result = { orders, failed }
      this.processing = false
      this.confirmDialog = false
      this.resultDialog = true
    },
  },
}
</script>
