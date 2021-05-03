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
import { ValidationObserver, ValidationProvider, localize} from 'vee-validate'

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
  render: h => h(App),
}).$mount('#app')

Vue.component('validation-provider', ValidationProvider)
Vue.component('validation-observer', ValidationObserver)
localize('es', es)

// eslint-disable-next-line no-console
console.info(`
🍱 This app was bootstrapped with bento-starter 🍱

👉 https://bento-starter.netlify.com/

`)
