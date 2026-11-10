<template>
  <div>
    <PageHeader title="ผู้ใช้" subtitle="อนุมัติสมาชิกใหม่ให้เข้าสู่ระบบได้">
      <v-btn-toggle v-model="pendingOnly" mandatory dense color="primary">
        <v-btn :value="true">รออนุมัติ ({{ pendingCount }})</v-btn>
        <v-btn :value="false">ทั้งหมด</v-btn>
      </v-btn-toggle>
    </PageHeader>

    <v-alert v-if="error" type="error" text class="mb-4">{{ error }}</v-alert>

    <v-card class="surface-card">
      <EmptyState
        v-if="!loading && visibleUsers.length === 0"
        icon="mdi-account-check-outline"
        title="ไม่มีสมาชิกที่รออนุมัติ"
        text="สมาชิกใหม่ที่สมัครเข้ามาจะแสดงที่นี่"
      />
      <UserTable v-else :users="visibleUsers" :loading="loading" :approving-id="approvingId" @approve="approve" />
    </v-card>
  </div>
</template>

<script>
import authService from '../../services/authService'
import PageHeader from '../../components/common/PageHeader.vue'
import EmptyState from '../../components/common/EmptyState.vue'
import UserTable from '../../components/admin/UserTable.vue'

// หน้าผู้ใช้ (เฉพาะ admin): ดูรายชื่อและอนุมัติสมาชิกใหม่
export default {
  name: 'ManageUsersView',
  components: { PageHeader, EmptyState, UserTable },
  data: () => ({
    users: [],
    loading: true,
    error: '',
    pendingOnly: true,
    approvingId: '',
  }),
  computed: {
    pendingCount() {
      return this.users.filter((user) => !user.approved).length
    },
    visibleUsers() {
      return this.pendingOnly ? this.users.filter((user) => !user.approved) : this.users
    },
  },
  created() {
    this.load()
  },
  methods: {
    async load() {
      this.loading = true
      this.error = ''
      try {
        this.users = await authService.getUsers()
      } catch (e) {
        this.error = e.message || 'โหลดรายชื่อผู้ใช้ไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },
    async approve(user) {
      this.approvingId = user._id
      try {
        await authService.approveUser(user._id)
        this.$store.dispatch('ui/notify', `อนุมัติ ${user.email} แล้ว`)
        this.users = await authService.getUsers()
      } catch (e) {
        this.$store.dispatch('ui/notify', { text: e.message || 'อนุมัติไม่สำเร็จ', color: 'error' })
      } finally {
        this.approvingId = ''
      }
    },
  },
}
</script>
