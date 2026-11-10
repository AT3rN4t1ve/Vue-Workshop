<template>
  <div id="app">
    <div class="bg-blob bg-blob--1" />
    <div class="bg-blob bg-blob--2" />

    <AppNavbar />

    <main class="container">
      <HeroSection :profile="profile" />

      <!-- การ์ดแต่ละใบมี path ของตัวเอง เช่น /education, /likes (ดู router/index.js) -->
      <section class="grid">
        <EducationCard class="span-2" :education="profile.education" />
        <FavoriteTeamCard :teams="profile.favoriteTeams" />
      </section>

      <section class="grid">
        <HobbyCard class="span-3" :hobbies="profile.hobbies" />
        <PreferenceCard section="likes" eyebrow="Likes" title="สิ่งที่ชอบ 💚" :items="profile.likes" variant="like" />
        <PreferenceCard section="dislikes" eyebrow="Dislikes" title="สิ่งที่ไม่ชอบ 💢" :items="profile.dislikes" variant="dislike" />
        <FreeDesignCard :design="profile.freeDesign" />
      </section>

      <section id="strengths">
        <a href="/strengths" class="strength-head" @click.prevent="goToSection('strengths')">
          <SectionTitle eyebrow="Strengths" title="จุดแข็งของผม" />
        </a>
        <div class="grid">
          <StrengthItem v-for="s in profile.strengths" :key="s.title" v-bind="s" />
        </div>
      </section>
    </main>

    <AppFooter :name="`${profile.firstName} ${profile.lastName}`" :contacts="profile.contacts" />
  </div>
</template>

<script>
import profile from './data/profile'
import { goToSection } from './router'
import SectionTitle from './components/base/SectionTitle.vue'
import AppNavbar from './components/layout/AppNavbar.vue'
import AppFooter from './components/layout/AppFooter.vue'
import HeroSection from './components/sections/HeroSection.vue'
import EducationCard from './components/sections/EducationCard.vue'
import FavoriteTeamCard from './components/sections/FavoriteTeamCard.vue'
import HobbyCard from './components/sections/HobbyCard.vue'
import PreferenceCard from './components/sections/PreferenceCard.vue'
import FreeDesignCard from './components/sections/FreeDesignCard.vue'
import StrengthItem from './components/sections/StrengthItem.vue'

export default {
  name: 'App',
  components: {
    SectionTitle,
    AppNavbar,
    AppFooter,
    HeroSection,
    EducationCard,
    FavoriteTeamCard,
    HobbyCard,
    PreferenceCard,
    FreeDesignCard,
    StrengthItem,
  },
  data() {
    return { profile }
  },
  methods: {
    goToSection,
  },
}
</script>

<style>
/* ==========================================================
   ธีม = โทนสี (data-palette) × โหมด (data-mode) บน <html>
   ตั้งค่าผ่าน ThemeSwitcher → utils/theme.js (เก็บใน localStorage)
   ========================================================== */

/* ----- 1) โทนสี: แต่ละ palette กำหนดแค่สีหลัก ----- */
:root,
:root[data-palette='violet'] {
  --accent-light: #7c3aed;
  --accent-dark: #a78bfa;
  --gradient: linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #ec4899 100%);
  --blob-1: #7c3aed;
  --blob-2: #ec4899;
}
:root[data-palette='ocean'] {
  --accent-light: #0284c7;
  --accent-dark: #38bdf8;
  --gradient: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
  --blob-1: #0ea5e9;
  --blob-2: #6366f1;
}
:root[data-palette='emerald'] {
  --accent-light: #059669;
  --accent-dark: #34d399;
  --gradient: linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #84cc16 100%);
  --blob-1: #10b981;
  --blob-2: #84cc16;
}
:root[data-palette='sunset'] {
  --accent-light: #ea580c;
  --accent-dark: #fb923c;
  --gradient: linear-gradient(135deg, #f97316 0%, #ef4444 50%, #e11d48 100%);
  --blob-1: #f97316;
  --blob-2: #e11d48;
}
:root[data-palette='mono'] {
  --accent-light: #334155;
  --accent-dark: #cbd5e1;
  --gradient: linear-gradient(135deg, #475569 0%, #94a3b8 100%);
  --blob-1: #64748b;
  --blob-2: #94a3b8;
}

/* ----- 2) โหมดสว่าง (ค่าเริ่มต้น) ----- */
:root {
  --accent: var(--accent-light);
  --bg: color-mix(in srgb, var(--accent-light) 4%, #f8fafc);
  --surface: rgba(255, 255, 255, 0.72);
  --surface-solid: #ffffff;
  --panel: rgba(255, 255, 255, 0.96);
  --chip: rgba(15, 23, 42, 0.05);
  --text: #0f172a;
  --muted: #64748b;
  --border: rgba(15, 23, 42, 0.08);
  --border-strong: color-mix(in srgb, var(--accent) 40%, transparent);
  --shadow: color-mix(in srgb, var(--accent) 28%, transparent);
  --nav-bg: color-mix(in srgb, var(--bg) 72%, transparent);
  --blob-opacity: 0.28;
  --radius: 24px;
  color-scheme: light;
}

/* ----- 3) โหมดมืด: เลือกเอง หรือ auto + เครื่องตั้งเป็น dark ----- */
:root[data-mode='dark'] {
  --accent: var(--accent-dark);
  --bg: color-mix(in srgb, var(--accent-dark) 5%, #09090f);
  --surface: rgba(255, 255, 255, 0.04);
  --surface-solid: #1e1e2a;
  --panel: rgba(20, 20, 30, 0.96);
  --chip: rgba(255, 255, 255, 0.06);
  --text: #f1f5f9;
  --muted: #94a3b8;
  --border: rgba(255, 255, 255, 0.08);
  --blob-opacity: 0.32;
  color-scheme: dark;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-mode='light']):not([data-mode='dark']) {
    --accent: var(--accent-dark);
    --bg: color-mix(in srgb, var(--accent-dark) 5%, #09090f);
    --surface: rgba(255, 255, 255, 0.04);
    --surface-solid: #1e1e2a;
    --panel: rgba(20, 20, 30, 0.96);
    --chip: rgba(255, 255, 255, 0.06);
    --text: #f1f5f9;
    --muted: #94a3b8;
    --border: rgba(255, 255, 255, 0.08);
    --blob-opacity: 0.32;
    color-scheme: dark;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: 'Plus Jakarta Sans', 'Noto Sans Thai', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

#app {
  position: relative;
  min-height: 100vh;
}

/* แสงฟุ้งพื้นหลัง */
.bg-blob {
  position: fixed;
  z-index: -1;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: var(--blob-opacity);
  pointer-events: none;
  transition: background-color 0.4s ease;
}
.bg-blob--1 {
  top: -160px;
  left: -120px;
  background: var(--blob-1);
}
.bg-blob--2 {
  bottom: -200px;
  right: -140px;
  background: var(--blob-2);
}

.container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 16px;
}
.container > section {
  scroll-margin-top: 80px;
  margin-bottom: 16px;
}

/* Bento grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.span-2 {
  grid-column: span 2;
}
.span-3 {
  grid-column: span 3;
}
.strength-head {
  display: inline-block;
  margin-top: 40px;
  text-decoration: none;
}
.strength-head:hover h2 {
  color: var(--accent);
}

@media (max-width: 820px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .span-2,
  .span-3 {
    grid-column: auto;
  }
}
</style>
