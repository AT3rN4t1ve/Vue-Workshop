<template>
  <div id="app">
    <div class="bg-blob bg-blob--1" />
    <div class="bg-blob bg-blob--2" />

    <AppNavbar :nickname="profile.nickname" />

    <main class="container">
      <HeroSection :profile="profile" />

      <section id="about" class="grid">
        <EducationCard class="span-2" :education="profile.education" />
        <FavoriteTeamCard :teams="profile.favoriteTeams" />
      </section>

      <section id="interests" class="grid">
        <HobbyCard class="span-3" :hobbies="profile.hobbies" />
        <PreferenceCard eyebrow="Likes" title="สิ่งที่ชอบ 💚" :items="profile.likes" variant="like" />
        <PreferenceCard eyebrow="Dislikes" title="สิ่งที่ไม่ชอบ 💢" :items="profile.dislikes" variant="dislike" />
        <FreeDesignCard :design="profile.freeDesign" />
      </section>

      <section id="strengths">
        <SectionTitle eyebrow="Strengths" title="จุดแข็งของผม" class="strength-head" />
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
}
</script>

<style>
/* ===== Design tokens (light) ===== */
:root {
  --bg: #f6f7fb;
  --surface: rgba(255, 255, 255, 0.75);
  --chip: rgba(15, 23, 42, 0.05);
  --text: #0f172a;
  --muted: #64748b;
  --border: rgba(15, 23, 42, 0.08);
  --border-strong: rgba(124, 58, 237, 0.35);
  --shadow: rgba(124, 58, 237, 0.25);
  --nav-bg: rgba(246, 247, 251, 0.7);
  --accent: #7c3aed;
  --gradient: linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f59e0b 100%);
  --radius: 24px;
}

/* ===== Dark mode ตามการตั้งค่าเครื่อง ===== */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0b0b12;
    --surface: rgba(255, 255, 255, 0.04);
    --chip: rgba(255, 255, 255, 0.06);
    --text: #f1f5f9;
    --muted: #94a3b8;
    --border: rgba(255, 255, 255, 0.08);
    --border-strong: rgba(167, 139, 250, 0.4);
    --shadow: rgba(167, 139, 250, 0.3);
    --nav-bg: rgba(11, 11, 18, 0.6);
    --accent: #a78bfa;
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
  opacity: 0.35;
  pointer-events: none;
}
.bg-blob--1 {
  top: -160px;
  left: -120px;
  background: #7c3aed;
}
.bg-blob--2 {
  bottom: -200px;
  right: -140px;
  background: #ec4899;
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
  margin-top: 40px;
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
