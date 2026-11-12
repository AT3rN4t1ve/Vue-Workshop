<template>
  <section
    class="menu-strip"
    aria-label="เมนูแนะนำ"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <header class="menu-strip__head">
      <div>
        <h2 class="menu-strip__title">เมนูแนะนำวันนี้</h2>
        <p class="menu-strip__sub">ผัดร้อน ๆ ทำตามสั่งทุกจาน · กดที่เมนูเพื่อสั่งได้เลย</p>
      </div>
      <div v-if="items.length > 1" class="menu-strip__nav">
        <v-btn icon outlined small class="menu-strip__arrow" aria-label="เลื่อนไปทางซ้าย" @click="step(-1)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn icon outlined small class="menu-strip__arrow" aria-label="เลื่อนไปทางขวา" @click="step(1)">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </header>

    <div v-if="loading" class="menu-strip__track">
      <v-skeleton-loader v-for="n in 5" :key="n" type="image" class="menu-strip__card menu-strip__card--skeleton" />
    </div>

    <div v-else-if="items.length" ref="track" class="menu-strip__track">
      <router-link
        v-for="item in items"
        :key="item._id"
        :to="{ name: 'product-detail', params: { id: item._id } }"
        class="menu-strip__card"
      >
        <div class="menu-strip__media">
          <img
            v-if="item.imageUrl && !failed[item._id]"
            :src="item.imageUrl"
            :alt="item.name"
            class="menu-strip__img"
            loading="lazy"
            @error="$set(failed, item._id, true)"
          />
          <ProductThumb v-else :name="item.name" :category="item.category" :aspect-ratio="4 / 3" font-size="2.6rem" />
          <span v-if="item.drink" class="menu-strip__tag">เครื่องดื่ม</span>
        </div>
        <div class="menu-strip__name text-truncate">{{ item.name }}</div>
        <div class="menu-strip__price tabular">{{ item.price | price }}</div>
      </router-link>
    </div>
  </section>
</template>

<script>
import ProductThumb from '../common/ProductThumb.vue'
import { compareRecommended, categoryRank } from '../../utils/productVisual'

const MAX_ITEMS = 10
const INTERVAL = 3500

const DRINK = 3
const isDrinkItem = (p) => categoryRank(p.name, p.category) === DRINK

export default {
  name: 'MenuStrip',
  components: { ProductThumb },
  props: {
    products: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  data: () => ({
    paused: false,
    failed: {},
    timer: null,
  }),
  computed: {
    // จานเดียวขึ้นก่อน → กับข้าว → ทานเล่น → เครื่องดื่มปิดท้าย (ลำดับเดียวกับการเรียง "แนะนำ")
    items() {
      const available = this.products.filter((p) => p.stock > 0)
      const foods = available.filter((p) => !isDrinkItem(p)).sort(compareRecommended)
      const drinks = available.filter(isDrinkItem).sort(compareRecommended)
      const drinkCount = Math.min(drinks.length, foods.length ? 2 : MAX_ITEMS)
      return [...foods.slice(0, MAX_ITEMS - drinkCount), ...drinks.slice(0, drinkCount)].map((p) => ({
        ...p,
        drink: isDrinkItem(p),
      }))
    },
  },
  mounted() {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduce) this.timer = setInterval(this.tick, INTERVAL)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    tick() {
      if (this.paused || document.hidden) return
      this.step(1)
    },
    // เลื่อนทีละ 1 การ์ด สุดทางแล้ววนกลับอีกฝั่ง
    step(direction) {
      const track = this.$refs.track
      if (!track || !track.firstElementChild) return
      const card = track.firstElementChild.getBoundingClientRect().width + 14
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4
      const atStart = track.scrollLeft <= 4
      if (direction > 0 && atEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' })
      } else if (direction < 0 && atStart) {
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' })
      } else {
        track.scrollBy({ left: direction * card, behavior: 'smooth' })
      }
    },
  },
}
</script>

<style scoped>
.menu-strip {
  padding: 18px 20px 20px;
  border-radius: var(--radius-lg);
  background: var(--app-soft);
  border: 1px solid var(--app-soft-raised);
}
.menu-strip__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.menu-strip__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--app-text);
}
.menu-strip__sub {
  margin: 2px 0 0;
  font-size: 0.875rem;
  color: var(--app-text-muted);
}
.menu-strip__nav {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.menu-strip__arrow {
  width: 36px !important;
  height: 36px !important;
  border-color: var(--app-border-strong) !important;
  background: var(--app-surface);
  color: var(--app-text) !important;
}
.menu-strip__track {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding-bottom: 2px;
}
.menu-strip__track::-webkit-scrollbar {
  display: none;
}
.menu-strip__card {
  flex: 0 0 184px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 8px 10px;
  border-radius: 16px;
  background: var(--app-surface);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
  color: var(--app-text);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.menu-strip__card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.menu-strip__card:focus-visible {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}
.menu-strip__card--skeleton {
  height: 190px;
  overflow: hidden;
}
.menu-strip__media {
  position: relative;
  aspect-ratio: 4 / 3;
  margin-bottom: 6px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--app-surface-muted);
}
.menu-strip__media >>> .product-thumb {
  border-radius: 0;
}
.menu-strip__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.menu-strip__tag {
  position: absolute;
  top: 6px;
  left: 6px;
  height: 22px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.92);
  color: #0e6e76;
  font-size: 0.7rem;
  font-weight: 600;
}
.menu-strip__name {
  padding: 0 2px;
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 600;
}
.menu-strip__price {
  padding: 0 2px;
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--v-primary-base);
}
@media (max-width: 600px) {
  .menu-strip {
    padding: 14px 12px 16px;
  }
  .menu-strip__card {
    flex-basis: 150px;
  }
  .menu-strip__sub {
    display: none;
  }
}
</style>
