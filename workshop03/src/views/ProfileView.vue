<template>
  <div>
    <PageHeader title="โปรไฟล์ของฉัน" subtitle="แก้ไขข้อมูลส่วนตัวและเปลี่ยนรหัสผ่านได้ที่นี่" />

    <v-card class="surface-card profile-hero mb-6">
      <div class="profile-hero__cover" aria-hidden="true">
        <span class="profile-hero__ring" />
        <span class="profile-hero__dot" />
      </div>
      <div class="profile-hero__body">
        <div class="profile-avatar">
          <v-avatar size="88" class="profile-hero__avatar">
            <v-img v-if="user.avatar" :src="user.avatar" alt="รูปโปรไฟล์" />
            <span v-else class="profile__initial">{{ initial }}</span>
            <div v-if="savingAvatar" class="profile-avatar__loading">
              <v-progress-circular indeterminate size="28" width="3" color="white" />
            </div>
          </v-avatar>

          <v-menu offset-y :disabled="!user.avatar || savingAvatar">
            <template #activator="{ on, attrs }">
              <v-btn
                fab
                x-small
                depressed
                color="primary"
                class="profile-avatar__edit"
                :aria-label="user.avatar ? 'จัดการรูปโปรไฟล์' : 'เพิ่มรูปโปรไฟล์'"
                :disabled="savingAvatar"
                v-bind="attrs"
                v-on="user.avatar ? on : { click: pickAvatar }"
              >
                <v-icon small>mdi-camera</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="pickAvatar">
                <v-list-item-icon class="mr-3"><v-icon>mdi-image-edit-outline</v-icon></v-list-item-icon>
                <v-list-item-title>เปลี่ยนรูป</v-list-item-title>
              </v-list-item>
              <v-list-item @click="removeAvatar">
                <v-list-item-icon class="mr-3"><v-icon color="error">mdi-delete-outline</v-icon></v-list-item-icon>
                <v-list-item-title class="error--text">ลบรูป</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <input ref="avatarInput" type="file" :accept="avatarAccept" hidden @change="onAvatarSelected" />
        </div>
        <div class="profile-hero__text">
          <div class="profile-hero__name">{{ displayName }}</div>
          <div class="text-body-2 grey--text text--darken-1">
            {{ user.email }} · {{ isAdmin ? 'ผู้ดูแลระบบ' : 'สมาชิก' }} · สมัครเมื่อ {{ joinedAt }}
          </div>
        </div>
        <v-btn text rounded color="error" class="profile-hero__logout" @click="logout">
          <v-icon left>mdi-logout</v-icon>
          ออกจากระบบ
        </v-btn>
      </div>
    </v-card>

    <v-row>
      <v-col cols="12" md="7">
        <v-card class="surface-card pa-6" height="100%">
          <h2 class="profile-section__title">ข้อมูลส่วนตัว</h2>
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
              <v-btn text rounded class="mr-2" :disabled="!profileChanged || savingProfile" @click="resetProfile">ยกเลิก</v-btn>
              <v-btn color="primary" depressed rounded large type="submit" :loading="savingProfile" :disabled="!profileChanged">
                บันทึก
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="surface-card pa-6" height="100%">
          <h2 class="profile-section__title">เปลี่ยนรหัสผ่าน</h2>
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

            <v-btn color="primary" outlined block rounded large type="submit" :loading="savingPassword">เปลี่ยนรหัสผ่าน</v-btn>
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
import { AVATAR_ACCEPT, AVATAR_MAX_FILE_SIZE, toAvatarDataUrl } from '../utils/image'
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
      savingAvatar: false,
      avatarAccept: AVATAR_ACCEPT,
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
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push({ name: 'login' })
    },
    pickAvatar() {
      this.$refs.avatarInput.click()
    },
    async onAvatarSelected(event) {
      const file = event.target.files[0]
      event.target.value = '' // ให้เลือกไฟล์เดิมซ้ำได้
      if (!file) return

      if (!AVATAR_ACCEPT.split(',').includes(file.type)) {
        this.$store.dispatch('ui/notify', { text: 'รองรับเฉพาะไฟล์ PNG, JPG หรือ WebP', color: 'error' })
        return
      }
      if (file.size > AVATAR_MAX_FILE_SIZE) {
        this.$store.dispatch('ui/notify', { text: 'ไฟล์รูปต้องมีขนาดไม่เกิน 5 MB', color: 'error' })
        return
      }

      this.savingAvatar = true
      try {
        const avatar = await toAvatarDataUrl(file)
        await this.$store.dispatch('auth/updateAvatar', avatar)
        this.$store.dispatch('ui/notify', 'อัปเดตรูปโปรไฟล์แล้ว')
      } catch (e) {
        this.$store.dispatch('ui/notify', { text: e.message || 'อัปโหลดรูปไม่สำเร็จ', color: 'error' })
      } finally {
        this.savingAvatar = false
      }
    },
    async removeAvatar() {
      this.savingAvatar = true
      try {
        await this.$store.dispatch('auth/removeAvatar')
        this.$store.dispatch('ui/notify', 'ลบรูปโปรไฟล์แล้ว')
      } catch (e) {
        this.$store.dispatch('ui/notify', { text: e.message || 'ลบรูปไม่สำเร็จ', color: 'error' })
      } finally {
        this.savingAvatar = false
      }
    },
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
  font-family: var(--font-heading);
  font-size: 34px;
  font-weight: 600;
  color: var(--app-primary-dark);
}
.profile-hero {
  overflow: hidden;
}
.profile-hero__cover {
  position: relative;
  height: 96px;
  overflow: hidden;
  background: var(--app-soft);
}
.profile-hero__ring {
  position: absolute;
  top: -50px;
  right: 40px;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: var(--app-soft-raised);
}
.profile-hero__dot {
  position: absolute;
  top: 26px;
  right: 150px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--app-sun);
}
.profile-hero__body {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px 20px;
  position: relative;
  z-index: 1;
  margin-top: -44px;
  padding: 0 24px 20px;
}
.profile-hero__avatar {
  border: 4px solid #fff;
  background: var(--app-primary-tint) !important;
}
.profile-avatar {
  position: relative;
  flex: none;
}
.profile-avatar__loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
}
.profile-avatar__edit {
  position: absolute;
  right: 0;
  bottom: 2px;
  border: 2px solid #fff !important;
}
.profile-hero__text {
  flex: 1 1 240px;
  min-width: 0;
  /* เริ่มข้อความใต้แถบ cover (avatar ล้นขึ้นไป 44px) */
  padding-top: 54px;
}
.profile-hero__name {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-text);
}
.profile-hero__logout {
  align-self: flex-end;
  margin-bottom: 4px;
}
@media (max-width: 600px) {
  .profile-hero__text {
    flex-basis: 100%;
    padding-top: 0;
  }
}
.profile-section__title {
  margin: 0 0 16px;
  font-size: 1.15rem;
  font-weight: 600;
}
</style>
