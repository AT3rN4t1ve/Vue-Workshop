<template>
  <div id="app">
    <div ref="bg" class="bg-layer" aria-hidden="true">
      <div class="bg-blob bg-blob--1" />
      <div class="bg-blob bg-blob--2" />
      <div class="bg-blob bg-blob--3" />
    </div>

    <AppNavbar />

    <main class="container">
      <HeroSection :profile="profile" />

      <section id="personal" class="group">
        <a v-reveal href="/personal" class="group-head" @click.prevent="goToSection('personal')">
          <SectionTitle size="lg" eyebrow="Personal" title="ตัวตน" />
        </a>
        <div class="grid">
          <HobbyCard class="span-3" :hobbies="profile.hobbies" />
          <PreferenceCard section="likes" eyebrow="Likes" title="สิ่งที่ชอบ 💚" :items="profile.likes" variant="like" />
          <PreferenceCard section="dislikes" eyebrow="Dislikes" title="สิ่งที่ไม่ชอบ 💢" :items="profile.dislikes" variant="dislike" />
          <FavoriteTeamCard :teams="profile.favoriteTeams" />
        </div>
      </section>

      <section id="skills" class="group">
        <a v-reveal href="/skills" class="group-head" @click.prevent="goToSection('skills')">
          <SectionTitle size="lg" eyebrow="Study & Skills" title="การเรียน & ความถนัด" />
        </a>
        <div class="grid">
          <EducationCard class="span-2" :education="profile.education" />
          <FreeDesignCard :design="profile.freeDesign" />
          <div id="strengths" class="span-3 strengths">
            <SectionTitle v-reveal eyebrow="Strengths" title="จุดแข็งของผม" />
            <div class="grid">
              <StrengthItem v-for="s in profile.strengths" :key="s.title" v-bind="s" />
            </div>
          </div>
        </div>
      </section>
    </main>

    <AppFooter :name="`${profile.firstName} ${profile.lastName}`" :contacts="profile.contacts" />
  </div>
</template>

<script>
import profile from './data/profile'
import { goToSection } from './router'
import { onScrollFrame, prefersReducedMotion } from './utils/motion'
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
  mounted() {
    if (prefersReducedMotion()) return
    this.stopParallax = onScrollFrame((scrollY) => {
      const y = Math.min(scrollY, window.innerHeight) * 0.25
      this.$refs.bg.style.transform = `translateY(${y}px)`
    })
  },
  beforeDestroy() {
    if (this.stopParallax) this.stopParallax()
  },
  methods: {
    goToSection,
  },
}
</script>

<style>
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
  font-family: 'Outfit', 'Prompt', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

#app {
  position: relative;
  min-height: 100vh;
}

.bg-layer {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  will-change: transform;
}
.bg-blob {
  position: absolute;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: var(--blob-opacity);
  transition: background-color 0.4s ease;
  animation: blob-float 7s ease-in-out infinite;
}
.bg-blob--1 {
  top: -160px;
  left: -120px;
  background: var(--blob-1);
}
.bg-blob--2 {
  top: 10%;
  right: -160px;
  background: var(--blob-2);
  animation-delay: -2.3s;
}
.bg-blob--3 {
  bottom: -220px;
  left: 25%;
  width: 420px;
  height: 420px;
  background: var(--blob-1);
  opacity: calc(var(--blob-opacity) * 0.7);
  animation-delay: -4.6s;
}

@keyframes blob-float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.reveal {
  opacity: 0;
  translate: 0 28px;
  transition: opacity 0.6s ease var(--reveal-delay, 0ms), translate 0.6s ease var(--reveal-delay, 0ms);
}
.reveal.is-revealed {
  opacity: 1;
  translate: none;
}

@media (prefers-reduced-motion: reduce) {
  .bg-blob {
    animation: none;
  }
  .reveal {
    opacity: 1;
    translate: none;
    transition: none;
  }
}

.container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 16px;
}
.group {
  margin-top: 56px;
}

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
.strengths {
  margin-top: 24px;
}
.group-head {
  display: inline-block;
  text-decoration: none;
}
.group-head:hover h2 {
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
