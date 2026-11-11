<template>
  <div>
    <PageHeader title="โปรไฟล์ของฉัน" subtitle="แก้ไขข้อมูลส่วนตัวและเปลี่ยนรหัสผ่านได้ที่นี่" />

    <v-row>
      <v-col cols="12" md="7">
        <v-card class="surface-card pa-5">
          <div class="d-flex align-center mb-5">
            <v-avatar color="#FFF1E8" size="56" class="mr-4">
              <span class="profile__initial">{{ initial }}</span>
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">{{ displayName }}</div>
              <div class="text-body-2 grey--text text--darken-1">
                {{ isAdmin ? 'ผู้ดูแลระบบ' : 'สมาชิก' }} · สมัครเมื่อ {{ joinedAt }}
              </div>
            </div>
          </div>

          <div class="text-subtitle-1 font-weight-bold mb-3">ข้อมูลส่วนตัว</div>
          <v-alert v-if="profileError" type="error" text dense class="text-body-2">{{ profileError }}</v-alert>

          <v-form ref="profileForm" @submit.prevent="saveProfile">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.trim="profile.firstName"
                  label="ชื่อ"
                  :rules="[rules.required, rules.maxName]"
                  counter="50"
                  autocomplete="given-name"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.trim="profile.lastName"
                  label="นามสกุล"
                  :rules="[rules.required, rules.maxName]"
                  counter="50"
                  autocomplete="family-name"
                  outlined
                  dense
                />
              </v-col>
            </v-row>

            <v-text-field
              :value="user.email"
              label="อีเมล"
              prepend-inner-icon="mdi-email-outline"
              hint="อีเมลใช้สำหรับเข้าสู่ระบบ ไม่สามารถแก้ไขได้"
              persistent-hint
              outlined
              dense
              readonly
              disabled
              class="mb-4"
            />

            <div class="d-flex">
              <v-spacer />
              <v-btn text class="mr-2" :disabled="!profileChanged || savingProfile" @click="resetProfile">ยกเลิก</v-btn>
              <v-btn color="primary" depressed type="submit" :loading="savingProfile" :disabled="!profileChanged">
                บันทึก
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="surface-card pa-5">
          <div class="text-subtitle-1 font-weight-bold mb-3">เปลี่ยนรหัสผ่าน</div>
          <v-alert v-if="passwordError" type="error" text dense class="text-body-2">{{ passwordError }}</v-alert>

          <v-form ref="passwordForm" @submit.prevent="savePassword">
            <PasswordField
              v-model="password.current"
              label="รหัสผ่านเดิม"
              :rules="[rules.required]"
              autocomplete="current-password"
            />
            <PasswordField
              v-model="password.next"
              label="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
              :rules="[rules.required, rules.password, rules.differentPassword]"
              autocomplete="new-password"
            />
            <PasswordField
              v-model="password.confirm"
              label="ยืนยันรหัสผ่านใหม่"
              :rules="[rules.required, rules.samePassword]"
              autocomplete="new-password"
            />

            <v-btn color="primary" block depressed type="submit" :loading="savingPassword">เปลี่ยนรหัสผ่าน</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import authService from '../services/authService'
import { formatDate } from '../utils/format'
import PageHeader from '../components/common/PageHeader.vue'
import PasswordField from '../components/auth/PasswordField.vue'

const NAME_MAX_LENGTH = 50

export default {
  name: 'ProfileView',
  components: { PageHeader, PasswordField },
  data() {
    return {
      profile: { firstName: '', lastName: '' },
      password: { current: '', next: '', confirm: '' },
      savingProfile: false,
      savingPassword: false,
      profileError: '',
      passwordError: '',
      rules: {
        required: (v) => !!v || 'กรุณากรอกข้อมูล',
        maxName: (v) => String(v || '').length <= NAME_MAX_LENGTH || `ยาวได้ไม่เกิน ${NAME_MAX_LENGTH} ตัวอักษร`,
        password: (v) => String(v || '').length >= 6 || 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร',
        differentPassword: (v) => v !== this.password.current || 'รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม',
        samePassword: (v) => v === this.password.next || 'รหัสผ่านไม่ตรงกัน',
      },
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['displayName', 'isAdmin']),
    initial() {
      return this.displayName.charAt(0).toUpperCase()
    },
    joinedAt() {
      return formatDate(this.user.createdAt)
    },
    profileChanged() {
      return (
        this.profile.firstName !== (this.user.firstName || '') ||
        this.profile.lastName !== (this.user.lastName || '')
      )
    },
  },
  created() {
    this.resetProfile()
    const before = { ...this.profile }
    this.$store
      .dispatch('auth/fetchMe')
      .then(() => {
        const untouched = before.firstName === this.profile.firstName && before.lastName === this.profile.lastName
        if (untouched) this.resetProfile()
      })
      .catch(() => {})
  },
  methods: {
    resetProfile() {
      this.profile = {
        firstName: this.user.firstName || '',
        lastName: this.user.lastName || '',
      }
      this.profileError = ''
      if (this.$refs.profileForm) this.$refs.profileForm.resetValidation()
    },
    async saveProfile() {
      if (!this.$refs.profileForm.validate()) return
      this.savingProfile = true
      this.profileError = ''
      try {
        await this.$store.dispatch('auth/updateProfile', this.profile)
        this.resetProfile()
        this.$store.dispatch('ui/notify', 'บันทึกข้อมูลส่วนตัวแล้ว')
      } catch (e) {
        this.profileError = e.message || 'บันทึกไม่สำเร็จ'
      } finally {
        this.savingProfile = false
      }
    },
    async savePassword() {
      if (!this.$refs.passwordForm.validate()) return
      this.savingPassword = true
      this.passwordError = ''
      try {
        await authService.changePassword({
          currentPassword: this.password.current,
          newPassword: this.password.next,
        })
        this.password = { current: '', next: '', confirm: '' }
        this.$refs.passwordForm.resetValidation()
        this.$store.dispatch('ui/notify', 'เปลี่ยนรหัสผ่านแล้ว')
      } catch (e) {
        this.passwordError = e.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ'
      } finally {
        this.savingPassword = false
      }
    },
  },
}
</script>

<style scoped>
.profile__initial {
  font-size: 22px;
  font-weight: 700;
  color: #e4572e;
}
</style>
