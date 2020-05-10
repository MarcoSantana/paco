<template>
  <div class="page-wrapper" background-color="primary">
    <!-- Loader -->
    <div v-show="user === undefined" data-test="loader">Authenticating...</div>

    <!-- Offline instruction -->
    <div v-show="!networkOnLine" data-test="offline-instruction">
      Please check your connection, login feature is not available offline.
    </div>

    <p v-if="loginError">{{ loginError }}</p>
    <p v-if="apiError">{{ apiError }}</p>
    <!-- Auth UI -->
    <div
      v-show="user !== undefined && !user && networkOnLine"
      class="signup-form-container"
      id="signup-form-container"
      data-test="signup-form-container"
    >
      <div id="login-box">
        <div class="left">
          <h1>Registrarse</h1>

          <input type="text" name="email" placeholder="E-mail" id="registration-email" data-test="registration-email" />
          <input
            type="text"
            name="email"
            placeholder="Confirme su e-mail"
            id="registration-email-confirmation"
            data-test="registration-email-confirmation"
          />
          <input
            type="text"
            name="name"
            placeholder="Nombres (ej. Juan Carlos)"
            id="registration-name"
            data-test="registration-name"
          />
          <input
            type="text"
            name="registration-lastname"
            placeholder="Apellido Paterno (ej. González)"
            id="registration-lastname-1"
            data-test="registration-lastname-1"
          />
          <input type="password" name="password" placeholder="Contraseña" />
          <input type="password" name="password2" placeholder="Confirme su contraseña" />

          <input
            type="text"
            name="license"
            placeholder="Cédula profesional de licenciatura en medicina"
            id="registration-license"
            disabled="disabled"
          />

          <input type="submit" name="signup_submit" value="Sign me up" />
        </div>

        <div class="right">
          <span class="loginwith">Registrarse con <br />redes sociales</span>

          <button class="social-signin facebook">Log in with facebook</button>
          <button class="social-signin twitter">Log in with Twitter</button>
          <button class="social-signin google">Log in with Google+</button>
        </div>
        <div class="or">O</div>
      </div>
    </div>
    <!-- signup-form-container -->
  </div>
  <!-- page wrapper -->
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { isNil } from 'lodash'
import firebase from 'firebase/app'
import { desktop as isDekstop } from 'is_js'

export default {
  data: () => ({ loginError: null, apiError: null }),
  head() {
    return {
      title: {
        inner: 'Login',
      },
      meta: [
        {
          name: 'description',
          content: `Sign in or sign up to ${this.appTitle}`,
          id: 'desc',
        },
      ],
    }
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine', 'appTitle']),
  },
  watch: {
    user: {
      handler(user) {
        if (!isNil(user)) {
          const redirectUrl = isNil(this.$route.query.redirectUrl) ? '/documents' : this.$route.query.redirectUrl
          this.$router.push(redirectUrl)
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.documentAPI()
  },
  methods: {
    ...mapMutations('authentication', ['setUser']),
    async login() {
      this.loginError = null
      const provider = new firebase.auth.GoogleAuthProvider()
      this.setUser(undefined)

      try {
        // Firebase signin with popup is faster than redirect
        // but we can't use it on mobile because it's not well supported
        // when app is running as standalone on ios & android
        // eslint-disable-next-line no-unused-expressions
        isDekstop()
          ? await firebase.auth().signInWithPopup(provider)
          : await firebase.auth().signInWithRedirect(provider)
      } catch (err) {
        this.loginError = err
        this.setUser(null)
      }
    }, // login
    async documentAPI() {
      fetch(
        `https://cors-anywhere.herokuapp.com/http://search.sep.gob.mx/solr/cedulasCore/select?fl=%2A%2Cscore&q=danelia+gonzalez+camnpuzano&start=0&rows=10&facet=true&indent=on&wt=json`
      )
        .then(function(response) {
          return response.json()
        })
        .then(function(myJson) {
          console.log('docs', myJson.response.docs)
        })
        .catch(error => {
          console.log(error)
          this.apiError = error
        })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

*:focus {
  outline: none;
}

body {
  margin: 0;
  padding: 0;
  background: #ddd;
  font-size: 16px;
  font-weight: 300;
}

#signup-form-container {
  box-sizing: border-box;
}

#login-box {
  position: relative;
  box-sizing: border-box;
  margin: 5% 100px 5% 100px;
  width: 600px;
  height: 800px;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.left {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  padding: 40px;
  width: 300px;
  // height: 400px;
  height: auto;
}

h1 {
  margin: 0 0 20px 0;
  font-weight: 300;
  font-size: 28px;
}

input[type='text'],
input[type='password'] {
  display: block;
  box-sizing: border-box;
  margin-bottom: 20px;
  padding: 4px;
  width: 220px;
  height: 32px;
  border: none;
  border-bottom: 1px solid #aaa;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 15px;
  transition: 0.2s ease;
}

input[type='text']:focus,
input[type='password']:focus {
  border-bottom: 2px solid #16a085; //Cahnge me
  color: #16a085;
  transition: 0.2s ease;
}

input[type='submit'] {
  margin-top: 28px;
  width: 120px;
  height: 32px;
  background: #16a085;
  border: none;
  border-radius: 2px;
  color: #fff;
  font-family: 'Roboto', sans-serif; // Change me
  font-weight: 500;
  text-transform: uppercase;
  transition: 0.1s ease;
  cursor: pointer;
}

input[type='submit']:hover,
input[type='submit']:focus {
  opacity: 0.8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  transition: 0.1s ease;
}

input[type='submit']:active {
  opacity: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  transition: 0.1s ease;
}

.or {
  position: absolute;
  top: 180px;
  left: 280px;
  width: 40px;
  height: 40px;
  background: $navbar-color;
  color: $light-accent;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  line-height: 40px;
  text-align: center;
}

.right {
  position: absolute;
  top: 0;
  right: 0;
  box-sizing: border-box;
  padding: 40px;
  width: 300px;
  height: 400px;
  // background: url('https://picsum.photos/200/300');
  background: url('https://images.unsplash.com/photo-1535930749574-1399327ce78f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=676&q=80');
  background-size: cover;
  background-position: center;
  border-radius: 0 2px 2px 0;
}

.right .loginwith {
  display: block;
  margin-bottom: 40px;
  font-size: 28px;
  color: $light-accent;
  text-shadow: 2px 2px $navbar-color;
  text-align: center;
}

button.social-signin {
  margin-bottom: 20px;
  width: 220px;
  height: 36px;
  border: none;
  border-radius: 2px;
  color: #fff;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  transition: 0.2s ease;
  cursor: pointer;
}

button.social-signin:hover,
button.social-signin:focus {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  transition: 0.2s ease;
}

button.social-signin:active {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  transition: 0.2s ease;
}

button.social-signin.facebook {
  background: #32508e;
}

button.social-signin.twitter {
  background: #55acee;
}

button.social-signin.google {
  background: #dd4b39;
}
</style>
