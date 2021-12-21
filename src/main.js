//  _______ _______
//  |  |  | |______
//  |  |  | ______|
// author: mSantana
// createdAt 2020-05-16 12:30
// Stardate: 202005.16
// fileName: src/main.js

// eslint-disable-next-line import/no-extraneous-dependencies
import '@mdi/font/css/materialdesignicons.css'

import Vue from 'vue'

// Validation
import es from 'vee-validate/dist/locale/es'
import '@/misc/validation'
import * as veeValidate from 'vee-validate'

// Translation
import VueI18n from 'vue-i18n'

// Form generator
import VueFormGenerator from 'vue-form-generator'
import fieldPdf from '@/components/forms/fieldPdf'
import fieldUniversity from '@/components/forms/fieldUniversity'
import fieldHospital from '@/components/forms/fieldHospital'
import fieldDate from '@/components/forms/fieldDate'
import fieldPerdiod from '@/components/forms/fieldPeriod'
import 'vue-form-generator/dist/vfg.css'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
// Async computed
import AsyncComputed from 'vue-async-computed'
// Modal
import VModal from 'vue-js-modal'

import myEs from '@/locales/es'

import App from './App.vue'
import router from './router'
import store from './store'
import '@/misc/register-service-worker'
import '@/misc/handle-network-status'
import '@/firebase/init'
import '@/firebase/authentication'
import '@/firebase/functions'
import '@/misc/handle-apple-install-prompt'
import 'pwacompat'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false
// Vue.use(VeeValidate)
// Ready translated locale messages
const messages = {
  es: {
    ...myEs,
  },
  en: {
    message: {
      hello: 'hello world',
    },
    module,
  },
}
const i18n = new VueI18n({
  locale: 'es', // set locale
  messages,
})
new Vue({
  router,
  store,
  components: { App },
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')

Vue.component('validation-provider', veeValidate.ValidationProvider)
Vue.component('validation-observer', veeValidate.ValidationObserver)
veeValidate.localize('es', es)

Vue.use(VueFormGenerator)
Vue.use(VueGoogleAutocomplete)
Vue.use(VueI18n)
Vue.use(AsyncComputed)
Vue.use(VModal)

Vue.component('field-pdf', fieldPdf)
Vue.component('field-university', fieldUniversity)
Vue.component('field-hospital', fieldHospital)
Vue.component('field-date', fieldDate)
Vue.component('field-period', fieldPerdiod)
// eslint-disable-next-line no-console
console.info(`
🍱 This app was bootstrapped with bento-starter 🍱

👉 https://bento-starter.netlify.com/

`)
