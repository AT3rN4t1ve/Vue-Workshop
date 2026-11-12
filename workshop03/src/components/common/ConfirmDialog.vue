<template>
  <v-dialog :value="value" max-width="440" :persistent="loading" content-class="confirm-dialog" @input="$emit('input', $event)">
    <v-card class="confirm-dialog__card">
      <div class="confirm-dialog__title">{{ title }}</div>
      <div class="confirm-dialog__body">
        <slot>{{ message }}</slot>
      </div>
      <div class="confirm-dialog__actions">
        <v-btn outlined rounded large :disabled="loading" class="confirm-dialog__cancel" @click="$emit('input', false)">
          ยกเลิก
        </v-btn>
        <v-btn :color="color" depressed rounded large :loading="loading" @click="$emit('confirm')">{{ confirmText }}</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    value: { type: Boolean, default: false },
    title: { type: String, default: 'ยืนยันการทำรายการ' },
    message: { type: String, default: '' },
    confirmText: { type: String, default: 'ยืนยัน' },
    color: { type: String, default: 'primary' },
    loading: { type: Boolean, default: false },
  },
}
</script>

<style scoped>
.confirm-dialog__card {
  padding: 24px;
  border-radius: var(--radius-lg) !important;
}
.confirm-dialog__title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--app-text);
}
.confirm-dialog__body {
  margin-top: 8px;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--app-text-muted);
}
.confirm-dialog__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}
.confirm-dialog__cancel {
  border-color: var(--app-border-strong) !important;
  color: var(--app-text) !important;
}
</style>
