// แก้ข้อมูลทั้งหมดที่ไฟล์นี้ไฟล์เดียว — component จะดึงไปแสดงเอง
export default {
  firstName: 'ชื่อจริง',
  lastName: 'นามสกุล',
  nickname: 'เพชร',
  role: 'Frontend Developer',
  tagline: 'ชอบสร้างของที่ใช้ง่าย หน้าตาดี และเรียนรู้อะไรใหม่ๆ ทุกวัน',
  avatar: '', // ใส่ URL รูปได้ ถ้าว่างจะแสดงตัวอักษรย่อแทน

  education: {
    university: 'มหาวิทยาลัย ABC',
    faculty: 'คณะวิทยาศาสตร์',
    major: 'สาขาวิทยาการคอมพิวเตอร์',
    year: '2020 – 2024',
  },

  hobbies: [
    { icon: '🎮', label: 'เล่นเกม' },
    { icon: '🎧', label: 'ฟังเพลง' },
    { icon: '📸', label: 'ถ่ายรูป' },
    { icon: '☕', label: 'ตระเวนคาเฟ่' },
    { icon: '🏃', label: 'วิ่ง' },
  ],

  likes: ['กาแฟเย็น', 'อากาศเย็นๆ', 'แมว', 'ดีไซน์มินิมอล', 'Dark mode'],
  dislikes: ['รถติด', 'ฝนตกตอนไม่พกร่ม', 'ผักชี', 'ประชุมยาวๆ'],

  strengths: [
    { icon: '⚡', title: 'เรียนรู้ไว', desc: 'จับเทคโนโลยีใหม่ได้เร็ว ลองทำจริงก่อนเสมอ' },
    { icon: '🤝', title: 'ทำงานเป็นทีม', desc: 'สื่อสารชัด รับฟังและช่วยเหลือคนในทีม' },
    { icon: '🎯', title: 'ใส่ใจรายละเอียด', desc: 'เก็บงานเนี้ยบ ตั้งแต่ UI ไปจนถึงโค้ด' },
  ],

  freeDesign: {
    title: 'Free Design',
    desc: 'ชอบออกแบบ UI ด้วยตัวเอง ทั้ง wireframe ใน Figma และลงมือทำจริงด้วยโค้ด',
    tools: ['Figma', 'Canva', 'Tailwind', 'Vue'],
  },

  favoriteTeams: [
    { sport: 'ฟุตบอล', team: 'Team A', emoji: '⚽' },
    { sport: 'บาสเกตบอล', team: 'Team B', emoji: '🏀' },
  ],

  contacts: [
    { label: 'GitHub', url: 'https://github.com/' },
    { label: 'Email', url: 'mailto:you@example.com' },
  ],
}
