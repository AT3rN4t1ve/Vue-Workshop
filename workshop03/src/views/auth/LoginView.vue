<template>
  <AuthCard title="เข้าสู่ระบบ" subtitle="เข้าสู่ระบบเพื่อสั่งอาหารและติดตามออเดอร์">
    <v-alert v-if="registered && !error" type="success" text dense class="text-body-2">
      <template v-if="registered === 'approved'">
        สมัครสมาชิกสำเร็จ คุณเป็นผู้ดูแลระบบคนแรก เข้าสู่ระบบได้เลย
      </template>
      <template v-else>สมัครสมาชิกสำเร็จ กรุณารอผู้ดูแลระบบอนุมัติก่อนเข้าสู่ระบบ</template>
    </v-alert>
    <v-alert v-if="error" type="error" text dense class="text-body-2">{{ error }}</v-alert>

    <v-form ref="form" @submit.prevent="submit">
      <v-text-field
        v-model.trim="form.email"
        label="อีเมล"
        type="email"
        :rules="[rules.required]"
        prepend-inner-icon="mdi-email-outline"
        autocomplete="email"
        outlined
        dense
        autofocus
      />
      <PasswordField v-model="form.password" :rules="[rules.required]" />

      <v-btn color="primary" block large depressed type="submit" :loading="loading">เข้าสู่ระบบ</v-btn>
    </v-form>

    <template #footer>
      ยังไม่มีบัญชี?
      <router-link :to="{ name: 'register' }" class="auth-link">สมัครสมาชิก</router-link>
    </template>
  </AuthCard>
</template>

<script>
import AuthCard from '../../components/auth/AuthCard.vue'
import PasswordField from '../../components/auth/PasswordField.vue'

export default {
  name: 'LoginView',
  components: { AuthCard, PasswordField },
  data: () => ({
    form: { email: '', password: '' },
    loading: false,
    error: '',
    rules: {
      required: (v) => !!v || 'กรุณากรอกข้อมูล',
    },
  }),
  computed: {
    registered() {
      return this.$route.query.registered
    },
  },
  created() {
    if (this.$route.query.email) this.form.email = String(this.$route.query.email)
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return
      this.loading = true
      this.error = ''
      try {
        await this.$store.dispatch('auth/login', this.form)
        const redirect = this.$route.query.redirect
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
.auth-link {
  color: var(--v-primary-base);
  font-weight: 500;
  text-decoration: none;
}
.auth-link:hover {
  text-decoration: underline;
}
</style>
