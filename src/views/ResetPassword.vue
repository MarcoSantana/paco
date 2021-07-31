<template>
  <div class="box">
    <h2>Cambio de contraseña</h2>
    <a
      href="/home?mode=resetPassword&oobCode=tRiYs5S8Ry5pwQrd7SH5-qQr9Zlv7Hkg2yzX9HyQyhIAAAF6-Fh59g&apiKey=AIzaSyAge4gR03bNsbvhOtyRSuw4qtGBgE4pX_U&lang=es-419"
      >Link</a
    >
    <div v-if="accountEmail">:>> {{ accountEmail }}</div>
    <div>
      <validation-observer v-slot="{ invalid }">
        <div>
          La contraseña debe contener al menos: 8 caracteres y un máximo de 16, una letra mayúscula, una letra minúscula
          y un número
        </div>
        <validation-provider
          v-slot="{ errors }"
          rules="required|length:8,16|strong_password"
          name="reset-password-valitator"
        >
          <span name="new-password-span" :class="{ error: errors[0] }">
            <label for="newPassword" class="tip">Nueva contraseña</label>
            <div class="input-container">
              <span>{{ errors[0] }}</span>
              <i class="mdi mdi-lock icon"></i>
              <input
                id="new-password"
                v-model="newPassword"
                type="text"
                name="newPassword"
                placeholder="Nueva contraseña"
                data-test="password-reset"
              />
            </div>
          </span>
        </validation-provider>
        <!-- email -->
        <validation-provider v-slot="{ errors }" rules="confirmed:reset-password-valitator">
          <span name="new-password-confirmation-span" :class="{ error: errors[0] }">
            <label for="newPasswordConfirmation" class="tip">Confirmación de contraseña</label>
            <div class="input-container">
              <span>{{ errors[0] }}</span>
              <i class="mdi mdi-lock icon"></i>
              <input
                id="new-password-confirmation"
                v-model="newPasswordConfirmation"
                type="text"
                name="newPasswordConfirmation"
                placeholder="Confirme su nueva contraseña"
                data-test="password-reset-confirmation"
              />
            </div>
          </span>
        </validation-provider>
        <!-- password-confirmation -->
      </validation-observer>
    </div>
  </div>
</template>

<script>
import { auth } from 'firebase'
import { isNil } from 'lodash'
import * as firebaseErrors from '@/firebase/firebase-errors.json'

export default {
  // TODO import the errors translation 202107.30-20.47
  props: {
    resetActionCode: String,
    resetLang: String,
    resetKey: String,
  },
  data: () => ({
    accountEmail: null,
    invalid: false,
    translatedError: null,
    errors: [],
    newPassword: null,
    newPasswordConfirm: null,
    newPasswordConfirmation: null,
  }),
  mounted() {
    // only to load it in dev
    this.handleResetPassword()
  },
  methods: {
    handleResetPassword() {
      auth()
        .verifyPasswordResetCode(this.resetActionCode)
        .then(email => {
          this.accountEmail = email
        })
        .catch(error => {
          const fbErr = Object.values(firebaseErrors)[0]
          this.translatedError = fbErr[error.code]
        })
      // .catch(error => {
      //   this.accountEmail = error
      // })
      if (!isNil(this.accountEmail) && !isNil(this.newPasword))
        auth().confirmPasswordReset(this.resetActionCode, this.newPassword)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/style.scss';
@import '@/theme/variables.scss';
.error {
  color: $danger-color;
  input {
    background-color: lighten($color: $danger-color, $amount: 20%);
    opacity: 0.6;
    border-radius: 10px;
  }
  span {
    color: $danger-color;
  }
}
</style>
