import avatar from '../assets/profile.jpg'
import logoManUtd from '../assets/teams/man-utd.svg'
import logoLakers from '../assets/teams/lakers.svg'
import logoPaperRex from '../assets/teams/paper-rex.svg'

export default {
  firstName: 'Atthakit',
  lastName: 'Khampraphai',
  nickname: 'Petch',
  location: 'Nakhonsawan, Thailand',
  tagline: [
    'สวัสดีครับ ผมชื่อเพชร เป็นคนที่ชอบเรียนรู้สิ่งใหม่ ๆ เปิดรับประสบการณ์และความท้าทายที่เข้ามาในชีวิต ผมเชื่อว่าทุกประสบการณ์ล้วนเป็นโอกาสในการเรียนรู้และพัฒนาตัวเองให้ดีขึ้น',
    'ผมเป็นคนที่ให้ความสำคัญกับรายละเอียด มีความตั้งใจในสิ่งที่ทำ และชอบเรียนรู้ผ่านการลงมือทำจริง ในเวลาว่างผมมักใช้เวลาไปกับการค้นหาสิ่งที่น่าสนใจ เรียนรู้เรื่องใหม่ ๆ และทำกิจกรรมที่ช่วยเติมเต็มประสบการณ์ให้กับตัวเอง',
    'สำหรับผม การเติบโตไม่ได้หมายถึงการเก่งขึ้นเพียงอย่างเดียว แต่ยังหมายถึงการได้เรียนรู้ เข้าใจตัวเอง และก้าวไปข้างหน้าในแบบที่ดีขึ้นในทุก ๆ วัน',
  ],
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
      title: 'ไม่ยอมแพ้อะไรง่ายๆ',
      desc: 'เวลาเจอปัญหา หรือ สิ่งใดที่ทำให้รู้สึกท้อ จะพยายามหาทางแก้ไขจนกว่าจะสำเร็จ',
    },
    {
      icon: '🌱',
      title: 'ปรับตัวได้ไว',
      desc: 'เจอสถานการณ์หรือสภาพแวดล้อมใหม่ๆ ก็ปรับตัวได้เร็ว และมองว่าเป็นโอกาสได้ลองอะไรใหม่',
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
