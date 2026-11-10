<template>
  <BaseCard id="hobbies" to="hobbies">
    <SectionTitle eyebrow="Hobbies" title="งานอดิเรก" />
    <div class="chips">
      <TagChip v-for="h in hobbies" :key="h.label" :icon="h.icon">{{ h.label }}</TagChip>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from '../base/BaseCard.vue'
import SectionTitle from '../base/SectionTitle.vue'
import TagChip from '../base/TagChip.vue'

export default {
  name: 'HobbyCard',
  components: { BaseCard, SectionTitle, TagChip },
  props: {
    hobbies: { type: Array, default: () => [] },
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
