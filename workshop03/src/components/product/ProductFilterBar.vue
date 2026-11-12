<template>
  <div class="filter-bar">
    <div class="filter-bar__row">
      <v-text-field
        :value="value.search"
        placeholder="ค้นหาเมนู เช่น กะเพรา ข้าวผัด"
        aria-label="ค้นหาเมนู"
        prepend-inner-icon="mdi-magnify"
        background-color="white"
        class="filter-bar__search"
        outlined
        rounded
        dense
        hide-details
        clearable
        @input="update('search', $event || '')"
      />
      <v-select
        :value="value.sort"
        :items="sortOptions"
        :menu-props="{ offsetY: true }"
        aria-label="เรียงตาม"
        prepend-inner-icon="mdi-sort"
        background-color="white"
        class="filter-bar__sort"
        outlined
        rounded
        dense
        hide-details
        @input="update('sort', $event)"
      />
      <v-chip
        :input-value="value.inStockOnly"
        class="filter-bar__toggle"
        :class="{ 'filter-bar__toggle--on': value.inStockOnly }"
        filter
        @click="update('inStockOnly', !value.inStockOnly)"
      >
        ยังไม่หมด
      </v-chip>
    </div>

    <v-chip-group
      v-if="categories.length > 1"
      :value="value.category"
      mandatory
      show-arrows
      active-class="category-chip--active"
      class="filter-bar__categories"
      @change="update('category', $event)"
    >
      <v-chip :value="allValue" class="category-chip">ทั้งหมด</v-chip>
      <v-chip v-for="category in categories" :key="category" :value="category" class="category-chip">
        {{ category }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

<script>
export default {
  name: 'ProductFilterBar',
  props: {
    value: { type: Object, required: true },
    categories: { type: Array, default: () => [] },
    allValue: { type: String, required: true },
  },
  data: () => ({
    sortOptions: [
      { text: 'แนะนำ', value: 'recommended' },
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

<style scoped>
.filter-bar {
  position: sticky;
  top: var(--header-height);
  z-index: 4;
  margin: 0 -12px 8px;
  padding: 12px 12px 4px;
  background: var(--app-bg);
}
.filter-bar__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.filter-bar__search {
  flex: 1 1 320px;
  min-width: 0;
}
.filter-bar__sort {
  flex: 0 0 200px;
}
.filter-bar__search >>> fieldset,
.filter-bar__sort >>> fieldset {
  border-color: var(--app-border-strong);
}
.filter-bar__toggle.v-chip {
  height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-pill);
  background: var(--app-surface) !important;
  border: 1px solid var(--app-border-strong);
  color: var(--app-text-muted);
  font-weight: 500;
}
.filter-bar__toggle--on.v-chip {
  background: var(--app-primary-tint) !important;
  border-color: var(--v-primary-base);
  color: var(--v-primary-base);
}
.filter-bar__categories {
  margin-top: 4px;
}
.category-chip.v-chip {
  background: var(--app-surface) !important;
  border: 1px solid var(--app-border);
  color: var(--app-text-muted);
  font-weight: 500;
  padding: 0 16px;
}
.category-chip.v-chip:hover {
  border-color: var(--app-border-strong);
}
.category-chip--active.v-chip {
  background: var(--v-primary-base) !important;
  border-color: var(--v-primary-base);
  color: #fff;
  box-shadow: 0 4px 12px var(--shadow-primary);
}
@media (max-width: 600px) {
  .filter-bar__search {
    flex-basis: 100%;
  }
  .filter-bar__sort {
    flex: 1 1 auto;
  }
}
</style>
