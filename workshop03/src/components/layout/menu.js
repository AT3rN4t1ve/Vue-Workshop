// เมนูหลักใช้ร่วมกันระหว่าง header (desktop), UserMenu และ bottom nav (mobile)
export function mainMenu(isAdmin) {
  const shop = { label: 'เมนูอาหาร', short: 'เมนู', to: '/', icon: 'mdi-silverware-fork-knife', exact: true }
  if (!isAdmin) {
    return [shop, { label: 'ออเดอร์ของฉัน', short: 'ออเดอร์', to: '/orders', icon: 'mdi-clipboard-text-outline' }]
  }
  return [
    shop,
    { label: 'จัดการเมนู', short: 'จัดการ', to: '/admin/products', icon: 'mdi-notebook-edit-outline' },
    { label: 'ออเดอร์', short: 'ออเดอร์', to: '/orders', icon: 'mdi-clipboard-text-outline' },
    { label: 'ผู้ใช้', short: 'ผู้ใช้', to: '/admin/users', icon: 'mdi-account-multiple-outline' },
  ]
}
