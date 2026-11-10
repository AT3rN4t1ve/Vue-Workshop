<template>
  <v-card class="surface-card pa-3 mb-5">
    <v-row dense align="center">
      <v-col cols="12" md="6">
        <v-text-field
          :value="value.search"
          label="ค้นหาเมนู"
          placeholder="พิมพ์ชื่อเมนู เช่น กะเพรา ข้าวผัด"
          prepend-inner-icon="mdi-magnify"
          outlined
          dense
          hide-details
          clearable
          @input="update('search', $event || '')"
        />
      </v-col>
      <v-col cols="7" sm="6" md="3">
        <v-select
          :value="value.sort"
          :items="sortOptions"
          label="เรียงตาม"
          outlined
          dense
          hide-details
          @input="update('sort', $event)"
        />
      </v-col>
      <v-col cols="5" sm="6" md="3" class="d-flex justify-end">
        <v-switch
          :input-value="value.inStockOnly"
          label="เฉพาะที่ยังไม่หมด"
          color="primary"
          inset
          dense
          hide-details
          class="mt-0 pt-0"
          @change="update('inStockOnly', !!$event)"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
// แถบค้นหา/เรียง/กรองสินค้า ใช้กับ v-model เป็น object { search, sort, inStockOnly }
export default {
  name: 'ProductFilterBar',
  props: {
    value: { type: Object, required: true },
  },
  data: () => ({
    sortOptions: [
      { text: 'มาใหม่ล่าสุด', value: 'newest' },
      { text: 'ราคาต่ำไปสูง', value: 'price-asc' },
      { text: 'ราคาสูงไปต่ำ', value: 'price-desc' },
      { text: 'ชื่อ ก-ฮ', value: 'name' },
    ],
  }),
  methods: {
    update(key, val) {
      this.$emit('input', { ...this.value, [key]: val })
    },
  },
}
</script>
