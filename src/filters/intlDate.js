import Vue from 'vue'
import { DateTime } from 'luxon'

const intlDate = (value) => {
  if (!value) return ''
  debugger
  console.log('intlDate', value)
  console.log(typeof value)
  return DateTime.fromJSDate(value.toDate()).toFormat('yyyy-MM-dd HH:mm:ss')
  // .setLocale('es')
  // .toLocaleString()
}
Vue.filter('intlDate', intlDate)

export default intlDate
