<template>
  <header class="navbar">
    <div class="navbar__inner">
      <a href="#top" class="logo">{{ nickname }}<span>.</span></a>
      <nav class="links">
        <a v-for="link in links" :key="link.href" :href="link.href">{{ link.label }}</a>
      </nav>
    </div>
  </header>
</template>

<script>
// ใช้ครั้งเดียว: แถบเมนูด้านบน
export default {
  name: 'AppNavbar',
  props: {
    nickname: { type: String, required: true },
  },
  data() {
    return {
      links: [
        { href: '#about', label: 'เกี่ยวกับ' },
        { href: '#interests', label: 'ความชอบ' },
        { href: '#strengths', label: 'จุดแข็ง' },
      ],
    }
  },
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(16px);
  background: var(--nav-bg);
  border-bottom: 1px solid var(--border);
}
.navbar__inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  font-weight: 800;
  font-size: 20px;
  color: var(--text);
  text-decoration: none;
}
.logo span {
  color: var(--accent);
}
.links {
  display: flex;
  gap: 20px;
}
.links a {
  color: var(--muted);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}
.links a:hover {
  color: var(--text);
}
@media (max-width: 520px) {
  .links {
    gap: 14px;
  }
  .links a {
    font-size: 13px;
  }
}
</style>
