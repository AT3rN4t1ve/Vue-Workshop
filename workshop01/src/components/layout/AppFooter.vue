<template>
  <footer class="footer">
    <div class="contacts">
      <a v-for="c in contacts" :key="c.label" :href="c.url" target="_blank" rel="noopener">{{ c.label }} ↗</a>
    </div>
    <p>© {{ year }} {{ name }} · Made with Vue</p>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  props: {
    name: { type: String, required: true },
    contacts: { type: Array, default: () => [] },
  },
  computed: {
    year() {
      return new Date().getFullYear()
    },
  },
}
</script>

<style scoped>
.footer {
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 16px 56px;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
}
.contacts {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 12px;
}
.contacts a {
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
}
.contacts a:hover {
  color: var(--accent);
}
</style>
