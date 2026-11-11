<template>
  <BaseCard id="tech-skills" to="tech-skills" reveal="right" glow>
    <SectionTitle eyebrow="Skills" title="ภาษา & Framework" />
    <div v-for="s in skills" :key="s.group" class="skill-group">
      <p class="label">{{ s.group }}</p>
      <div class="chips">
        <TagChip v-for="item in s.items" :key="item">{{ item }}</TagChip>
      </div>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from '../base/BaseCard.vue'
import SectionTitle from '../base/SectionTitle.vue'
import TagChip from '../base/TagChip.vue'

export default {
  name: 'SkillCard',
  components: { BaseCard, SectionTitle, TagChip },
  props: {
    skills: { type: Array, default: () => [] },
  },
}
</script>

<style scoped>
.skill-group + .skill-group {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
.label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
