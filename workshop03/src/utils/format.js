
export function formatPrice(value) {
  const amount = Number(value) || 0
  return '฿' + amount.toLocaleString('th-TH', { maximumFractionDigits: 2 })
}

export function formatNumber(value) {
  return (Number(value) || 0).toLocaleString('th-TH')
}

export function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
