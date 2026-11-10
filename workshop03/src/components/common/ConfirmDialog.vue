<template>
  <v-dialog :value="value" max-width="420" :persistent="loading" @input="$emit('input', $event)">
    <v-card class="pa-2">
      <v-card-title class="text-h6 font-weight-medium">{{ title }}</v-card-title>
      <v-card-text class="text-body-1">
        <slot>{{ message }}</slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text :disabled="loading" @click="$emit('input', false)">ยกเลิก</v-btn>
        <v-btn :color="color" depressed :loading="loading" @click="$emit('confirm')">{{ confirmText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// กล่องยืนยันก่อนทำรายการสำคัญ ใช้กับ v-model และรับ event @confirm
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
