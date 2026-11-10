<template>
  <div class="section-title">
    <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
    <h2>{{ title }}</h2>
  </div>
</template>

<script>
// ใช้เยอะ: หัวข้อของแต่ละ section
export default {
  name: 'SectionTitle',
  props: {
    title: { type: String, required: true },
    eyebrow: { type: String, default: '' },
  },
}
</script>

<style scoped>
.section-title {
  margin-bottom: 16px;
}
.eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 4px;
}
h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
}
</style>
