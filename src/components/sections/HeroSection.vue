<template>
  <section id="top" class="hero">
    <div class="avatar">
      <img v-if="profile.avatar" :src="profile.avatar" :alt="profile.nickname">
      <span v-else>{{ initial }}</span>
    </div>
    <div class="badge"><span class="dot" /> สวัสดีครับ 👋</div>
    <h1>
      {{ profile.firstName }} {{ profile.lastName }}
      <span class="nick">"{{ profile.nickname }}"</span>
    </h1>
    <p class="role">{{ profile.role }}</p>
    <p class="tagline">{{ profile.tagline }}</p>
  </section>
</template>

<script>
// ใช้ครั้งเดียว: ส่วนหัว แนะนำชื่อ-นามสกุล-ชื่อเล่น
export default {
  name: 'HeroSection',
  props: {
    profile: { type: Object, required: true },
  },
  computed: {
    initial() {
      return this.profile.nickname.charAt(0)
    },
  },
}
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 72px 0 48px;
}
.avatar {
  width: 112px;
  height: 112px;
  margin: 0 auto 24px;
  border-radius: 32px;
  background: var(--gradient);
  display: grid;
  place-items: center;
  font-size: 44px;
  font-weight: 800;
  color: #fff;
  overflow: hidden;
  box-shadow: 0 20px 60px -15px var(--accent);
  transform: rotate(-4deg);
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  font-size: clamp(32px, 6vw, 56px);
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
.role {
  margin: 16px 0 8px;
  font-weight: 600;
  color: var(--text);
}
.tagline {
  max-width: 520px;
  margin: 0 auto;
  color: var(--muted);
  line-height: 1.7;
}
</style>
