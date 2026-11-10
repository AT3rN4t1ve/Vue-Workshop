<template>
  <BaseCard to="strengths">
    <div class="icon">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <p>{{ desc }}</p>
  </BaseCard>
</template>

<script>
import BaseCard from '../base/BaseCard.vue'

export default {
  name: 'StrengthItem',
  components: { BaseCard },
  props: {
    icon: { type: String, default: '✨' },
    title: { type: String, required: true },
    desc: { type: String, default: '' },
  },
}
</script>

<style scoped>
.icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 24px;
  background: var(--chip);
  margin-bottom: 16px;
}
h3 {
  margin: 0 0 6px;
  font-size: 17px;
  color: var(--text);
}
p {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
  font-size: 14px;
}
</style>
