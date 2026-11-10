<template>
  <BaseCard id="free-design" to="free-design" glow>
    <SectionTitle eyebrow="Creative" :title="design.title" />
    <p class="desc">{{ design.desc }}</p>
    <div class="chips">
      <TagChip v-for="t in design.tools" :key="t">{{ t }}</TagChip>
    </div>
  </BaseCard>
</template>

<script>
// ใช้ครั้งเดียว: Free Design
import BaseCard from '../base/BaseCard.vue'
import SectionTitle from '../base/SectionTitle.vue'
import TagChip from '../base/TagChip.vue'

export default {
  name: 'FreeDesignCard',
  components: { BaseCard, SectionTitle, TagChip },
  props: {
    design: { type: Object, required: true },
  },
}
</script>

<style scoped>
.desc {
  margin: 0 0 16px;
  color: var(--muted);
  line-height: 1.7;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
