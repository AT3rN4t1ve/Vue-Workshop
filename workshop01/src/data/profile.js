import avatar from '../assets/profile.jpg'
import logoManUtd from '../assets/teams/man-utd.svg'
import logoLakers from '../assets/teams/lakers.svg'
import logoPaperRex from '../assets/teams/paper-rex.svg'

export default {
  firstName: 'Atthakit',
  lastName: 'Khampraphai',
  nickname: 'Petch',
  roles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
  location: 'Nakhonsawan, Thailand',
  tagline:
    'Developer ที่สนุกกับการเปลี่ยนไอเดียให้กลายเป็นแอปที่ใช้งานได้จริง ส่วนเวลาว่างมักจะอยู่กับเกม ซีรีส์',
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
      icon: '🧩',
      title: 'ชอบแก้ปัญหา',
      desc: 'เจอบั๊กแล้วไม่ยอมแพ้ ต้องหาต้นเหตุให้เจอก่อนถึงจะสบายใจ',
    },
    {
      icon: '🎨',
      title: 'ชอบของสวยและใช้ง่าย',
      desc: 'ใส่ใจรายละเอียดเล็กๆ ให้คนใช้รู้สึกสบายตาและไม่งง',
    },
    {
      icon: '📚',
      title: 'เรียนรู้เร็ว',
      desc: 'ชอบลองของใหม่ และเรียนรู้จากการลงมือทำจริงมากกว่าอ่านอย่างเดียว',
    },
  ],

  favoriteTeams: [
    { sport: 'ฟุตบอล', team: 'Manchester United', emoji: '⚽', logo: logoManUtd },
    { sport: 'บาสเกตบอล', team: 'Los Angeles Lakers', emoji: '🏀', logo: logoLakers },
    { sport: 'E-sport', team: 'PaperRex', emoji: '🎮', logo: logoPaperRex },
  ],
}
