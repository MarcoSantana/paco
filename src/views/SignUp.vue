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
      id="signup-form-container"
      class="signup-form-container"
      data-test="signup-form-container"
    >
      <div id="login-box">
        <div class="left">
          <h1>Registrarse</h1>
          <label for="license" class="tip">License tip</label>
          <div class="input-container">
            <i class="mdi mdi-badge-account icon"></i>
            <input
              id="registration-license"
              v-model="license"
              data-test="registration-license"
              type="text"
              name="license"
              placeholder="Cédula profesional de licenciatura en medicina"
              @input="documentAPI"
            />
          </div>
          <label for="email" class="tip">Email tip:</label>
          <div class="input-container">
            <i class="mdi mdi-email icon"></i>
            <input
              type="text"
              id="registration-email"
              v-model="email"
              name="email"
              placeholder="E-mail"
              data-test="registration-email"
            />
          </div>
          <label for="email-confirmation" class="tip">Email:</label>
          <div class="input-container">
            <i class="mdi mdi-email icon"></i>
            <input
              type="text"
              id="registration-email-confirmation"
              v-model="emailConfirmation"
              name="email-confirmation"
              placeholder="Confirme su e-mail"
              data-test="registration-email-confirmation"
            />
          </div>
          <label for="name" class="tip">Nombre:</label>
          <div class="input-container">
            <i class="mdi mdi-face icon"></i>
            <input
              id="registration-name"
              type="text"
              name="name"
              placeholder="Nombres (ej. Juan Carlos)"
              data-test="registration-name"
              :value="registrationName"
            />
          </div>
          <label for="registration-lastname" class="tip">Apellido:</label>
          <div class="input-container">
            <i class="mdi mdi-form-textbox icon"></i>
            <input
              id="registration-lastname-1"
              type="text"
              name="registrationLastname"
              placeholder="Apellido Paterno (ej. González)"
              data-test="registration-lastname-1"
              :value="registrationLastname1"
            />
          </div>
          <label for="registration-lastname-2" class="tip">Apellido Materno:</label>
          <div class="input-container">
            <i class="mdi mdi-form-textbox icon"></i>
            <input
              id="registration-lastname-2"
              type="text"
              name="registrationLastname"
              placeholder="Apellido Materno (ej. Silveti)"
              data-test="registration-lastname-2"
              :value="registrationLastname2"
            />
          </div>

          <label v-if="gender" for="gender" class="tip">Sexo</label>
          <div v-if="gender" class="input-container">
            <i v-show="gender == 1" class="mdi mdi-gender-male icon"></i>
            <i v-show="gender == 2" class="mdi mdi-gender-female icon"></i>
            <p>{{ gender | genderize }}</p>
          </div>
          <label for="password" class="tip">Contraseña</label>
          <div class="input-container">
            <i class="mdi mdi-form-textbox-password icon"></i>
            <input type="password" name="password" placeholder="Contraseña" />
          </div>
          <label for="password-2" class="tip">Contraseña</label>
          <div class="input-container">
            <i class="mdi mdi-form-textbox-password icon"></i>
            <input type="password" name="password-2" placeholder="Confirme su contraseña" />
          </div>

          <p>Loading: {{ loading }}</p>
          <p>License {{ license | zeroPad }}</p>
          <p>Name {{ registrationName }}</p>

          <input type="submit" name="signup_submit" value="Sign me up" @click="documentAPI" />
        </div>
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
  filters: {
    zeroPad: value => {
      return value.toString().padStart(8, '0')
    },
    genderize: value => {
      let gender = null
      if (!isNil(value)) {
        if (value.toString() === '1') {
          gender = 'Hombre'
        }
        if (value.toString() === '2') {
          gender = 'Mujer'
        }
        return gender
      }
      return value
    },
  },
  data: () => ({
    loginError: null,
    apiError: null,
    registrationName: null,
    registrationLastname1: null,
    registrationLastname2: null,
    license: '',
    email: null,
    emailConfirmation: null,

    // license: 4273560,
    gender: null,
  }),
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
    ...mapState('app', ['networkOnLine', 'appTitle', 'loading']),
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
    // this.documentAPI()
  },
  methods: {
    ...mapMutations('authentication', ['setUser']),
    ...mapMutations('app', ['setLoading', 'unsetLoading']),
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
      this.apiError = null
      clearTimeout(this.debounce)
      if (this.license.toString().length >= 6) {
        this.debounce = setTimeout(async () => {
          const sepAPI = `http://search.sep.gob.mx/solr/cedulasCore/select?fl=%2A%2Cscore&q=${this.license}&start=0&rows=10&facet=true&indent=on&wt=json`
          this.setLoading()
          await fetch(`https://cors-anywhere.herokuapp.com/${sepAPI}`)
            .then(response => {
              console.log(
                'rest',
                `https://cors-anywhere.herokuapp.com/http://search.sep.gob.mx/solr/cedulasCore/select?fl=%2A%2Cscore&q=${this.license}&start=0&rows=10&facet=true&indent=on&wt=json`
              )

              return response.json()
            })
            .then(myJson => {
              const data = myJson.response.docs[0]
              console.log('result data', data)
              console.log('Paterno', data.paterno)

              this.registrationLastname1 = data.paterno
              this.registrationLastname2 = data.materno
              this.registrationName = data.nombre
              console.log(this.license)
              this.gender = data.genero
            })
            .catch(error => {
              console.log(error)
              this.apiError = error
            })
            .finally(() => {
              this.unsetLoading()
            })
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
* {
  margin: 0%;
  padding: 0%;
}

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
  width: 100%;
  height: 100%;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.left {
  top: 0;
  left: 0;
  box-sizing: border-box;
  padding: 40px;
  width: 100%;
  // height: 400px;
  height: auto;
}

h1 {
  margin: 0 0 20px 0;
  font-weight: 300;
  font-size: 28px;
}
/* Style the input container */
.input-container {
  display: flex;
  width: 100%;
  margin-bottom: 5px;
}

/* Style the form icons */
.icon {
  padding: 5px;
  color: $main;
  min-width: 50px;
  text-align: center;
  font-size: 1.5rem;
}

input[type='text'],
input[type='password'] {
  // display: block;
  box-sizing: border-box;
  margin-bottom: 20px;
  padding: 4px;
  height: 32px;
  width: 100%;
  border: none;
  border-bottom: 1px solid #aaa;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 15px;
  transition: 0.2s ease;
}

input[type='text'],
input[name='license'] {
  display: block;
  box-sizing: border-box;
  margin-bottom: 20px;
  padding: 4px;
  height: 32px;
  width: 100%;
  border: none;
  border-bottom: 1px solid #aaa;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 15px;
  transition: 0.2s ease;
}

input[type='text']:focus,
input[type='password']:focus {
  border-bottom: 2px solid $secondary; //Cahnge me
  color: $main;
  transition: 0.4s ease;
}

input[type='submit'] {
  margin-top: 28px;
  width: 120px;
  height: 32px;
  // background: #16a085;
  background: $main;
  border: none;
  border-radius: 8px;
  color: $light-accent;
  font-family: 'Roboto', sans-serif; // Change me
  font-weight: 500;
  text-transform: uppercase;
  transition: 0.5s ease;
  cursor: pointer;
}

input[type='submit']:hover,
input[type='submit']:focus {
  opacity: 0.8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  transition: 0.2s ease;
}

input[type='submit']:active {
  opacity: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  transition: 0.1s ease;
}

.tip {
  margin-top: 0;
  padding-top: 0.5rem;
  margin-top: 0;
  margin-bottom: 0.8rem;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-size: 0.8rem;
  color: $light-accent;
}
</style>
