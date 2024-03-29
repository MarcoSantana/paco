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
    <v-overlay
      id="loading-ovelay"
      data-test="registration-loading-overlay"
      :value="loading"
      opacity="0.8"
      color="secondary lighten-5"
    >
      <v-progress-circular color="secondary" rotate="180" indeterminate size="200" width="10">
        <v-progress-circular size="160" color="editable" width="10" indeterminate rotate="90">
          <v-progress-circular color="primary" rotate="270" indeterminate size="128" width="10">
            <div class="text-capitalize font-weight-medium">{{ $t('messages.processing') }}</div>
          </v-progress-circular>
        </v-progress-circular>
      </v-progress-circular>
    </v-overlay>

    <!-- Offline instruction -->
    <div v-show="!networkOnLine" data-test="offline-instruction">
      Por favor revise su conexión, la característica de ingreso no está
      disponible fuera de línea.
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
      <v-btn fab dark small absolute fixed right color="primary" to="home">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-card class="pa-2 ma-3">
        <validation-observer v-slot="{ invalid }">
          <form @submit.prevent="onSubmit">
            <v-card-title class="text-h4">Registrarse</v-card-title>
            <v-card-text class="pa-3 my-2">
              <validation-provider v-slot="{ errors, valid }" rules="numeric|length:6,10|required">
                {{ setValidLicense(valid) }}
                <span
                  id="registration-license-span"
                  :class="{ error: errors[0] }"
                >
                  <v-text-field
                    id="registration-license"
                    v-model="registrationData.license"
                    autocomplete="off"
                    class="my-1"
                    counter="30"
                    data-test="registration-license"
                    hide-details="auto"
                    hint="Cédula profesional"
                    label="Cédula profesional"
                    name="license"
                    placeholder="Cedula profesional de licenciatura"
                    prepend-inner-icon="mdi-badge-account"
                    type="text"
                    @keyup="debouncedLicenseCheck(licenseCheck)"
                  />
                  <span class="error--text error lighten-4">{{ errors[0] }}</span>
                </span>
              </validation-provider>
            </v-card-text>
            <!-- license -->
            <validation-provider v-slot="{ errors }" rules="required|length:3,30">
              <span name="registration-name-span" :class="{ error: errors[0] }">
                <v-text-field
                  id="registration-name"
                  v-model="registrationData.name"
                  autocomplete="off"
                  class="my-1"
                  counter="30"
                  data-test="registration-name"
                  hide-details="auto"
                  hint="ej. Juan Carlos"
                  label="Nombre"
                  name="name"
                  placeholder="Nombres (ej. Juan Carlos)"
                  prepend-icon="mdi-face"
                  type="text"
                />
                <span class="error--text error lighten-4">{{ errors[0] }}</span>
              </span>
            </validation-provider>
            <!-- name -->
            <validation-provider v-slot="{ errors }" rules="required|length:3,30">
              <span name="registration-lastname-1-span" :class="{ error: errors[0] }">
                <v-text-field
                  id="registration-lastname-1"
                  v-model="registrationData.lastname1"
                  autocomplete="off"
                  class="my-1"
                  counter="30"
                  data-test="registration-lastname-1"
                  hide-details="auto"
                  hint="ej. Juan Carlos"
                  label="Apellido Paterno"
                  name="lastname-1"
                  placeholder="Apellido Paterno (ej. González)"
                  prepend-icon="mdi-form-textbox"
                  type="text"
                />
                <span class="error--text error lighten-4">{{ errors[0] }}</span>
              </span>
            </validation-provider>
            <!-- last-name-1 -->
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
            <validation-provider
              v-slot="{ errors }"
              rules="email|required"
              name="register-email-valitator"
            >
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
            <validation-provider
              v-slot="{ errors }"
              rules="required|confirmed:register-email-valitator"
            >
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
                <span class="error--text error lighten-4">{{ errors[0] }}</span>
              </span>
            </validation-provider>
            <!-- email-confirmation -->

            <validation-provider
              v-slot="{ errors }"
              rules="cellphone|required"
              name="cellphone-validator"
            >
              <span name="registration-cellphone-span" :class="{ error: errors[0] }">
                <v-text-field
                  id="registration-cellphone"
                  v-model="registrationData.cellphone"
                  prepend-icon="mdi-cellphone-basic"
                  autocomplete="off"
                  data-test="registration-cellphone"
                  hint="Debe ser un teléfono celular válido en México"
                  name="cellphone"
                  label="Teléfono celular"
                />
                <span class="error--text error lighten-4">{{ errors[0] }}</span>
              </span>
            </validation-provider>
            <!-- cellphone -->

            <validation-provider
              v-slot="{ errors }"
              rules="required|length:8,16|strong_password"
              name="password-validator"
            >
              <span name="registration-password-span" :class="{ error: errors[0] }">
                <v-text-field
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

            <v-btn
              ripple
              color="primary"
              type="submit"
              name="signup_submit"
              :disabled="invalid"
              data-test="signup-submit"
            >Registrarse</v-btn>
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
// import firebase from 'firebase/app'
import { desktop as isDekstop } from 'is_js'

export default {
  name: 'Signup',
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
    validLicense: false,
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
      cellphone: null,
    }, // Validation
    errors: [],
    license: undefined,
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
      const isEmpty = Object.values(this.errors).some(
        (x) => x !== null && x !== ''
      )
      return isEmpty
    },
  },
  watch: {
    user: {
      handler(user) {
        console.log('user in watch', user)
        if (!isNil(user) && !isNil(user.id) && !isNil(user.phoneNumber)) {
          const redirectUrl = isNil(this.$route.query.redirectUrl)
            ? '/documents'
            : this.$route.query.redirectUrl
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
    debouncedLicenseCheck: _.debounce(function debounced() {
      this.licenseCheck(this)
    }, 1000),
    licenseCheck: async (that) => {
      const data = that.registrationData
      if (!that.validLicense) return
      if (data.license.length >= 6 && data.license.length <= 8) {
        that.setLoading()
        fetch(
          `https://us-central1-paco-1a08b.cloudfunctions.net/licenseAPI-licenseAPI/${data.license}`,
          {}
        )
          .then((response) => response.json())
          .then((json) => {
            that.license = json
            // TODO format UI to proer case
            // TODO change text encoding
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
      this.setLoading()
      await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then(() => {
          // const { user } = userCredential
          const user = firebase.auth().currentUser

          user
            .updateProfile({
              displayName: `${data.name} ${data.lastname1} ${data.lastname2}`,
              phoneNumber: data.cellphone,
            })
            .then(() => {
              // Update successful
              firestore()
                .collection('users')
                .doc(user.uid)
                .set({
                  name: data.name,
                  displayName: `${data.name} ${data.lastname1} ${data.lastname2}`,
                  lastname1: data.lastname1,
                  lastname2: data.lastname2,
                  license: data.license,
                  email: data.email,
                  phoneNumber: data.cellphone,
                  incomplete: true,
                })
              // ...
            })
            .then(() => {
              firestore()
                .collection('users')
                .doc(user.uid)
                .collection('profile')
                .doc('license')
                .set({ ...this.license })
            })
            .then(() => {
              firestore()
                .collection('profiles')
                .doc(user.uid)
                .set({ license: this.license })
            })
            .then(() => {
              this.$router.push('/checkLogin')
            })
            .catch((error) => {
              // An error occurred
              console.error('error in example from docs', error)
              // ...
            })

            // const user = firebase.auth().currentUser
            // user
            //   .updateProfile({
            //     displayName: `${data.name} ${data.lastname1} ${data.lastname2}`,
            //   })
            // .then(res => {
            //   console.log('updated user', res)
            //   firestore()
            //     .collection('users')
            //     .doc(user.uid)
            //     .set({
            //       name: data.name,
            //       lastname1: data.lastname1,
            //       lastname2: data.lastname2,
            //       license: data.license,
            //       email: data.email,
            //     })
            // })
            // .then(() => {
            //   console.log('Updating user data just after update profile')
            //   console.log('user.uid', user.uid)
            //   firestore()
            //     .collection('users')
            //     .doc(user.uid)
            //     .update({ gender: data.gender, license: data.license })
            // })
            .catch((error) => {
              this.errors.push(error)
            })
        })
        .catch((error) => {
          // this.errors.push(error)
          this.loginError = error
        })
        .finally(() => {
          this.unsetLoading()
        })
        .catch((error) => {
          console.log('Error creating new account', error)
        })
    },
    onSubmit() {
      this.createAccount()
    },
    setValidLicense(valid) {
      this.validLicense = valid
    },
  },
}
</script>
