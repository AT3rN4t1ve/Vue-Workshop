<template>
  <section id="home" class="hero">
    <div ref="parallax" class="hero__parallax">
      <div class="hero__text">
        <div class="badge"><span class="dot" /> สวัสดีครับ 👋</div>
        <h1>
          {{ profile.firstName }} {{ profile.lastName }}
          <span class="nick">"{{ profile.nickname }}"</span>
        </h1>
        <p v-if="profile.location" class="loc">📍 {{ profile.location }}</p>
        <blockquote v-if="taglines.length" class="tagline">
          <span class="tagline__mark" aria-hidden="true">“</span>
          <p v-for="(line, i) in taglines" :key="i" :class="{ 'tagline__lead': i === 0 }">{{ line }}</p>
        </blockquote>
      </div>
    </div>

    <div class="hero__photo">
      <div class="photo">
        <div class="photo__glow" />
        <div class="photo__frame">
          <img v-if="profile.avatar" :src="profile.avatar" :alt="profile.nickname">
          <span v-else class="photo__initial">{{ initial }}</span>
        </div>
        <span class="corner corner--tl" />
        <span class="corner corner--br" />
      </div>
    </div>
  </section>
</template>

<script>
import { onScrollFrame, prefersReducedMotion } from '../../utils/motion'

export default {
  name: 'HeroSection',
  props: {
    profile: { type: Object, required: true },
  },
  computed: {
    initial() {
      return this.profile.nickname.charAt(0)
    },
    taglines() {
      const t = this.profile.tagline
      if (!t) return []
      return Array.isArray(t) ? t : [t]
    },
  },
  mounted() {
    if (prefersReducedMotion()) return
    this.stopParallax = onScrollFrame(this.applyParallax)
  },
  beforeDestroy() {
    if (this.stopParallax) this.stopParallax()
  },
  methods: {
    applyParallax(scrollY) {
      const el = this.$refs.parallax
      if (!el) return
      if (window.innerWidth < 768) {
        el.style.transform = ''
        el.style.opacity = ''
        return
      }
      const height = this.$el.offsetHeight || 1
      const progress = Math.min(Math.max(scrollY / height, 0), 1)
      el.style.transform = `translateY(${progress * 30}%)`
      el.style.opacity = String(Math.max(1 - progress / 0.6, 0))
    },
  },
}
</script>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  padding: 72px 0 56px;
}
.hero__parallax {
  flex: 1;
  will-change: transform, opacity;
}
.hero__text {
  animation: slide-in 0.8s ease both;
}
.hero__photo {
  flex: 1;
  max-width: 448px;
  animation: scale-in 0.8s 0.1s ease both;
}

.photo {
  position: relative;
  width: 288px;
  height: 288px;
  margin: 0 auto;
}
.photo__glow {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: var(--gradient);
  opacity: 0.25;
  filter: blur(40px);
  transform: scale(1.05);
}
.photo__frame {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: var(--chip);
  border: 1px solid var(--border-strong);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: grid;
  place-items: center;
}
.photo__frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo__initial {
  font-size: 96px;
  font-weight: 800;
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.corner {
  position: absolute;
  width: 64px;
  height: 64px;
  border: 0 solid var(--accent);
  opacity: 0.5;
  pointer-events: none;
}
.corner--tl {
  top: -12px;
  left: -12px;
  border-top-width: 2px;
  border-left-width: 2px;
  border-top-left-radius: 12px;
}
.corner--br {
  bottom: -12px;
  right: -12px;
  border-bottom-width: 2px;
  border-right-width: 2px;
  border-bottom-right-radius: 12px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  color: var(--muted);
  background: var(--chip);
  border: 1px solid var(--border);
  margin-bottom: 16px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.2);
}
h1 {
  margin: 0;
  font-size: clamp(36px, 6vw, 60px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text);
}
.nick {
  display: block;
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.loc {
  margin: 16px 0 0;
  font-size: 14px;
  color: var(--muted);
}
.tagline {
  position: relative;
  max-width: 540px;
  margin: 20px 0 0;
  padding: 22px 24px 22px 28px;
  border-radius: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 12px 32px -18px var(--shadow);
  overflow: hidden;
  text-align: left;
}
.tagline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--gradient);
}
.tagline__mark {
  position: absolute;
  top: -18px;
  right: 14px;
  font-size: 96px;
  font-family: Georgia, serif;
  line-height: 1;
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0.25;
  pointer-events: none;
}
.tagline p {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.8;
}
.tagline p + p {
  margin-top: 10px;
}
.tagline .tagline__lead {
  color: var(--text);
  font-weight: 500;
}

@media (min-width: 768px) {
  .photo {
    width: 384px;
    height: 384px;
  }
}
@media (max-width: 767px) {
  .hero {
    flex-direction: column-reverse;
    text-align: center;
    gap: 40px;
    padding-top: 48px;
  }
  .hero__photo {
    max-width: none;
  }
  .tagline {
    margin: 20px auto 0;
  }
}
@media (max-width: 360px) {
  .photo {
    width: 240px;
    height: 240px;
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
}
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero__text,
  .hero__photo {
    animation: none;
  }
}
</style>
