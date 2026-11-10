<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :loading="loading"
    :items-per-page="10"
    :footer-props="{ 'items-per-page-text': 'แถวต่อหน้า', 'items-per-page-options': [10, 25, 50, -1] }"
    item-key="_id"
    mobile-breakpoint="0"
    loading-text="กำลังโหลดข้อมูล..."
    no-data-text="ไม่พบผู้ใช้"
  >
    <template #[`item.fullName`]="{ item }">
      <div class="py-2">
        <div class="font-weight-medium">{{ item.fullName }}</div>
        <div class="text-caption grey--text text--darken-1">{{ item.email }}</div>
      </div>
    </template>

    <template #[`item.role`]="{ item }">
      {{ item.role === 'admin' ? 'ผู้ดูแลระบบ' : 'สมาชิก' }}
    </template>

    <template #[`item.approved`]="{ item }">
      <v-chip
        small
        label
        class="font-weight-medium"
        :color="item.approved ? '#E6F5EC' : '#FFF4DC'"
        :text-color="item.approved ? '#17714A' : '#8A5A00'"
      >
        {{ item.approved ? 'อนุมัติแล้ว' : 'รออนุมัติ' }}
      </v-chip>
    </template>

    <template #[`item.createdAt`]="{ item }">
      <span class="text-body-2">{{ item.createdAt | date }}</span>
    </template>

    <template #[`item.actions`]="{ item }">
      <v-btn
        v-if="!item.approved"
        small
        depressed
        color="primary"
        :loading="approvingId === item._id"
        @click="$emit('approve', item)"
      >
        อนุมัติ
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'UserTable',
  props: {
    users: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    approvingId: { type: String, default: '' },
  },
  data: () => ({
    headers: [
      { text: 'ผู้ใช้', value: 'fullName' },
      { text: 'สิทธิ์', value: 'role', width: 140 },
      { text: 'สถานะ', value: 'approved', width: 140 },
      { text: 'วันที่สมัคร', value: 'createdAt', width: 190 },
      { text: '', value: 'actions', sortable: false, align: 'end', width: 120 },
    ],
  }),
  computed: {
    rows() {
      return this.users.map((user) => ({
        ...user,
        fullName: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
      }))
    },
  },
}
</script>
