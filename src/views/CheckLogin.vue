<template>
  <h1 class="loading-title">Cargando...</h1>
</template>

<script>
import { mapState } from 'vuex'
import { isNil } from 'lodash'

export default {
  computed: mapState('authentication', ['user', 'userClaims']),
  watch: {
    user: {
      handler(user) {
        if (user === undefined) return

        if (isNil(user.emailConfirmed)) {
          this.$router.push('/verifyEmail')
        }

        if (this.$route.query.redirectUrl === this.$route.path) {
          this.$router.push('/')
        }

        if (user.incomplete) this.$router.push('/userEdit')

        const redirectUrl = isNil(user)
          ? `/login?redirectUrl=${this.$route.query.redirectUrl}`
          : this.$route.query.redirectUrl

        this.$router.push(redirectUrl)
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.loading-title {
  text-align: center;
}
</style>
