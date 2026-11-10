<template>
  <div>
    <PageHeader title="จัดการสินค้า" subtitle="เพิ่ม แก้ไข ลบสินค้า และปรับจำนวนคงเหลือ">
      <v-btn color="primary" depressed @click="openCreate">
        <v-icon left>mdi-plus</v-icon>
        เพิ่มสินค้า
      </v-btn>
    </PageHeader>

    <v-row dense class="mb-3">
      <v-col v-for="stat in stats" :key="stat.label" cols="6" md="3">
        <StatCard v-bind="stat" />
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" text class="mb-4">{{ error }}</v-alert>

    <v-card class="surface-card">
      <div class="pa-4">
        <v-text-field
          v-model="search"
          label="ค้นหาสินค้า"
          prepend-inner-icon="mdi-magnify"
          outlined
          dense
          hide-details
          clearable
          class="search-field"
        />
      </div>
      <v-divider />
      <ProductTable :products="filteredProducts" :loading="loading" @edit="openEdit" @delete="openDelete" />
    </v-card>

    <ProductFormDialog v-model="formDialog" :product="editing" :saving="saving" @save="save" />

    <ConfirmDialog
      v-model="deleteDialog"
      title="ลบสินค้า"
      confirm-text="ลบสินค้า"
      color="error"
      :loading="saving"
      @confirm="remove"
    >
      ต้องการลบ <strong>{{ deleting ? deleting.name : '' }}</strong> ใช่หรือไม่
      คำสั่งซื้อเดิมของสินค้านี้จะยังอยู่
    </ConfirmDialog>
  </div>
</template>

<script>
import productService from '../../services/productService'
import { formatNumber, formatPrice } from '../../utils/format'
import { LOW_STOCK } from '../../utils/constants'
import PageHeader from '../../components/common/PageHeader.vue'
import ConfirmDialog from '../../components/common/ConfirmDialog.vue'
import StatCard from '../../components/admin/StatCard.vue'
import ProductTable from '../../components/admin/ProductTable.vue'
import ProductFormDialog from '../../components/admin/ProductFormDialog.vue'

// หน้าจัดการสินค้า: ตารางสินค้า + เพิ่ม/แก้ไข/ลบ
export default {
  name: 'ManageProductsView',
  components: { PageHeader, ConfirmDialog, StatCard, ProductTable, ProductFormDialog },
  data: () => ({
    products: [],
    loading: true,
    saving: false,
    error: '',
    search: '',
    formDialog: false,
    editing: null,
    deleteDialog: false,
    deleting: null,
  }),
  computed: {
    filteredProducts() {
      const keyword = (this.search || '').trim().toLowerCase()
      if (!keyword) return this.products
      return this.products.filter((product) =>
        `${product.name} ${product.description || ''}`.toLowerCase().includes(keyword)
      )
    },
    stats() {
      const lowStock = this.products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK).length
      const soldOut = this.products.filter((p) => p.stock <= 0).length
      const stockValue = this.products.reduce((sum, p) => sum + p.price * p.stock, 0)
      return [
        { label: 'สินค้าทั้งหมด', value: formatNumber(this.products.length), icon: 'mdi-package-variant-closed' },
        { label: 'ใกล้หมด', value: formatNumber(lowStock), icon: 'mdi-alert-outline', color: '#C98A00', tint: '#FFF8E1' },
        { label: 'สินค้าหมด', value: formatNumber(soldOut), icon: 'mdi-close-circle-outline', color: '#D64545', tint: '#FDECEC' },
        { label: 'มูลค่าสินค้าคงเหลือ', value: formatPrice(stockValue), icon: 'mdi-cash-multiple', color: '#1E8E5A', tint: '#E6F5EC' },
      ]
    },
  },
  created() {
    this.load()
  },
  methods: {
    notify(text, color = 'success') {
      this.$store.dispatch('ui/notify', { text, color })
    },
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
    openCreate() {
      this.editing = null
      this.formDialog = true
    },
    openEdit(product) {
      this.editing = product
      this.formDialog = true
    },
    openDelete(product) {
      this.deleting = product
      this.deleteDialog = true
    },
    async save(payload) {
      this.saving = true
      try {
        if (this.editing) {
          await productService.update(this.editing._id, payload)
          this.notify('บันทึกการแก้ไขแล้ว')
        } else {
          await productService.create(payload)
          this.notify('เพิ่มสินค้าแล้ว')
        }
        this.formDialog = false
        await this.load()
      } catch (e) {
        this.notify(e.message || 'บันทึกไม่สำเร็จ', 'error')
      } finally {
        this.saving = false
      }
    },
    async remove() {
      this.saving = true
      try {
        await productService.remove(this.deleting._id)
        // สินค้าที่ถูกลบต้องหายจากตะกร้าด้วย
        this.$store.commit('cart/REMOVE', this.deleting._id)
        this.notify('ลบสินค้าแล้ว')
        this.deleteDialog = false
        await this.load()
      } catch (e) {
        this.notify(e.message || 'ลบไม่สำเร็จ', 'error')
      } finally {
        this.saving = false
      }
    },
  },
}
</script>

<style scoped>
.search-field {
  max-width: 360px;
}
</style>
