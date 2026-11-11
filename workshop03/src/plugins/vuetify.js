import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: '#E4572E',
        secondary: '#2B2118',
        accent: '#F2A541',
        success: '#2F8F4E',
        warning: '#D98A00',
        error: '#D64545',
        info: '#2F6FED',
      },
    },
  },
});
