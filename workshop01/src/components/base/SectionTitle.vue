<template>
  <div class="section-title" :class="`section-title--${size}`">
    <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
    <h2>{{ title }}</h2>
  </div>
</template>

<script>
export default {
  name: 'SectionTitle',
  props: {
    title: { type: String, required: true },
    eyebrow: { type: String, default: '' },
    size: {
      type: String,
      default: 'md',
      validator: (v) => ['md', 'lg'].includes(v),
    },
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
  transition: color 0.2s;
}
.section-title--lg {
  margin-bottom: 20px;
}
.section-title--lg .eyebrow {
  font-size: 13px;
}
.section-title--lg h2 {
  font-size: clamp(26px, 4vw, 34px);
  font-weight: 800;
  letter-spacing: -0.01em;
}
</style>
