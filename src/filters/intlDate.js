import Vue from 'vue'
import {DateTime} from 'luxon'

const intlDate = value => {
  if(!value) return ''
  return DateTime.fromJSDate(value).setLocale('es').toLocaleString()
}
Vue.filter('intlDate', intlDate)

export default intlDate