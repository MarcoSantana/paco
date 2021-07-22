<template>
  <!--
  _______ _______
  |  |  | |______
  |  |  | ______|
author: mSantana
createdAt 2020-05-17 13:56
Stardate: 202005.17 13:56
fileName: views/SignUp.vue -->

  <div class="page-wrapper" background-color="primary">
    <!-- Loader -->
    <div v-show="user === undefined" data-test="loader">Autenticando...</div>

    <!-- Offline instruction -->
    <div v-show="!networkOnLine" data-test="offline-instruction">
      Por favor revise su conexión, la característica de ingreso no está disponible fuera de línea.
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
      <div class="box">
        <validation-observer v-slot="{ invalid }">
          <form @submit.prevent="onSubmit">
            <h1>Registrarse</h1>
            <validation-provider v-slot="{ errors }" rules="numeric|length:3,30|required">
              <span id="registration-license-span" :class="{ error: errors[0] }">
                <label for="license" class="tip">Cédula profesional</label>
                <div class="input-container">
                  <i class="mdi mdi-badge-account icon"></i>
                  <input
                    id="registration-license"
                    v-model="registrationData.license"
                    data-test="license"
                    type="text"
                    name="license"
                    placeholder="Cédula profesional de licenciatura en medicina"
                  />
                </div>
                <div class="error info">{{ errors[0] }}</div>
              </span>
            </validation-provider>
            <!-- license -->

            <validation-provider v-slot="{ errors }" rules="required|length:3,30">
              <span name="registration-name-span" :class="{ error: errors[0] }">
                <label for="name" class="tip">Nombre</label>
                <div class="input-container">
                  <span>{{ errors[0] }}</span>
                  <i class="mdi mdi-face icon"></i>
                  <input
                    id="registration-name"
                    v-model="registrationData.name"
                    type="text"
                    name="name"
                    placeholder="Nombres (ej. Juan Carlos)"
                    data-test="registration-name"
                  />
                </div>
              </span>
            </validation-provider>
            <!-- name -->

            <validation-provider v-slot="{ errors }" rules="required|length:3,30">
              <span name="registration-lastname-1-span" :class="{ error: errors[0] }">
                <label for="lastname-1" class="tip">Apellido Paterno</label>
                <div class="input-container">
                  <span>{{ errors[0] }}</span>
                  <i class="mdi mdi-form-textbox icon"></i>
                  <input
                    id="registration-lastname-1"
                    v-model="registrationData.lastname1"
                    type="text"
                    name="lastname-1"
                    placeholder="Apellido Paterno (ej. González)"
                    data-test="registration-lastname-1"
                  />
                </div>
              </span>
            </validation-provider>
            <!-- lastname-1 -->

            <validation-provider v-slot="{ errors }" rules="required">
              <span name="regsitration-lastname-2-span" :class="{ error: errors[0] }">
                <label for="lastname-2" class="tip">Apellido Materno</label>
                <div class="input-container">
                  <span>{{ errors[0] }}</span>
                  <i class="mdi mdi-form-textbox icon"></i>
                  <input
                    id="registration-lastname-2"
                    v-model="registrationData.lastname2"
                    type="text"
                    name="lastname2"
                    placeholder="Apellido Materno (ej. Silveti)"
                    data-test="registration-lastname-2"
                  />
                </div>
              </span>
            </validation-provider>
            <!-- lastname-2 -->

            <validation-provider v-slot="{ errors }" rules="required">
              <span v-if="genders" name="registration-gender-span" :class="{ error: errors[0] }">
                <label for="gender" class="tip">Género</label>
                <div class="input-container">
                  <span>{{ errors[0] }}</span>
                  <i class="mdi mdi-gender-male-female icon"></i>
                  <select v-model="registrationData.gender" data-test="registration-gender">
                    <option v-for="item in genders" :key="item.text" :value="item.value" :selected="item.selected"
                      >{{ item.text }}
                    </option>
                  </select>
                  <i v-if="registrationData.gender" :class="$options.filters.genderize(registrationData.gender)"></i>
                </div>
              </span>
            </validation-provider>
            <!--gender-->

            <validation-provider v-slot="{ errors }" rules="email|required" name="register-email-valitator">
              <span name="registration-email-span" :class="{ error: errors[0] }">
                <label for="email" class="tip">Email</label>
                <div class="input-container">
                  <span>{{ errors[0] }}</span>
                  <i class="mdi mdi-email icon"></i>
                  <input
                    id="registration-email"
                    v-model="registrationData.email"
                    type="text"
                    name="email"
                    placeholder="E-mail (ej. correoejemplo@dominio.com)"
                    data-test="registration-email"
                  />
                </div>
              </span>
            </validation-provider>
            <!-- email -->
            <validation-provider v-slot="{ errors }" rules="confirmed:register-email-valitator">
              <span name="registration-email-confirmation-span" :class="{ error: errors[0] }"
                ><span>{{ errors[0] }}</span>
                <label for="email-confirmation" class="tip">Confirmación de e-mail</label>
                <div class="input-container">
                  <i class="mdi mdi-email icon"></i>
                  <input
                    id="registration-email-confirmation"
                    v-model="registrationData.emailConfirmation"
                    type="text"
                    name="email-confirmation"
                    placeholder="Confirme su e-mail (ej. correoejemplo@dominio.com)"
                    data-test="registration-email-confirmation"
                  />
                </div>
              </span>
            </validation-provider>
            <!-- email-confirmation -->

            <validation-provider
              v-slot="{ errors }"
              rules="required|length:8,16|strong_password"
              name="password-validator"
            >
              <span name="registration-password-span" :class="{ error: errors[0] }">
                <label for="password" class="tip">Contraseña</label>
                <div class="input-container">
                  <span>{{ errors[0] }}</span>
                  <i class="mdi mdi-form-textbox-password icon"></i>
                  <input
                    id="registration-password"
                    v-model="registrationData.password"
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    data-test="registration-password"
                  />
                </div>
              </span>
            </validation-provider>
            <!-- password -->

            <validation-provider v-slot="{ errors }" rules="confirmed:password-validator">
              <span name="registration-password-span" :class="{ error: errors[0] }"
                ><span>{{ errors[0] }}</span>
                <label for="password-confirmation" class="tip">Confirmación de contraseña</label>
                <div class="input-container">
                  <i class="mdi mdi-form-textbox-password icon"></i>
                  <input
                    id="registration-password-confirmation"
                    v-model="registrationData.passwordConfirmation"
                    type="password"
                    name="password-confirmation"
                    placeholder="Confirme su contraseña"
                    data-test="registration-password-confirmation"
                  />
                </div>
              </span>
            </validation-provider>
            <!-- password-confirmation -->

            <button type="submit" name="signup_submit" :disabled="invalid" data-test="signup-submit">
              Registrarse
            </button>

            <!-- TODO -->
          </form>
        </validation-observer>
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
    // Returns the string for each gender based on the REST API
    genderize: value => {
      let gender = null
      if (!isNil(value)) {
        if (value.toString() === '1') {
          gender = 'mdi mdi-gender-male icon'
        }
        if (value.toString() === '2') {
          gender = 'mdi mdi-gender-female icon'
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
    // Move all these to an object
    registrationData: {
      name: null,
      lastname1: null,
      lastname2: null,
      license: '',
      email: null,
      emailConfirmation: null,
      password: null,
      passwordConfirmation: null,
      gender: null,
    },
    // Form values
    // Validation
    errors: [],
    // Genders
    genders: [
      { text: 'Seleccione uno por favor', value: null, selected: true },
      { text: 'Hombre', value: 1 },
      { text: 'Mujer', value: 2 },
    ],
  }),
  head() {
    return {
      title: {
        inner: 'Ingreso',
      },
      meta: [
        // TODO translate anad adjust
        {
          name: 'description',
          content: `Regístrese o ingrese a ${this.appTitle}`,
          id: 'desc',
        },
      ],
    }
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine', 'appTitle', 'loading']),

    isFormValid() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      // this.errors = {
      //   license: this.registrationData.license,
      //   name: this.registrationData.name,
      //   registrationLastname1: this.registrationData.lastname1,
      //   registrationLastname2: this.registrationData.lastname2,
      //   email: this.registrationData.email,
      //   emailConfirmation: this.registrationData.emailConfirmation,
      //   gender: this.registrationData.gender,
      // }

      // if (!this.errors.license) {
      //   this.errors.license = 'El numero de cédula profesional es obligatorio'
      // }
      const isEmpty = Object.values(this.errors).some(x => x !== null && x !== '')
      return isEmpty
    },
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
    console.clear()
  },
  methods: {
    ...mapMutations('authentication', ['setUser']),
    ...mapMutations('app', ['setLoading', 'unsetLoading']),
    async login() {
      // TODO must remove scince it will be qith email/password login
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
    async createAccount() {
      const data = this.registrationData
      // Check if the registration data is complete
      // Use the resgistration data to create a new account via firebase auth
      await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then(userCredentials => {
          const { user } = userCredentials
          console.log('user :>> ', user)
          user
            .updateProfile({
              displayName: `${data.name} ${data.lastname1} ${data.lastname2}`,
            })
            .catch(error => {
              this.errors.push(error)
            })
          user.sendEmailVerification()
        })
      // update user data
    },
    onSubmit() {
      // Submit values to API...
      // eslint-disable-next-line no-alert
      // alert(JSON.stringify(values, null, 2))
      // console.log('values :>> ', values)
      this.createAccount()
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

// .error {
//   .icon {
//     color: $danger-color;
//   }
//   .info {
//     color: $danger-color;
//     margin-top: 0%;
//   }
//   input {
//     background-color: lighten($color: $danger-color, $amount: 20%);
//     opacity: 0.6;
//     border-radius: 10px;
//   }
//   span {
//     color: $danger-color;
//   }
// }
</style>
