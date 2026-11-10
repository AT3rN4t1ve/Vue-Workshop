<template>
  <BaseCard :id="section" :to="section">
    <SectionTitle :eyebrow="eyebrow" :title="title" />
    <div class="chips">
      <TagChip v-for="item in items" :key="item" :variant="variant">{{ item }}</TagChip>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from '../base/BaseCard.vue'
import SectionTitle from '../base/SectionTitle.vue'
import TagChip from '../base/TagChip.vue'

export default {
  name: 'PreferenceCard',
  components: { BaseCard, SectionTitle, TagChip },
  props: {
    section: { type: String, required: true },
    title: { type: String, required: true },
    eyebrow: { type: String, default: '' },
    items: { type: Array, default: () => [] },
    variant: { type: String, default: 'default' },
  },
}
</script>

<style scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
