import Vue from 'vue'
import { DateTime } from 'luxon'

const intlDate = (value) => {
  if (!value) return ''
  return DateTime.fromJSDate(value.toDate()).toFormat('yyyy-MM-dd HH:mm:ss')
}
Vue.filter('intlDate', intlDate)

export default intlDate
