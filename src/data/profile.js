import avatar from '../assets/profile.jpg'
// โลโก้ทีม: ดาวน์โหลดจาก Wikipedia / Wikimedia Commons
import logoManUtd from '../assets/teams/man-utd.svg'
import logoLakers from '../assets/teams/lakers.svg'
import logoPaperRex from '../assets/teams/paper-rex.svg'

export default {
  firstName: 'Atthakit',
  lastName: 'Khampraphai',
  nickname: 'Petch',
  role: 'Frontend / Backend / Full Stack Developer',
  location: 'Nakhonsawan, Thailand',
  tagline:
    '',
  avatar,

  education: [
    {
      level: 'ปริญญาตรี',
      school: 'University of Phayao',
      major: 'Bachelor of Science (Computer Science)',
      year: '2022 – 2026',
    },
    {
      level: 'มัธยมปลาย',
      school: 'Photisansuksa School',
      major: 'High School (Science-Mathematics)',
      year: '2019 – 2021',
    },
  ],

  hobbies: [
    { icon: '🎮', label: 'เล่นเกม' },
    { icon: '🎧', label: 'ฟังเพลง' },
    { icon: '📸', label: 'ถ่ายรูป' },
    { icon: '🎬', label: 'ดูซีรีส์' },
  ],

  likes: ['สุนัข', 'เล่นบาสเก็ตบอล', 'ว่ายน้ำ', 'ดูซีรีส์', 'ฟังเพลง', 'เล่นเกม', 'ถ่ายรูป', 'เที่ยวต่างจังหวัด'],
  dislikes: ['รถติด', 'ฝนตกตอนขับรถ', 'อาหารรสชาติแปลก', 'สถานที่คนเยอะๆ'],

  strengths: [
    {
      icon: '⚙️',
      title: 'Backend ที่แข็งแรง',
      desc: 'ทำ REST API ด้วย Node.js / Express และ Java Spring Boot พร้อม Prisma, MySQL, PostgreSQL และ JWT auth',
    },
    {
      icon: '🔍',
      title: 'Search & Data',
      desc: 'ทำระบบค้นหาด้วย Elasticsearch ตอบกลับไม่ถึง 1 วินาที และทำ Dashboard ด้วย Kibana',
    },
    {
      icon: '📱',
      title: 'Full Stack ข้ามแพลตฟอร์ม',
      desc: 'ทำได้ทั้งเว็บ (Angular, React) และแอปมือถือ (Flutter) รวมถึงเชื่อม OCR อ่านใบสั่งยา',
    },
  ],

  favoriteTeams: [
    // logo: รูปโลโก้ทีม (ถ้าไม่ใส่จะแสดง emoji แทน)
    { sport: 'ฟุตบอล', team: 'Manchester United', emoji: '⚽', logo: logoManUtd },
    { sport: 'บาสเกตบอล', team: 'Los Angeles Lakers', emoji: '🏀', logo: logoLakers },
    { sport: 'E-sport', team: 'PaperRex', emoji: '🎮', logo: logoPaperRex },
  ],

  contacts: [
    { label: 'GitHub', url: 'https://github.com/AT3rN4t1ve' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/atthakit-khampraphai/' },
    { label: 'Email', url: 'mailto:kh.callphet@gmail.com' },
  ],
}
