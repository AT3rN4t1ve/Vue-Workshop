<template>
  <v-dialog :value="value" max-width="720" scrollable :persistent="saving" @input="$emit('input', $event)">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold pt-5 px-6">
        {{ isEdit ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่' }}
      </v-card-title>
      <v-divider />

      <v-card-text class="px-6 pt-5 pb-2">
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-row dense>
            <v-col cols="12" sm="7">
              <v-text-field
                v-model.trim="form.name"
                label="ชื่อเมนู *"
                :rules="[rules.required]"
                outlined
                dense
                autofocus
              />
            </v-col>
            <v-col cols="12" sm="5">
              <v-combobox
                v-model="form.category"
                :items="categories"
                label="หมวดหมู่"
                :placeholder="DEFAULT_CATEGORY"
                hint="เลือกหมวดที่มีอยู่ หรือพิมพ์หมวดใหม่"
                outlined
                dense
              />
            </v-col>
          </v-row>

          <v-textarea
            v-model.trim="form.description"
            label="รายละเอียดเมนู"
            rows="2"
            outlined
            dense
            auto-grow
          />

          <div class="d-flex align-start">
            <v-text-field
              v-model.trim="form.imageUrl"
              label="ลิงก์รูปอาหาร (URL)"
              placeholder="https://..."
              hint="เว้นว่างได้ ระบบจะสร้างภาพแทนจากชื่อเมนู"
              outlined
              dense
              class="flex-grow-1"
            />
            <div class="form-preview ml-3 flex-shrink-0">
              <ProductThumb :name="form.name" :src="form.imageUrl" font-size="1.1rem" />
            </div>
          </div>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="form.price"
                label="ราคาเริ่มต้น (บาท) *"
                type="number"
                min="0"
                step="0.01"
                prefix="฿"
                hint="ยังไม่รวมราคาตัวเลือก"
                :rules="[rules.number, rules.notNegative]"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="form.stock"
                label="จำนวนที่ขายได้ *"
                type="number"
                min="0"
                step="1"
                suffix="จาน"
                :rules="[rules.number, rules.notNegative, rules.integer]"
                outlined
                dense
              />
            </v-col>
          </v-row>

          <div class="d-flex align-center mb-2">
            <div>
              <div class="text-subtitle-2 font-weight-bold">ตัวเลือกของเมนู</div>
              <div class="text-caption grey--text text--darken-1">เช่น เนื้อสัตว์ ขนาด ท็อปปิ้ง ลูกค้าจะเลือกตอนสั่ง</div>
            </div>
            <v-spacer />
            <v-btn small outlined color="primary" @click="addGroup">
              <v-icon left small>mdi-plus</v-icon>
              เพิ่มกลุ่ม
            </v-btn>
          </div>

          <v-sheet v-for="(group, g) in form.optionGroups" :key="g" outlined rounded class="pa-3 mb-3">
            <div class="d-flex align-start">
              <v-text-field
                v-model.trim="group.name"
                label="ชื่อกลุ่มตัวเลือก *"
                :rules="[rules.required]"
                outlined
                dense
                class="flex-grow-1"
              />
              <v-btn icon color="error" class="ml-1" :aria-label="`ลบกลุ่มตัวเลือกที่ ${g + 1}`" @click="form.optionGroups.splice(g, 1)">
                <v-icon small>mdi-trash-can-outline</v-icon>
              </v-btn>
            </div>

            <div class="d-flex flex-wrap mt-n3 mb-3">
              <v-checkbox v-model="group.isRequired" label="ลูกค้าต้องเลือก" dense hide-details class="mr-6" />
              <v-checkbox v-model="group.isMultiple" label="เลือกได้หลายอย่าง" dense hide-details />
            </div>

            <v-row v-for="(choice, c) in group.choices" :key="c" dense align="start">
              <v-col cols="6" sm="7">
                <v-text-field
                  v-model.trim="choice.name"
                  label="ตัวเลือก *"
                  :rules="[rules.required]"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="4" sm="4">
                <v-text-field
                  v-model.number="choice.price"
                  label="บวกเพิ่ม"
                  type="number"
                  min="0"
                  step="0.01"
                  prefix="+฿"
                  :rules="[rules.number, rules.notNegative]"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="2" sm="1" class="text-right">
                <v-btn
                  icon
                  :disabled="group.choices.length === 1"
                  :aria-label="`ลบตัวเลือกที่ ${c + 1}`"
                  @click="group.choices.splice(c, 1)"
                >
                  <v-icon small>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-btn small text color="primary" @click="group.choices.push({ name: '', price: 0 })">
              <v-icon left small>mdi-plus</v-icon>
              เพิ่มตัวเลือก
            </v-btn>
            <v-btn v-if="group.choices.length > 1" small text @click="sortChoices(group)">
              <v-icon left small>{{ isSortedByPrice(group) ? 'mdi-sort-descending' : 'mdi-sort-ascending' }}</v-icon>
              {{ isSortedByPrice(group) ? 'เรียงราคามาก → น้อย' : 'เรียงราคาน้อย → มาก' }}
            </v-btn>
          </v-sheet>

          <v-alert v-if="optionError" type="error" text dense class="text-body-2">{{ optionError }}</v-alert>
        </v-form>
      </v-card-text>

      <v-divider />
      <v-card-actions class="px-6 py-4">
        <v-spacer />
        <v-btn text :disabled="saving" @click="$emit('input', false)">ยกเลิก</v-btn>
        <v-btn color="primary" depressed :loading="saving" @click="submit">
          {{ isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มเมนู' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { DEFAULT_CATEGORY } from '../../utils/constants'
import ProductThumb from '../common/ProductThumb.vue'

const emptyForm = () => ({
  name: '',
  description: '',
  category: '',
  imageUrl: '',
  price: 0,
  stock: 0,
  optionGroups: [],
})

const hasDuplicate = (names) => new Set(names).size !== names.length

// ฟอร์มเพิ่ม/แก้ไขสินค้า ส่ง product มา = โหมดแก้ไข, ไม่ส่ง = โหมดเพิ่ม
// กดบันทึกจะ emit 'save' พร้อม { name, description, category, imageUrl, price, stock, optionGroups }
//   optionGroups: [{ name, isRequired, isMultiple, choices: [{ name, price }] }] (รูปแบบเดียวกับ Back-end)
export default {
  name: 'ProductFormDialog',
  components: { ProductThumb },
  props: {
    value: { type: Boolean, default: false },
    product: { type: Object, default: null },
    // หมวดหมู่ที่มีอยู่แล้ว ไว้เป็นตัวเลือกในช่องหมวดหมู่
    categories: { type: Array, default: () => [] },
    saving: { type: Boolean, default: false },
  },
  data: () => ({
    DEFAULT_CATEGORY,
    valid: true,
    form: emptyForm(),
    optionError: '',
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
      this.optionError = ''
      this.form = this.product
        ? {
            name: this.product.name,
            description: this.product.description || '',
            category: this.product.category || '',
            imageUrl: this.product.imageUrl || '',
            price: this.product.price,
            stock: this.product.stock,
            // คัดลอกออกมาแก้ จะได้ไม่กระทบข้อมูลในตารางจนกว่าจะบันทึก
            optionGroups: JSON.parse(JSON.stringify(this.product.optionGroups || [])),
          }
        : emptyForm()
      this.$nextTick(() => this.$refs.form && this.$refs.form.resetValidation())
    },
  },
  methods: {
    addGroup() {
      this.form.optionGroups.push({
        name: '',
        isRequired: false,
        isMultiple: false,
        choices: [{ name: '', price: 0 }],
      })
    },
    isSortedByPrice(group) {
      return group.choices.every((choice, i, list) => i === 0 || Number(list[i - 1].price) <= Number(choice.price))
    },
    // เรียงตัวเลือกตามราคาบวกเพิ่ม: กดครั้งแรกน้อย → มาก กดซ้ำสลับเป็นมาก → น้อย
    // ลำดับนี้ถูกบันทึกไปด้วย ลูกค้าจะเห็นตัวเลือกเรียงตามนี้
    sortChoices(group) {
      const direction = this.isSortedByPrice(group) ? -1 : 1
      group.choices.sort((a, b) => direction * (Number(a.price) - Number(b.price)))
    },
    // Back-end ไม่รับชื่อกลุ่มซ้ำ และชื่อตัวเลือกซ้ำในกลุ่มเดียวกัน
    findOptionError() {
      const groups = this.form.optionGroups
      if (hasDuplicate(groups.map((group) => group.name))) return 'ชื่อกลุ่มตัวเลือกซ้ำกัน'
      const repeated = groups.find((group) => hasDuplicate(group.choices.map((choice) => choice.name)))
      return repeated ? `กลุ่ม "${repeated.name}" มีชื่อตัวเลือกซ้ำกัน` : ''
    },
    submit() {
      if (!this.$refs.form.validate()) return
      this.optionError = this.findOptionError()
      if (this.optionError) return

      this.$emit('save', {
        ...this.form,
        category: this.form.category || '',
        price: Number(this.form.price),
        stock: Number(this.form.stock),
      })
    },
  },
}
</script>

<style scoped>
.form-preview {
  width: 40px;
}
</style>
