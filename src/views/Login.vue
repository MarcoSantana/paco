<template>
  <div class="page-wrapper">
    <!-- Loader -->
    <div v-show="user === undefined" data-test="loader">Authenticating...</div>

    <!-- Offline instruction -->
    <div v-show="!networkOnLine" data-test="offline-instruction">
      Por favor revise su conexión, el servicio de ingreso no está disponible fuera de línea.
    </div>

    <!-- Auth UI -->
    <div class="box">
      <validation-observer v-slot="{ invalid }">
        <form @submit.prevent="onSubmit">
          <h1>Ingreso al sistema de administración de documentos</h1>
          <div v-if="loginError" class="error-text">{{ loginError }}</div>
          <validation-provider v-slot="{ errors }" rules="email|required">
            <span id="login-email-span" :class="{ error: errors[0] }">
              <label for="registration-email">Correo electrónico</label>
              <div class="input-container">
                <span>{{ errors[0] }}</span>
                <i class="mdi mdi-email icon"></i>
                <input
                  id="login-email"
                  v-model="loginData.email"
                  type="text"
                  placeholder="E-mail"
                  data-test="login-email"
                />
              </div>
            </span>
          </validation-provider>
          <!-- login email -->
          <validation-provider v-slot="{ errors }" rules="required">
            <span name="login-password-span" :class="{ error: errors[0] }">
              <label for="registration-password">Contraseña</label>
              <div class="input-container">
                <span>{{ errors[0] }}</span>
                <i class="mdi mdi-form-textbox-password icon"></i>
                <input
                  id="login-password"
                  v-model="loginData.password"
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  data-test="login-password"
                />
              </div>
            </span>
          </validation-provider>

          <validation-provider v-slot="{ errors }" rules="required">
            <button
              type="submit"
              name="signup_submit"
              :disabled="invalid"
              data-test="signup-submit"
              @click.prevent="loginWithEmailPassword"
            >
              Ingresar
            </button>
          </validation-provider>
        </form>
      </validation-observer>
      <div :disabled="invalid" data-test="signup-submit" @click.prevent="showResetPassword">
        <small>Olvidé mi contraseña</small>
      </div>
      <template>
        <modal name="reset-password">
          <div><h2>Recuperar contraseña</h2></div>
          <div v-if="!showResetMessage">
            <validation-observer>
              <validation-provider v-slot="{ errors }">
                <input
                  ref="resetPasswordEmail"
                  required
                  type="text"
                  :model="resetEmail"
                  name="reset-password-email"
                  placeholder="A este correo enviaremos instrucciones"
                  data-test="reset-password-email"
                />
                <button class="btn" name="reset-password-submit" data-test="signup-submit" @click="resetPassword">
                  Cambiar contraseña
                </button>
              </validation-provider>
            </validation-observer>
          </div>
          <div v-else>
            <h3>Correo enviado</h3>
            Por favor revise su correo electrónico y siga instrucciones para cambiar su contraseña.
          </div>
        </modal>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { isNil } from 'lodash'
import firebase from 'firebase/app'
// import { desktop as isDekstop } from 'is_js'
import * as firebaseErrors from '@/firebase/firebase-errors.json'

export default {
  // mixins: [firebaseErrorsMap],
  data: () => ({
    firebaseErrors,
    invalid: null,
    loginError: null,
    errors: [],
    loginData: {
      email: null,
      password: null,
    },
    resetEmail: null,
    showResetMessage: false,
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
    ...mapState('app', ['networkOnLine', 'appTitle']),
  },
  watch: {
    user: {
      handler(user) {
        if (!isNil(user)) {
          const redirectUrl = isNil(this.$route.query.redirectUrl) ? '/home' : this.$route.query.redirectUrl
          this.$router.push(redirectUrl)
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('authentication', ['setUser']),
    // async login() {
    //   this.loginError = null
    //   const provider = new firebase.auth.GoogleAuthProvider()
    //   this.setUser(undefined)

    //   try {
    //     // Firebase signin with popup is faster than redirect
    //     // but we can't use it on mobile because it's not well supported
    //     // when app is running as standalone on ios & android
    //     // eslint-disable-next-line no-unused-expressions
    //     isDekstop()
    //       ? await firebase.auth().signInWithPopup(provider)
    //       : await firebase.auth().signInWithRedirect(provider)
    //   } catch (err) {
    //     this.loginError = err
    //     this.setUser(null)
    //   }
    // },
    async loginWithEmailPassword() {
      this.loginError = null
      firebase
        .auth()
        .signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
        .then(userCredential => {
          // Signed in
          const { user } = userCredential
          console.log('user :>> ', user)
          // this.setUser(user)
          // Redirect to home o whatever
        })
        .catch(error => {
          const fbErr = Object.values(firebaseErrors)[0]
          this.loginError = fbErr[error.code]
        })
    },

    showResetPassword() {
      this.$modal.show('reset-password')
    },
    hideResetPassword() {
      this.$modal.hide('reset-password')
    },
    test() {
      // eslint-disable-next-line no-alert
      alert('click')
      console.log('this.$refs :>> ', this.$refs.resetPasswordEmail.value)
    },
    // sendResetPasswordEmail: async element => {
    async resetPassword() {
      const email = this.$refs.resetPasswordEmail.value
      if (!isNil(email)) {
        firebase
          .auth()
          .sendPasswordResetEmail(email)
          .then(() => {
            console.log('Password reset mail sent!! :>> ')
            this.showResetMessage = true
          })
          .catch(error => {
            const errorCode = error.code
            const errorMessage = error.message
            const fbErr = Object.values(firebaseErrors)[0]
            this.loginError = fbErr[error.code]
            console.log('errorCode :>> ', errorCode)
            console.log('errorMessage :>> ', errorMessage)
          })
      }
    },
    translateErrors(error) {
      return firebaseErrors[error.code]
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/style.scss';
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
select,
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

button[type='submit'] {
  margin-top: 28px;
  width: 120px;
  height: 32px;
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
.btn {
  /* @extend button[type='submit']; */
  border-radius: 2px;
  font-size: 0.8rem;
  margin-left: 0.35rem;
}
button[type='submit']:disabled {
  cursor: not-allowed;
  color: $main;
  background: $light-accent;
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
  .info {
    color: $danger-color;
    margin-top: 0%;
  }
  input {
    background-color: lighten($color: $danger-color, $amount: 20%);
    opacity: 0.6;
    border-radius: 10px;
  }
  span {
    color: $danger-color;
  }
}

.error-text {
  color: $danger-color;
}
.page-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .login-page-title {
    text-align: center;
  }

  .login-btn {
    margin-top: 20px;
    cursor: pointer;
    padding: 5px 20px;
    border: 1px solid;
    display: inline-block;
    border-radius: 3px;
    border-color: #2c3e50;

    &:hover {
      color: $vue-color;
      border-color: $vue-color;
    }
  }
}
</style>
