<template>
  <BaseCard glow>
    <SectionTitle eyebrow="Education" title="การศึกษา" />
    <div class="edu">
      <div class="edu__icon">🎓</div>
      <div>
        <p class="uni">{{ education.university }}</p>
        <p class="major">{{ education.faculty }} · {{ education.major }}</p>
        <p class="year">{{ education.year }}</p>
      </div>
    </div>
  </BaseCard>
</template>

<script>
// ใช้ครั้งเดียว: จบจากมหาลัย / สาขา
import BaseCard from '../base/BaseCard.vue'
import SectionTitle from '../base/SectionTitle.vue'

export default {
  name: 'EducationCard',
  components: { BaseCard, SectionTitle },
  props: {
    education: { type: Object, required: true },
  },
}
</script>

<style scoped>
.edu {
  display: flex;
  gap: 16px;
  align-items: flex-start;
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
.uni {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}
.major {
  margin-top: 4px;
  color: var(--muted);
}
.year {
  margin-top: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}
</style>
