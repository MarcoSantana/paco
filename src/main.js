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

// Form generator
import VueFormGenerator from 'vue-form-generator'
import fieldPdf from '@/components/forms/fieldPdf'
import 'vue-form-generator/dist/vfg.css'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

import App from './App.vue'
import router from './router'
import store from './store'
import '@/misc/register-service-worker'
import '@/misc/handle-network-status'
import '@/firebase/init'
import '@/firebase/authentication'
import '@/misc/handle-apple-install-prompt'
import 'pwacompat'

Vue.config.productionTip = false
// Vue.use(VeeValidate)

new Vue({
  router,
  store,
  components: { App },
  render: h => h(App),
}).$mount('#app')

Vue.component('validation-provider', veeValidate.ValidationProvider)
Vue.component('validation-observer', veeValidate.ValidationObserver)
veeValidate.localize('es', es)

Vue.use(VueFormGenerator)
Vue.use(VueGoogleAutocomplete)

Vue.component('field-pdf', fieldPdf)
// eslint-disable-next-line no-console
console.info(`
🍱 This app was bootstrapped with bento-starter 🍱

👉 https://bento-starter.netlify.com/

`)
