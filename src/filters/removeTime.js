import Vue from 'vue'

const removeTime = value => {
  if (!value) return ''
  return value.toLocaleString().split(' ')[0]
}

Vue.filter('removeTime', removeTime)

export default removeTime
