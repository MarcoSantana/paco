import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import VueI18n from 'vue-i18n'
// import es from 'vuetify/lib/locale/es'
import es from '@/locales/es'
import en from 'vuetify/lib/locale/en'

Vue.use(Vuetify)
Vue.use(VueI18n)

// FIXME vuetify translation not working 202112.27-09.24
export default new Vuetify({
  lang: {
    lolcales: { es, en },
    current: 'es',
  },
  theme: {
    themes: {
      light: {
        primary: '#0c466d',
        secondary: '#2596c7',
        editable: '#c88719',
      },
    },
  },
})
