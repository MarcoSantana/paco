<template>
  <!--
  _______ _______
  |  |  | |______
  |  |  | ______|
author: mSantana
createdAt 2020-05-17 13:56
Stardate: 202005.17 13:56
  fileName: views/SignUp.vue-->

  <div class="page-wrapper" background-color="primary">
    <!-- Loader -->
    <div v-show="user === undefined" data-test="loader">Autenticando...</div>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <!-- Offline instruction -->
    <div
      v-show="!networkOnLine"
      data-test="offline-instruction"
    >Por favor revise su conexión, la característica de ingreso no está disponible fuera de línea.</div>

    <p v-if="loginError">{{ loginError }}</p>
    <p v-if="apiError">{{ apiError }}</p>
    <!-- Auth UI -->
    <div
      v-show="user !== undefined && !user && networkOnLine"
      id="signup-form-container"
      class="signup-form-container"
      data-test="signup-form-container"
    >
      <v-card class="pa-2 ma-3">
        <validation-observer v-slot="{ invalid }">
          <form @submit.prevent="onSubmit">
            <v-card-title class="text-h4">Registrarse</v-card-title>
            <v-card-text class="pa-3 my-2">
              <validation-provider v-slot="{ errors }" rules="numeric|length:7,10|required">
                <span id="registration-license-span" :class="{ error: errors[0] }">
                  <v-text-field
                    id="registration-license"
                    v-model="registrationData.license"
                    autocomplete="off"
                    class="my-1"
                    counter="10"
                    data-test="license"
                    hide-details="auto"
                    hint="Nivel licenciatura tipo C1 (de 7 a 10 dígitos)"
                    label="Cédula profesional"
                    name="license"
                    placeholder="Cédula profesional de licenciatura en medicina"
                    prepend-inner-icon="mdi-badge-account"
                    type="text"
                    @keyup="debouncedLicenseCheck(licenseCheck)"
                  />
                  <span class="error--text error lighten-4">{{ errors[0] }}</span>
                </span>
              </validation-provider>
              <!-- license -->

              <validation-provider v-slot="{ errors }" rules="required|length:3,30">
                <span name="registration-name-span" :class="{ error: errors[0] }">
                  <v-text-field
                    id="registration-name"
                    v-model="registrationData.name"
                    autocomplete="off"
                    class="my-1"
                    label="Nombre"
                    hint="ej. Juan Carlos"
                    type="text"
                    prepend-icon="mdi-face"
                    name="name"
                    counter="30"
                    placeholder="Nombres (ej. Juan Carlos)"
                    data-test="registration-name"
                    hide-details="auto"
                  />
                  <span class="error--text error lighten-4">{{ errors[0] }}</span>
                </span>
              </validation-provider>
              <!-- name -->

              <validation-provider v-slot="{ errors }" rules="required|length:2,30">
                <span name="registration-lastname-1-span" :class="{ error: errors[0] }">
                  <v-text-field
                    id="registration-lastname-1"
                    v-model="registrationData.lastname1"
                    autocomplete="off"
                    class="my-1"
                    counter="30"
                    data-test="registration-lastname-1"
                    hint="Primer apellido"
                    label="Apellido paterno"
                    name="lastname-1"
                    placeholder="Apellido Paterno (ej. González)"
                    prepend-icon="mdi-form-textbox"
                    type="text"
                  />

                  <span class="error--text error lighten-4">{{ errors[0] }}</span>
                </span>
              </validation-provider>
              <!-- lastname-1 -->

              <validation-provider v-slot="{ errors }" rules="length:2,30">
                <span name="regsitration-lastname-2-span" :class="{ error: errors[0] }">
                  <v-text-field
                    id="registration-lastname-2"
                    v-model="registrationData.lastname2"
                    autocomplete="off"
                    counter="30"
                    data-test="registration-lastname-2"
                    hint="Segundo apellido (opcional)"
                    label="Apellido materno"
                    name="lastname2"
                    placeholder="Apellido Materno (ej. Silveti)"
                    prepend-icon="mdi-form-textbox"
                    type="text"
                  />
                  <span class="error--text error lighten-4">{{ errors[0] }}</span>
                </span>
              </validation-provider>
              <!-- lastname-2 -->

              <validation-provider v-slot="{ errors }" rules="required">
                <span v-if="genders" name="registration-gender-span" :class="{ error: errors[0] }">
                  <v-select
                    v-model="registrationData.gender"
                    autocomplete="off"
                    :items="genders"
                    data-test="registration-gender"
                    label="Género"
                    :prepend-icon="
                      registrationData.gender
                        ? $options.filters.genderize(registrationData.gender)
                        : 'mdi-gender-male-female'
                    "
                  >
                    <template v-slot:selection="{ item }">{{ item.text }}</template>
                  </v-select>
                  <span class="error--text error lighten-4">{{ errors[0] }}</span>
                </span>
              </validation-provider>
              <!--gender-->
              <validation-provider v-slot="{ errors }" rules="email|required" name="register-email-valitator">
                <span name="registration-email-span" :class="{ error: errors[0] }">
                  <v-text-field
                    id="registration-email"
                    v-model="registrationData.email"
                    autocomplete="off"
                    label="Correo electrónico"
                    hint="Debe ser una dirección válida"
                    type="email"
                    prepend-icon="mdi-email"
                    name="email"
                    placeholder="E-mail (ej. correoejemplo@dominio.com)"
                    data-test="registration-email"
                  />
                  <span class="error--text error lighten-4">{{ errors[0] }}</span>
                </span>
              </validation-provider>
              <!-- email -->
              <validation-provider v-slot="{ errors }" rules="required|confirmed:register-email-valitator">
                <span name="registration-email-confirmation-span" :class="{ error: errors[0] }">
                  <v-text-field
                    id="registration-email-confirmation"
                    v-model="registrationData.emailConfirmation"
                    autocomplete="off"
                    data-test="registration-email-confirmation"
                    hint="Debe ser una dirección válida"
                    label="Confirmación de correo electrónico"
                    name="email-confirmation"
                    placeholder="Confirme su e-mail (ej. correoejemplo@dominio.com)"
                    prepend-icon="mdi-email"
                    type="email"
                  />
                </div>
              </span>
            </validation-provider>
            <!-- email-confirmation -->

            <validation-provider
              v-slot="{ errors }"
              rules="cellphone|numeric|required|length:10,14"
            >
              <span name="cellphone-registration-span" :class="{ error: errors[0] }">
                <label for="cellphone" class="tip">Teléfono celular principal</label>
                <div class="input-container">
                  <span>{{ errors[0] }}</span>
                  <i class="mdi mdi-cellphone-basic icon"></i>
                  <input
                    id="registration-cellphone"
                    v-model="registrationData.cellphone"
                    type="text"
                    data-vv-as="teléfono celular"
                    placeholder="Número de teléfono celular principal"
                    data-test="registration-cellphone"
                  />
                </div>
              </span>
            </validation-provider>
            <!-- cellphone -->

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
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    autocomplete="off"
                    data-test="registration-password"
                    hint="Debe ser de al menos 8 caracteres e incluir mínimo un número y una letra mayúscula"
                    label="Contraseña"
                    name="password"
                    placeholder="Contraseña"
                    prepend-icon="mdi-form-textbox-password"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                  />
                  <span class="error--text error lighten-4">{{ errors[0] }}</span>
                </span>
              </validation-provider>
              <!-- password -->

              <validation-provider v-slot="{ errors }" rules="confirmed:password-validator|required">
                <span name="registration-password-span" :class="{ error: errors[0] }">
                  <v-text-field
                    id="registration-password-confirmation"
                    v-model="registrationData.passwordConfirmation"
                    :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    autocomplete="off"
                    data-test="registration-password-confirmation"
                    data-vv-as="password"
                    hint="Confirme su contraseña"
                    label="Confirmación de contraseña"
                    name="password-confirmation"
                    placeholder="Confirme su contraseña"
                    prepend-icon="mdi-form-textbox-password"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    @click:append="showConfirmPassword = !showConfirmPassword"
                  />
                </span>
              </validation-provider>
              <!-- password-confirmation -->
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" type="submit" name="signup_submit" :disabled="invalid" data-test="signup-submit">
                Registrarse
              </v-btn>
            </v-card-actions>
          </form>
        </validation-observer>
      </v-card>
    </div>
    <!-- signup-form-container -->
  </div>
  <!-- page wrapper -->
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import _, { isNil } from 'lodash'

import phone from '@/filters/phone'
import firebase, { firestore } from 'firebase/app'
import { desktop as isDekstop } from 'is_js'

export default {
  filters: {
    phone,
    zeroPad: (value) => {
      return value.toString().padStart(8, '0')
    },
    // Returns the string for each gender based on the REST API
    genderize: (value) => {
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
    showPassword: false,
    showConfirmPassword: false,
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
      const isEmpty = Object.values(this.errors).some((x) => x !== null && x !== '')
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
  mounted() {},
  methods: {
    ...mapMutations('authentication', ['setUser']),
    ...mapMutations('app', ['setLoading', 'unsetLoading']),
    debouncedLicenseCheck: _.debounce(function() {
      this.licenseCheck(this)
    }, 1000),
    licenseCheck: async that => {
      const data = that.registrationData
      if (data.license.length >= 7 && data.license.length <= 8) {
        that.setLoading()
        fetch(`https://us-central1-paco-1a08b.cloudfunctions.net/licenseAPI-licenseAPI/${data.license}`, {})
          .then(response => response.json())
          .then(json => {
            // TODO format UI to proper case
            that.registrationData.name = json.name
            that.registrationData.lastname1 = json.lastname
            that.registrationData.lastname2 = json.lastname2
            that.registrationData.gender = json.gender
          })
          .finally(() => that.unsetLoading())
      }
    },
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
      this.loading = true
      await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then((userCredential) => {
          const { user } = userCredential
          user.updateProfile({
            displayName: `${data.name} ${data.lastname1} ${data.lastname2}`,
          })
          user.sendEmailVerification()
          return user
        })
        .then((user) => {
          console.log('user from createUserWithEmailAndPassword', user.uid)
          try {
            firestore()
              .collection('users')
              .doc(user.uid)
              .get()
              .then((doc) => console.log('doc.data', doc.data()))
            firestore().collection('users').doc(user.uid).update({ gender: data.gender, license: data.license })
          } catch (error) {
            debugger
            console.error(error)
            this.loginError = error
          }
        })
        .catch((error) => {
          // this.errors.push(error)
          this.loginError = error
        })
        .finally(() => {
          this.loading = false
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

//
<style lang="scss" scoped>
// @import '@/theme/style.scss';
// @import '@/theme/variables.scss';
// * {
//   margin: 0%;
//   padding: 0%;
// }

// *:focus {
//   outline: none;
// }

// body {
//   margin: 0;
//   padding: 0;
//   background: #ddd;
//   font-size: 16px;
//   font-weight: 300;
// }

// #signup-form-container {
//   box-sizing: border-box;
// }

// #login-box {
//   position: relative;
//   box-sizing: border-box;
//   margin: 5% 10% 5% 10%;
//   width: 100%;
//   height: 100%;
//   padding: 1.5rem;
//   border-radius: 2px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
// }

// h1 {
//   margin: 0 0 20px 0;
//   font-weight: 300;
//   font-size: 28px;
// }
// /* Style the input container */
// .input-container {
//   display: flex;
//   width: 100%;
//   margin-bottom: 5px;
// }

// /* Style the form icons */
// .icon {
//   padding: 5px;
//   color: $main;
//   min-width: 50px;
//   text-align: center;
//   font-size: 1.5rem;
// }
// select,
// input[type='text'],
// input[type='password'] {
//   display: block;
//   box-sizing: border-box;
//   margin-bottom: 20px;
//   padding: 4px;
//   height: 32px;
//   width: 100%;
//   border: none;
//   border-bottom: 1px solid #aaa;
//   font-family: 'Roboto', sans-serif;
//   font-weight: 400;
//   font-size: 15px;
//   transition: 0.2s ease;
// }

// input[type='text']:focus,
// input[type='password']:focus {
//   border-bottom: 2px solid $secondary; //Cahnge me
//   background-color: lighten($color: $secondary, $amount: 50%);
//   color: $main;
//   transition: 0.8s ease;
//   box-shadow: 2px 1px rgba(0, 0, 0, 0.4);
// }

// input[type='text']:hover,
// input[type='password']:hover {
//   border-bottom: 2px solid $secondary;
//   transition: 0.8s ease;
// }

// button[type='submit'] {
//   margin-top: 28px;
//   width: 120px;
//   height: 32px;
//   background: $main;
//   border: none;
//   border-radius: 8px;
//   color: $light-accent;
//   font-family: 'Roboto', sans-serif; // Change me
//   font-weight: 500;
//   text-transform: uppercase;
//   transition: 0.5s ease;
//   cursor: pointer;
// }

// button[type='submit']:disabled {
//   cursor: not-allowed;
//   color: $main;
//   background: $light-accent;
// }

// .button {
//   border-radius: 20%;
//   background-color: $main;
//   color: $light-accent;
//   padding: 0.5rem;
//   font-size: 1.5rem;
//   text-align: center;
//   display: inline-block;
//   transition-duration: 0.5s;
//   transition: 0.2s ease;
// }

// .button:hover {
//   background-color: $light-accent;
//   color: $main;
//   opacity: 0.8;
// }

// input[type='submit']:hover,
// input[type='submit']:focus {
//   opacity: 0.8;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
//   transition: 0.2s ease;
// }

// input[type='submit']:active {
//   opacity: 1;
//   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
//   transition: 0.1s ease;
// }

// .tip {
//   margin-top: 0;
//   padding-top: 0.5rem;
//   margin-top: 0;
//   margin-bottom: 0.8rem;
//   font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
//   font-size: 0.8rem;
//   color: $light-accent;
// }

// // Validation

// // .error {
// //   .icon {
// //     color: $danger-color;
// //   }
// //   .info {
// //     color: $danger-color;
// //     margin-top: 0%;
// //   }
// //   input {
// //     background-color: lighten($color: $danger-color, $amount: 20%);
// //     opacity: 0.6;
// //     border-radius: 10px;
// //   }
// //   span {
// //     color: $danger-color;
// //   }
// // }
</style>
