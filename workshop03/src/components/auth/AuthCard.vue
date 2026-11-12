<template>
  <div class="auth-wrap">
    <section class="auth-art" aria-hidden="true">
      <div class="auth-art__ring" />
      <div class="auth-art__plate">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 11h18a9 9 0 0 1-18 0z" />
          <path d="M8 7c0-1.5 1-1.5 1-3" />
          <path d="M12 7c0-1.5 1-1.5 1-3" />
          <path d="M16 7c0-1.5 1-1.5 1-3" />
        </svg>
      </div>
      <div class="auth-art__text">
        <div class="auth-art__title">ผัดร้อน ๆ<br>รอคุณอยู่</div>
        <p class="auth-art__desc">สั่งอาหาร ปรับตัวเลือกได้ตามใจ และติดตามสถานะออเดอร์ได้ทุกขั้นตอน</p>
      </div>
    </section>

    <section class="auth-form">
      <div class="auth-form__inner">
        <h1 class="auth-form__title">{{ title }}</h1>
        <p v-if="subtitle" class="auth-form__subtitle">{{ subtitle }}</p>

        <slot />

        <div v-if="$slots.footer" class="auth-form__footer">
          <slot name="footer" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AuthCard',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
  },
}
</script>

<style scoped>
.auth-wrap {
  display: flex;
  flex-wrap: wrap;
  min-height: 560px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  box-shadow: var(--shadow-sm);
}
.auth-art {
  position: relative;
  flex: 1 1 420px;
  display: flex;
  align-items: flex-end;
  min-height: 320px;
  padding: 40px;
  overflow: hidden;
  background: var(--app-soft);
  color: var(--app-text);
}
.auth-art__ring {
  position: absolute;
  top: 40px;
  right: -80px;
  width: 380px;
  height: 380px;
  border-radius: 50%;
  background: var(--app-soft-raised);
}
.auth-art__plate {
  position: absolute;
  top: 100px;
  right: 30px;
  width: 210px;
  height: 210px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--app-sun);
  color: var(--app-primary-dark);
}
.auth-art__text {
  position: relative;
  max-width: 380px;
}
.auth-art__title {
  font-family: var(--font-heading);
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
}
.auth-art__desc {
  margin: 12px 0 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--app-text-muted);
}
.auth-form {
  flex: 1 1 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}
.auth-form__inner {
  width: 100%;
  max-width: 400px;
}
.auth-form__title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--app-text);
}
.auth-form__subtitle {
  margin: 6px 0 24px;
  font-size: 0.95rem;
  color: var(--app-text-muted);
}
.auth-form__footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--app-border);
  text-align: center;
  font-size: 0.95rem;
}
.auth-form >>> .v-btn.v-size--large {
  border-radius: var(--radius-pill);
  height: 50px;
}
@media (max-width: 960px) {
  .auth-art {
    min-height: 200px;
    padding: 28px;
  }
  .auth-art__ring,
  .auth-art__plate {
    display: none;
  }
  .auth-art__title {
    font-size: 1.6rem;
  }
}
@media (max-width: 600px) {
  .auth-wrap {
    border-radius: var(--radius-lg);
  }
  .auth-art {
    display: none;
  }
  .auth-form {
    padding: 28px 20px;
  }
}
</style>
