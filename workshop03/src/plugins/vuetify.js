import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#E4572E',
        secondary: '#1F2937',
        accent: '#F2A541',
        success: '#1E8E5A',
        warning: '#D98A00',
        error: '#D64545',
        info: '#2F6FED',
      },
    },
  },
});
