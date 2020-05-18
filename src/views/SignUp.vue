/** 
//  _______ _______
//  |  |  | |______
//  |  |  | ______|
// author: mSantana
// createdAt 2020-05-17 13:56
// Stardate: 202005.17 13.56
// fileName: views/SignUp.vue
*/
<template>
  <div class="page-wrapper" background-color="primary">
    <!-- Loader -->
    <div v-show="user === undefined" data-test="loader">Authenticating...</div>

    <!-- Offline instruction -->
    <div
      v-show="!networkOnLine"
      data-test="offline-instruction"
    >Please check your connection, login feature is not available offline.</div>

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
        <h1>Registrarse</h1>
        <span name="registration-license-span" v-bind:class="{error: errors.license }">
          <label for="license" class="tip">Cédula profesional {{error.license}}</label>
          <div class="input-container">
            <i class="mdi mdi-badge-account icon"></i>
            <input
              id="registration-license"
              v-model="license"
              data-test="registration-license"
              type="text"
              name="license"
              placeholder="Cédula profesional de licenciatura en medicina"
            />
            <button class="button" @click="documentAPI">
              <i class="mdi mdi-magnify"></i>
            </button>
          </div>
        </span>
        <!-- license -->

        <span name="registration-name-span">
          <label for="name" class="tip">Nombre</label>
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
        </span>
        <!-- name -->

        <span name="registration-lastname-1-span">
          <label for="lastname-1" class="tip">Apellido Paterno</label>
          <div class="input-container">
            <i class="mdi mdi-form-textbox icon"></i>
            <input
              id="registration-lastname-1"
              type="text"
              name="lastname-1"
              placeholder="Apellido Paterno (ej. González)"
              data-test="registration-lastname-1"
              :value="lastname1"
            />
          </div>
        </span>
        <!-- lastname-1 -->

        <span name="registration-lastname-2-span">
          <label for="lastname-2" class="tip">Apellido Materno</label>
          <div class="input-container">
            <i class="mdi mdi-form-textbox icon"></i>
            <input
              id="registration-lastname-2"
              type="text"
              name="lastname-2"
              placeholder="Apellido Materno (ej. Silveti)"
              data-test="registration-lastname-2"
              :value="lastname2"
            />
          </div>
        </span>
        <!-- lastname-2 -->

        <span v-if="gender" name="registration-gender-span">
          <label for="gender" class="tip">Sexo</label>
          <div class="input-container">
            <i v-show="gender == 1" class="mdi mdi-gender-male icon"></i>
            <i v-show="gender == 2" class="mdi mdi-gender-female icon"></i>
            <p
              id="registration-gender"
              name="gender"
              data-test="registration-gender"
            >{{ gender | genderize }}</p>
          </div>
        </span>
        <!--gender-->

        <span v-if="college" name="registration-college-span">
          <label for="college" class="tip">Universidad</label>
          <div class="input-container">
            <i class="mdi mdi-school icon"></i>
            <p
              id="registration-college"
              name="college"
              data-test="registration-college"
            >{{ college }}</p>
          </div>
        </span>
        <!-- college -->

        <span v-if="degree" name="registration-degree-span">
          <label for="degree" class="tip">Título</label>
          <div class="input-container">
            <i class="mdi mdi-certificate icon"></i>
            <p id="registration-degree" name="degree" data-test="registration-degree">{{ degree }}</p>
          </div>
        </span>
        <!-- degree -->

        <span name="registration-email-span">
          <label for="email" class="tip">Email</label>
          <div class="input-container">
            <i class="mdi mdi-email icon"></i>
            <input
              id="registration-email"
              v-model="email"
              type="text"
              name="email"
              placeholder="E-mail (ej. correoejemplo@dominio.com)"
              data-test="registration-email"
            />
          </div>
        </span>
        <!-- email -->

        <span name="registration-email-confirmation-span">
          <label for="email-confirmation" class="tip">Confirmación de e-mail</label>
          <div class="input-container">
            <i class="mdi mdi-email icon"></i>
            <input
              id="registration-email-confirmation"
              v-model="emailConfirmation"
              type="text"
              name="email-confirmation"
              placeholder="Confirme su e-mail (ej. correoejemplo@dominio.com)"
              data-test="registration-email-confirmation"
            />
          </div>
        </span>
        <!-- email-confirmation -->

        <span name="registrartion-pasword-span">
          <label for="password" class="tip">Contraseña</label>
          <div class="input-container">
            <i class="mdi mdi-form-textbox-password icon"></i>
            <input
              id="registration-password"
              v-model="password"
              type="password"
              name="password"
              placeholder="Contraseña"
              data-test="registration-password"
            />
          </div>
        </span>
        <!-- password -->

        <span name="registration-password-confirmation-span">
          <label for="password-confirmation" class="tip">Contraseña</label>
          <div class="input-container">
            <i class="mdi mdi-form-textbox-password icon"></i>
            <input
              id="registration-password-confirmation"
              v-model="passwordConfirmation"
              type="password"
              name="password-confirmation"
              placeholder="Confirme su contraseña"
              data-test="registration-password-confirmation"
            />
          </div>
        </span>
        <!-- password-confirmation -->
        <ul>
          <span :key="key" v-for="(error, key) in errors">
            <li v-if="error">{{error}}</li>
          </span>
        </ul>

        <input type="submit" name="signup_submit" value="Sign me up" @click="checkForm" />
        <!-- TODO -->
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
    // Errors
    error: {},
    loginError: null,
    apiError: null,
    // Form values
    registrationName: null,
    lastname1: null,
    lastname2: null,
    license: '', // TODO Why isn't null
    email: null,
    emailConfirmation: null,
    password: null,
    passwordConfirmation: null,
    gender: null,
    college: null,
    degree: null,
    // Validation
    errors: [],
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

              this.registrationLastname1 = data.paterno
              this.registrationLastname2 = data.materno
              this.registrationName = data.nombre
              this.gender = data.genero
              this.college = data.institucion
              this.degree = data.titulo
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
    }, // documentAPI
    checkForm() {
      this.errors = {
        license: null,
        name: null,
        registrationLastname1: null,
        registrationLastname2: null,
        email: null,
        emailConfirmation: null,
      }
      if (!this.license) {
        this.errors.license = 'El numero de cédula profesional es obligatorio'
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
  margin: 5% 10% 5% 10%;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
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
  background-color: lighten($color: $secondary, $amount: 50%);
  color: $main;
  transition: 0.8s ease;
  box-shadow: 2px 1px rgba(0, 0, 0, 0.4);
}

input[type='text']:hover,
input[type='password']:hover {
  border-bottom: 2px solid $secondary;
  transition: 0.8s ease;
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

.button {
  border-radius: 20%;
  background-color: $main;
  color: $light-accent;
  padding: 0.5rem;
  font-size: 1.5rem;
  text-align: center;
  display: inline-block;
  transition-duration: 0.5s;
  transition: 0.2s ease;
}

.button:hover {
  background-color: $light-accent;
  color: $main;
  opacity: 0.8;
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

// Validation

.error {
  .icon {
    color: $danger-color;
  }
  input {
    background-color: lighten($color: $danger-color, $amount: 20%);
    opacity: 0.6;
    border-radius: 10px;
  }
}
</style>
