<template>
  <v-dialog :value="value" max-width="560" :persistent="saving" @input="$emit('input', $event)">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold pt-5 px-6">
        {{ isEdit ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่' }}
      </v-card-title>

      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-card-text class="px-6 pb-0">
          <v-text-field
            v-model.trim="form.name"
            label="ชื่อสินค้า *"
            :rules="[rules.required]"
            outlined
            dense
            autofocus
          />
          <v-textarea
            v-model.trim="form.description"
            label="รายละเอียดสินค้า"
            rows="3"
            outlined
            dense
            auto-grow
          />
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="form.price"
                label="ราคา (บาท) *"
                type="number"
                min="0"
                step="0.01"
                prefix="฿"
                :rules="[rules.number, rules.notNegative]"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="form.stock"
                label="จำนวนคงเหลือ *"
                type="number"
                min="0"
                step="1"
                suffix="ชิ้น"
                :rules="[rules.number, rules.notNegative, rules.integer]"
                outlined
                dense
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="px-6 pb-5">
          <v-spacer />
          <v-btn text :disabled="saving" @click="$emit('input', false)">ยกเลิก</v-btn>
          <v-btn color="primary" depressed type="submit" :loading="saving">
            {{ isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
const EMPTY = { name: '', description: '', price: 0, stock: 0 }

// ฟอร์มเพิ่ม/แก้ไขสินค้า ส่ง product มา = โหมดแก้ไข, ไม่ส่ง = โหมดเพิ่ม
// กดบันทึกจะ emit 'save' พร้อม { name, description, price, stock }
export default {
  name: 'ProductFormDialog',
  props: {
    value: { type: Boolean, default: false },
    product: { type: Object, default: null },
    saving: { type: Boolean, default: false },
  },
  data: () => ({
    valid: true,
    form: { ...EMPTY },
    rules: {
      required: (v) => !!String(v || '').trim() || 'กรุณากรอกข้อมูล',
      number: (v) => (v !== '' && v !== null && !Number.isNaN(Number(v))) || 'กรุณากรอกตัวเลข',
      notNegative: (v) => Number(v) >= 0 || 'ต้องไม่ติดลบ',
      integer: (v) => Number.isInteger(Number(v)) || 'ต้องเป็นจำนวนเต็ม',
    },
  }),
  computed: {
    isEdit() {
      return !!this.product
    },
  },
  watch: {
    // เปิด dialog ทุกครั้งให้ตั้งค่าฟอร์มใหม่
    value(open) {
      if (!open) return
      this.form = this.product
        ? {
            name: this.product.name,
            description: this.product.description || '',
            price: this.product.price,
            stock: this.product.stock,
          }
        : { ...EMPTY }
      this.$nextTick(() => this.$refs.form && this.$refs.form.resetValidation())
    },
  },
  methods: {
    submit() {
      if (!this.$refs.form.validate()) return
      this.$emit('save', {
        name: this.form.name,
        description: this.form.description,
        price: Number(this.form.price),
        stock: Number(this.form.stock),
      })
    },
  },
}
</script>
