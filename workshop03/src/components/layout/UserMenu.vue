<template>
  <v-menu offset-y left min-width="230">
    <template #activator="{ on, attrs }">
      <v-btn icon aria-label="เมนูผู้ใช้" v-bind="attrs" v-on="on">
        <v-avatar color="#FFF1E8" size="36">
          <span class="user-menu__initial">{{ initial }}</span>
        </v-avatar>
      </v-btn>
    </template>

    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="font-weight-medium">{{ displayName }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ user.email }} · {{ isAdmin ? 'ผู้ดูแลระบบ' : 'สมาชิก' }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="my-1" />

      <div class="d-md-none">
        <v-list-item v-for="item in menu" :key="item.to" :to="item.to" :exact="item.exact" color="primary">
          <v-list-item-icon class="mr-3">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>
        <v-divider class="my-1" />
      </div>

      <v-list-item :to="{ name: 'profile' }" color="primary">
        <v-list-item-icon class="mr-3">
          <v-icon>mdi-account-edit-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>โปรไฟล์ของฉัน</v-list-item-title>
      </v-list-item>

      <v-list-item @click="logout">
        <v-list-item-icon class="mr-3">
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-title>ออกจากระบบ</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'UserMenu',
  props: {
    menu: { type: Array, default: () => [] },
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['displayName', 'isAdmin']),
    initial() {
      return this.displayName.charAt(0).toUpperCase()
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push({ name: 'login' })
    },
  },
}
</script>

<style scoped>
.user-menu__initial {
  font-weight: 600;
  color: #e4572e;
}
</style>
