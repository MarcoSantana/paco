import Vue from 'vue'

const phone = value => {
  if (!value) return ''
  const string = value.toString()
  return `${string.slice(0, 1)} - ${string.slice(2, string.length - 1)}`
}

Vue.filter('phone', phone)

export default phone
