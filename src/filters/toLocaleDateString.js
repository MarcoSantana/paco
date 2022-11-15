import Vue from 'vue'

const toLocaleString = (value) =>
  new Date(value).toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

Vue.filter('intlDate', toLocaleString)

export default toLocaleString
