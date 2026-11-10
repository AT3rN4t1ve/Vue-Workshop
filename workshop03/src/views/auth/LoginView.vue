<template>
  <AuthCard title="เข้าสู่ระบบ" subtitle="เข้าสู่ระบบเพื่อเลือกซื้อและจัดการสินค้า">
    <v-alert v-if="justRegistered" type="success" text dense class="text-body-2">
      สมัครสมาชิกสำเร็จ กรุณารอผู้ดูแลระบบอนุมัติก่อนเข้าสู่ระบบ
    </v-alert>
    <v-alert v-if="error" type="error" text dense class="text-body-2">{{ error }}</v-alert>

    <v-form ref="form" @submit.prevent="submit">
      <v-text-field
        v-model.trim="form.username"
        label="ชื่อผู้ใช้"
        :rules="[rules.required]"
        prepend-inner-icon="mdi-account-outline"
        autocomplete="username"
        outlined
        dense
        autofocus
      />
      <PasswordField v-model="form.password" :rules="[rules.required]" />

      <v-btn color="primary" block large depressed type="submit" :loading="loading">เข้าสู่ระบบ</v-btn>
    </v-form>

    <!-- บัญชีของข้อมูลจำลอง: ลบส่วนนี้ออกเมื่อต่อ API จริง -->
    <div class="demo-box mt-5">
      <div class="text-caption font-weight-bold mb-1">บัญชีทดสอบ (กดเพื่อกรอก)</div>
      <v-chip
        v-for="account in demoAccounts"
        :key="account.username"
        small
        outlined
        class="mr-2 mt-1"
        @click="fill(account)"
      >
        {{ account.label }}
      </v-chip>
    </div>

    <template #footer>
      ยังไม่มีบัญชี?
      <router-link :to="{ name: 'register' }" class="auth-link">สมัครสมาชิก</router-link>
    </template>
  </AuthCard>
</template>

<script>
import AuthCard from '../../components/auth/AuthCard.vue'
import PasswordField from '../../components/auth/PasswordField.vue'

// หน้าเข้าสู่ระบบ: สำเร็จแล้วไปหน้าที่ตั้งใจจะเข้า (query redirect) หรือหน้าร้าน
export default {
  name: 'LoginView',
  components: { AuthCard, PasswordField },
  data: () => ({
    form: { username: '', password: '' },
    loading: false,
    error: '',
    rules: {
      required: (v) => !!v || 'กรุณากรอกข้อมูล',
    },
    demoAccounts: [
      { label: 'admin (ผู้ดูแล)', username: 'admin', password: 'admin1234' },
      { label: 'somchai (สมาชิก)', username: 'somchai', password: '123456' },
      { label: 'newbie (รออนุมัติ)', username: 'newbie', password: '123456' },
    ],
  }),
  computed: {
    justRegistered() {
      return this.$route.query.registered === '1' && !this.error
    },
  },
  created() {
    if (this.$route.query.username) this.form.username = String(this.$route.query.username)
  },
  methods: {
    fill(account) {
      this.form = { username: account.username, password: account.password }
      this.error = ''
    },
    async submit() {
      if (!this.$refs.form.validate()) return
      this.loading = true
      this.error = ''
      try {
        await this.$store.dispatch('auth/login', this.form)
        const redirect = this.$route.query.redirect
        // ปลายทางอาจถูก guard เปลี่ยนเส้นทางอีกที (เช่นหน้าเฉพาะ admin) ไม่ถือเป็น error
        this.$router.replace(typeof redirect === 'string' ? redirect : '/').catch(() => {})
      } catch (e) {
        this.error = e.message || 'เข้าสู่ระบบไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.demo-box {
  background: #f6f7f9;
  border-radius: 10px;
  padding: 12px 14px;
}
.auth-link {
  color: #e4572e;
  font-weight: 500;
  text-decoration: none;
}
.auth-link:hover {
  text-decoration: underline;
}
</style>
