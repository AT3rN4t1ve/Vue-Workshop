import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

// สีชุดเดียวกับ token ใน styles/main.css — ปรับให้ตัวอักษรบนพื้นขาว/ครีมอ่านได้ชัด (WCAG AA)
export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: '#C8441F',
        secondary: '#6B5E53',
        accent: '#E9A23B',
        success: '#17663F',
        warning: '#A86B00',
        error: '#B3261E',
        info: '#1F55C7',
      },
    },
  },
});
