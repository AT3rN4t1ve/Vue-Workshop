<template>
  <AuthCard title="สมัครสมาชิก" subtitle="สมัครแล้วรอผู้ดูแลระบบอนุมัติ จึงจะเข้าสู่ระบบได้">
    <v-alert v-if="error" type="error" text dense class="text-body-2">{{ error }}</v-alert>

    <v-form ref="form" @submit.prevent="submit">
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-text-field v-model.trim="form.firstName" label="ชื่อ" :rules="[rules.required]" autocomplete="given-name" outlined dense autofocus />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model.trim="form.lastName" label="นามสกุล" :rules="[rules.required]" autocomplete="family-name" outlined dense />
        </v-col>
      </v-row>

      <v-text-field
        v-model.trim="form.email"
        label="อีเมล"
        type="email"
        :rules="[rules.required, rules.email]"
        prepend-inner-icon="mdi-email-outline"
        autocomplete="email"
        outlined
        dense
      />
      <PasswordField
        v-model="form.password"
        label="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
        :rules="[rules.required, rules.password]"
        autocomplete="new-password"
      />
      <PasswordField
        v-model="confirmPassword"
        label="ยืนยันรหัสผ่าน"
        :rules="[rules.required, rules.samePassword]"
        autocomplete="new-password"
      />

      <v-btn color="primary" block large depressed type="submit" :loading="loading">สมัครสมาชิก</v-btn>
    </v-form>

    <template #footer>
      มีบัญชีอยู่แล้ว?
      <router-link :to="{ name: 'login' }" class="auth-link">เข้าสู่ระบบ</router-link>
    </template>
  </AuthCard>
</template>

<script>
import authService from '../../services/authService'
import AuthCard from '../../components/auth/AuthCard.vue'
import PasswordField from '../../components/auth/PasswordField.vue'

// หน้าสมัครสมาชิก: สมัครสำเร็จแล้วพาไปหน้าเข้าสู่ระบบ (ยัง login ไม่ได้จนกว่า admin จะอนุมัติ)
export default {
  name: 'RegisterView',
  components: { AuthCard, PasswordField },
  data() {
    return {
      form: { firstName: '', lastName: '', email: '', password: '' },
      confirmPassword: '',
      loading: false,
      error: '',
      rules: {
        required: (v) => !!v || 'กรุณากรอกข้อมูล',
        email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '')) || 'รูปแบบอีเมลไม่ถูกต้อง',
        password: (v) => String(v || '').length >= 6 || 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร',
        samePassword: (v) => v === this.form.password || 'รหัสผ่านไม่ตรงกัน',
      },
    }
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return
      this.loading = true
      this.error = ''
      try {
        const user = await authService.register(this.form)
        // คนแรกของระบบได้เป็น admin ที่อนุมัติแล้ว เข้าสู่ระบบได้ทันที
        const registered = user.approved ? 'approved' : '1'
        this.$router.push({ name: 'login', query: { registered, email: user.email } })
      } catch (e) {
        this.error = e.message || 'สมัครสมาชิกไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.auth-link {
  color: #e4572e;
  font-weight: 500;
  text-decoration: none;
}
.auth-link:hover {
  text-decoration: underline;
}
</style>
