
function findChoice(product, option) {
  const group = (product.optionGroups || []).find((g) => g.name === option.group)
  return group ? group.choices.find((c) => c.name === option.choice) : undefined
}

export function unitPrice(product, selected = []) {
  return selected.reduce((sum, option) => {
    const choice = findChoice(product, option)
    return sum + (choice ? choice.price : 0)
  }, product.price)
}

export function optionProblem(product, selected = []) {
  const missing = selected.find((option) => !findChoice(product, option))
  if (missing) return `ตัวเลือก "${missing.group}: ${missing.choice}" ไม่มีแล้ว`

  for (const group of product.optionGroups || []) {
    const picks = selected.filter((option) => option.group === group.name)
    if (group.isRequired && picks.length === 0) return `กรุณาเลือก "${group.name}"`
    if (!group.isMultiple && picks.length > 1) return `"${group.name}" เลือกได้เพียงอย่างเดียว`
  }
  return ''
}

export function lineKey(productId, selected = [], note = '') {
  return [productId, selected.map((option) => `${option.group}=${option.choice}`).join('&'), note.trim()].join('|')
}

export function optionsText(selected = []) {
  const groups = []
  selected.forEach((option) => {
    const found = groups.find((g) => g.name === option.group)
    if (found) found.choices.push(option.choice)
    else groups.push({ name: option.group, choices: [option.choice] })
  })
  return groups.map((g) => `${g.name}: ${g.choices.join(', ')}`).join(' · ')
}
