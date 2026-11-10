<template>
  <header class="navbar">
    <div class="navbar__inner">
      <a href="/home" class="logo" @click.prevent="go('home')">About Me<span>.</span></a>
      <div class="right">
        <nav class="links">
          <a
            href="/home"
            class="home-btn"
            :class="{ 'is-active': current === 'home' }"
            @click.prevent="go('home')"
          >🏠 <span class="home-btn__text">Home</span></a>
          <a
            v-for="link in links"
            :key="link.to"
            :href="`/${link.to}`"
            :class="{ 'is-active': link.group.includes(current) }"
            @click.prevent="go(link.to)"
          ><span class="label-full">{{ link.label }}</span><span class="label-short">{{ link.short }}</span></a>
        </nav>
        <ThemeSwitcher />
      </div>
    </div>
  </header>
</template>

<script>
import ThemeSwitcher from './ThemeSwitcher.vue'
import { goToSection } from '../../router'

export default {
  name: 'AppNavbar',
  components: { ThemeSwitcher },
  data() {
    return {
      links: [
        {
          to: 'personal',
          label: 'ตัวตน',
          short: 'ตัวตน',
          group: ['personal', 'hobbies', 'likes', 'dislikes', 'teams'],
        },
        {
          to: 'skills',
          label: 'การเรียน & ความถนัด',
          short: 'ความถนัด',
          group: ['skills', 'education', 'free-design', 'strengths'],
        },
      ],
    }
  },
  computed: {
    current() {
      return this.$route.params.section || 'home'
    },
  },
  methods: {
    go(section) {
      goToSection(section)
    },
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
.right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.links {
  display: flex;
  align-items: center;
  gap: 4px;
}
.links a {
  padding: 6px 12px;
  border-radius: 999px;
  color: var(--muted);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: color 0.2s, background-color 0.2s;
}
.links a:hover {
  color: var(--text);
}
.links a.is-active {
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  font-weight: 600;
}
.label-short {
  display: none;
}
@media (max-width: 720px) {
  .label-full {
    display: none;
  }
  .label-short {
    display: inline;
  }
}
@media (max-width: 560px) {
  .right {
    gap: 8px;
  }
  .links a {
    padding: 6px 8px;
    font-size: 13px;
  }
  .home-btn__text {
    display: none;
  }
}
@media (max-width: 400px) {
  .logo {
    font-size: 17px;
  }
}
</style>
