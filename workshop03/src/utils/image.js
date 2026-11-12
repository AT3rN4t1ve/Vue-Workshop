export const AVATAR_ACCEPT = 'image/png,image/jpeg,image/webp'
export const AVATAR_MAX_FILE_SIZE = 5 * 1024 * 1024

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('อ่านไฟล์รูปไม่ได้ กรุณาเลือกไฟล์รูปอื่น'))
    }
    img.src = url
  })
}

// ครอปตรงกลางให้เป็นสี่เหลี่ยมจัตุรัส แล้วย่อเหลือ size×size เป็น JPEG data URL (ราว 20–40 KB)
export async function toAvatarDataUrl(file, size = 256) {
  const img = await loadImage(file)
  const side = Math.min(img.naturalWidth, img.naturalHeight)
  const sx = (img.naturalWidth - side) / 2
  const sy = (img.naturalHeight - side) / 2

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff' // พื้นขาวแทนส่วนโปร่งใสของ PNG
  ctx.fillRect(0, 0, size, size)
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size)
  return canvas.toDataURL('image/jpeg', 0.85)
}
