<template>
  <v-text-field
    :value="value"
    :label="label"
    :rules="rules"
    :type="visible ? 'text' : 'password'"
    :append-icon="visible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
    :autocomplete="autocomplete"
    prepend-inner-icon="mdi-lock-outline"
    outlined
    dense
    @input="$emit('input', $event)"
    @click:append="visible = !visible"
  />
</template>

<script>
export default {
  name: 'PasswordField',
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: 'รหัสผ่าน' },
    rules: { type: Array, default: () => [] },
    autocomplete: { type: String, default: 'current-password' },
  },
  data: () => ({
    visible: false,
  }),
}
</script>
