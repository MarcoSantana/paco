<template>
  <div class="page-wrapper">
    <img alt="logo-bento" class="logo" src="@/assets/img/logo_cmmu.png" />
    <h1 class="home-page-title">{{ appTitle }}</h1>
    <h2 class="home-page-title">{{ clientName }}</h2>

    <!-- <div v-if="isAdmin" class="box"> -->
    <div v-if="isUserLoggedIn">
      Is Admin? :: {{ isUserAdmin }}
      <div v-if="isUserAdmin" class="box">
        <form>
          <input id="admin-email" ref="adminEmail" type="email" required />
          <button @click.prevent="addRole">Make admin</button>
        </form>
      </div>
    </div>

    <!-- <a rel="noopener" class="documentation-link" target="_blank" href="https://bento-starter.netlify.com/"
      >Documentation →</a
    > -->
  </div>
</template>

<script>
import { functions } from 'firebase'
import { mapGetters, mapState } from 'vuex'
import callAddAdminRole from '@/firebase/functions'

export default {
  head() {
    return {
      title: {
        inner: 'Home',
      },
      meta: [
        {
          name: 'description',
          content: `${this.appTitle} home page`,
          id: 'desc',
        },
      ],
    }
  },
  computed: {
    ...mapState('app', ['appTitle', 'clientName']),
    ...mapState('authentication', ['user']),
    ...mapGetters('authentication', ['isUserLoggedIn', 'isUserAdmin']),
  },
  methods: {
    addRole() {
      console.log('Click')
      const ref = this.$refs.adminEmail
      console.log('ref.value :>> ', ref.value)
      console.log('functions :>> ', functions)
      const foo = callAddAdminRole(ref.value)
      console.log('foo :>> ', foo)
      // const adminRole = functions.httpsCallable('addAdminRole')
      // adminRole({ email: ref.value })
      //   .then(result => {
      //     console.log('result', result)
      //   })
      //   .catch(err => {
      //     console.error(err)
      //   })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.page-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .logo {
    margin-bottom: 3rem;
  }

  .home-page-title {
    text-align: center;
    color: $main;
  }

  .documentation-link {
    display: inline-block;
    font-size: 1.2rem;
    color: #fff;
    background-color: #5d6788;
    padding: 0.8rem 1.6rem;
    border-radius: 4px;
    transition: background-color 0.1s ease;
    box-sizing: border-box;
    text-decoration: none;
    width: fit-content;
    font-weight: 500;
  }
}
</style>
