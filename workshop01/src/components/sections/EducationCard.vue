<template>
  <BaseCard id="education" to="education" reveal="left" glow>
    <SectionTitle eyebrow="Education" title="การศึกษา" />
    <ol class="timeline">
      <li v-for="(edu, i) in education" :key="edu.school" class="edu" :class="{ 'edu--latest': i === 0 }">
        <div class="edu__icon">{{ i === 0 ? '🎓' : '🏫' }}</div>
        <div>
          <span class="level">{{ edu.level }}</span>
          <p class="uni">{{ edu.school }}</p>
          <p class="major">{{ edu.major }}</p>
          <p class="year">{{ edu.year }}</p>
        </div>
      </li>
    </ol>
  </BaseCard>
</template>

<script>
import BaseCard from '../base/BaseCard.vue'
import SectionTitle from '../base/SectionTitle.vue'

export default {
  name: 'EducationCard',
  components: { BaseCard, SectionTitle },
  props: {
    education: { type: Array, default: () => [] },
  },
}
</script>

<style scoped>
.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 18px;
}
.edu {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.edu:not(.edu--latest) {
  opacity: 0.75;
}
.edu__icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 26px;
  background: var(--chip);
}
p {
  margin: 0;
}
.level {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
}
.uni {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}
.major {
  margin-top: 2px;
  color: var(--muted);
}
.year {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}
</style>
