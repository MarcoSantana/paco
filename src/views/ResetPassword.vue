<template>
  <div class="box">
    <h2>Cambio de contraseña</h2>
    <a
      href="/home?mode=resetPassword&oobCode=tRiYs5S8Ry5pwQrd7SH5-qQr9Zlv7Hkg2yzX9HyQyhIAAAF6-Fh59g&apiKey=AIzaSyAge4gR03bNsbvhOtyRSuw4qtGBgE4pX_U&lang=es-419"
      >Link</a
    >
    <div>Mensajes:>> {{ accountEmail }}</div>
    <div>
      <input type="text" placeholder="nueva contraseña" required />
      <input type="text" placeholder="confirme contraseña" required />
      <button disabled="disabled" class="button">Cambiar contraseña</button>
    </div>
  </div>
</template>

<script>
import { auth } from 'firebase'
import { isNil } from 'lodash'

export default {
  // TODO import the errors translation 202107.30-20.47
  props: {
    resetActionCode: String,
    resetLang: String,
    resetKey: String,
  },
  data: () => ({ accountEmail: null }),
  mounted() {
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
          this.accountEmail = error
        })
      if (!isNil(this.accountEmail) && !isNil(this.newPasword))
        auth().confirmPasswordReset(this.resetActionCode, this.newPassword)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/style.scss';
@import '@/theme/variables.scss';
</style>
