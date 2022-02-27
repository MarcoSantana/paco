import Vue from 'vue'

const capitalize = value => {
  if (!value) return ''
  return value
    .split(' ')
    .map(word => {
      return (
        word
          .toLocaleLowerCase()
          .charAt(0)
          .toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
      )
    })
    .join(' ')
}

Vue.filter('capitalize', capitalize)

export default capitalize
