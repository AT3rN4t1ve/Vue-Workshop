<template>
  <div>
    <PageHeader title="ตะกร้า" :subtitle="items.length ? `${items.length} รายการ` : ''">
      <v-btn v-if="items.length" text color="error" :disabled="processing" @click="clearDialog = true">
        <v-icon left>mdi-trash-can-outline</v-icon>
        ล้างตะกร้า
      </v-btn>
    </PageHeader>

    <v-card v-if="items.length === 0" class="surface-card">
      <EmptyState icon="mdi-cart-outline" title="ตะกร้ายังว่างอยู่" text="เลือกเมนูที่อยากกินแล้วกดเพิ่มลงตะกร้าได้เลย">
        <v-btn depressed color="primary" to="/">ไปเลือกเมนู</v-btn>
      </EmptyState>
    </v-card>

    <v-row v-else>
      <v-col cols="12" md="8">
        <v-card class="surface-card px-5 py-1">
          <CartItem
            v-for="item in items"
            :key="item.key"
            :item="item"
            :max="maxOf(item)"
            :problem="problemOf(item)"
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
          :disabled="hasProblem"
          hint="มีรายการที่สั่งไม่ได้ กรุณาแก้ไขก่อนสั่ง"
          @checkout="confirmDialog = true"
        />
      </v-col>
    </v-row>

    <ConfirmDialog
      v-model="confirmDialog"
      title="ยืนยันการสั่งอาหาร"
      confirm-text="ยืนยันสั่ง"
      :loading="processing"
      @confirm="checkout"
    >
      สั่งอาหาร {{ count | number }} จาน ยอดรวม <strong>{{ total | price }}</strong> ใช่หรือไม่
    </ConfirmDialog>

    <ConfirmDialog
      v-model="clearDialog"
      title="ล้างตะกร้า"
      message="ต้องการลบทุกรายการออกจากตะกร้าใช่หรือไม่"
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

// หน้าตะกร้า: ปรับจำนวน/ลบสินค้า และสั่งซื้อ
// (สร้าง Order ทีละรายการ ตามรูปแบบ API — 1 รายการ = สินค้า + ตัวเลือก + หมายเหตุ)
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
    ...mapGetters('cart', ['count', 'total', 'hasProblem', 'problemOf', 'quantityOf']),
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
        this.$store.dispatch('ui/notify', { text: 'อัปเดตข้อมูลเมนูในตะกร้าไม่สำเร็จ', color: 'error' })
      }
    },
    // stock ใช้ร่วมกันทุกรายการของสินค้าเดียวกัน จึงหักจำนวนของรายการอื่นออกก่อน
    maxOf(item) {
      const others = this.quantityOf(item.product._id) - item.quantity
      return item.product.stock - others
    },
    updateQuantity(payload) {
      this.$store.commit('cart/SET_QUANTITY', payload)
    },
    remove(key) {
      this.$store.commit('cart/REMOVE', key)
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
          const { quantity, options, note } = item
          orders.push(await orderService.create(item.product._id, { quantity, options, note }))
          this.$store.commit('cart/REMOVE', item.key)
        } catch (e) {
          failed.push({ name: item.product.name, message: e.message || 'สั่งไม่สำเร็จ' })
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
