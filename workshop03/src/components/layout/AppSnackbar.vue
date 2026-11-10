<template>
  <v-snackbar v-model="visible" :color="snackbar.color" :timeout="2800" bottom>
    {{ snackbar.text }}
    <template #action="{ attrs }">
      <v-btn icon small v-bind="attrs" aria-label="ปิด" @click="visible = false">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
// แสดงข้อความแจ้งเตือนจาก store (เรียกด้วย this.$store.dispatch('ui/notify', ...))
export default {
  name: 'AppSnackbar',
  computed: {
    snackbar() {
      return this.$store.state.ui.snackbar
    },
    visible: {
      get() {
        return this.snackbar.show
      },
      set(value) {
        if (!value) this.$store.commit('ui/HIDE_SNACKBAR')
      },
    },
  },
}
</script>
