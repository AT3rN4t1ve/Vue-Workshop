<template>
  <v-snackbar
    v-model="visible"
    :timeout="2800"
    bottom
    color="white"
    light
    content-class="app-snackbar__content"
    :class="['app-snackbar', { 'app-snackbar--error': isError }]"
  >
    <span class="app-snackbar__icon" :class="`app-snackbar__icon--${tone}`" aria-hidden="true">
      <v-icon x-small color="white">{{ icon }}</v-icon>
    </span>
    {{ snackbar.text }}
    <template #action="{ attrs }">
      <v-btn icon small v-bind="attrs" aria-label="ปิด" @click="visible = false">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
const ICONS = { success: 'mdi-check', error: 'mdi-exclamation', warning: 'mdi-exclamation', info: 'mdi-information-variant' }

export default {
  name: 'AppSnackbar',
  computed: {
    snackbar() {
      return this.$store.state.ui.snackbar
    },
    tone() {
      return ICONS[this.snackbar.color] ? this.snackbar.color : 'success'
    },
    isError() {
      return this.tone === 'error'
    },
    icon() {
      return ICONS[this.tone]
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

<style scoped>
.app-snackbar >>> .v-snack__wrapper {
  border-radius: 14px;
  box-shadow: var(--shadow-md);
}
.app-snackbar >>> .v-snack__wrapper {
  border: 1.5px solid var(--app-border);
  color: var(--app-text);
}
.app-snackbar--error >>> .v-snack__wrapper {
  border-color: #f3c2be;
}
.app-snackbar >>> .app-snackbar__content {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
}
.app-snackbar__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
.app-snackbar__icon--success {
  background: #17663f;
}
.app-snackbar__icon--error {
  background: #b3261e;
}
.app-snackbar__icon--warning {
  background: #a86b00;
}
.app-snackbar__icon--info {
  background: #1f55c7;
}
</style>
