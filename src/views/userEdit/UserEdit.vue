<template>
  <v-container>
    <!-- Shows a brief description of this page -->
    <info-dialog />
    <v-row>
      <v-sheet class="col-sm-12 col-md-4">
        <profile-photo :model="localUser" />
      </v-sheet>
      <v-sheet class="col-sm-12 col-md-8">
        <v-card class="px-5" width="100%">
          <validation-observer ref="form" v-slot="{ invalid, changed }">
            <form @submit.prevent="submit">
              <user-field
                :model="localUser"
                disabled
                name="license"
                rules="numeric|length:7,10|required"
                type="text"
              />
              <user-field
                :model="localUser"
                disabled
                name="email"
                rules="required|email"
                type="email"
              />
              <user-field :model="localUser" name="name" rules="required|length:2,30" type="text" />
              <user-field
                :model="localUser"
                name="lastname1"
                rules="required|length:2,30"
                type="text"
              />
              <user-field
                :model="localUser"
                name="lastname2"
                rules="required|length:2,30"
                type="text"
              />
              <user-field
                :model="localUser"
                name="phoneNumber"
                rules="required|cellphone"
                type="tel"
              />
              <v-card-actions class="d-flex justify-center">
                <v-sheet>
                  <v-btn
                    :disabled="invalid || !changed"
                    class="mx-3"
                    color="success"
                    outlined
                    tile
                    @click="save"
                  >Guardar cambios</v-btn>
                  <v-btn
                    :disabled="!changed"
                    class="mx-3"
                    color="warning"
                    outlined
                    tile
                    @click="resetForm"
                  >Reiniciar formulario</v-btn>
                </v-sheet>
              </v-card-actions>
            </form>
          </validation-observer>
        </v-card>
      </v-sheet>
    </v-row>
    <v-snackbar
      v-model="snackbar.show"
      absolute
      centered
      rounded="pill"
      color="primary"
      :timeout="2000"
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >{{ $t('actions.close') }}</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import capitalize from '@/filters/capitalize'
import InfoDialog from './InfoDialog.vue'
import ProfilePhoto from './ProfilePhoto.vue'
import UserField from './UserField.vue'

export default {
  components: { InfoDialog, ProfilePhoto, UserField },
  filters: { capitalize },
  data() {
    return {
      errors: null,
      infoDialog: false,
      localSaving: false,
      snackbar: { show: false, message: '', timeout: 2000 },
      valid: true,
    }
  },
  computed: {
    ...mapState('authentication', ['user']),
    localUser: {
      get: function get() {
        return this.getUser()
      },
      set: function set(newValue) {
        return this.setUser(newValue)
      },
    },
  },
  mounted() {},
  methods: {
    ...mapMutations('authentication', ['setUser']),
    ...mapGetters('authentication', ['getUser']),
    ...mapActions('user', ['updateUser']),
    save() {
      this.updateUser(this.localUser)
      this.setUser(this.localUser)
      this.resetForm()
      this.snackbar = { ...this.snackbar, show: true, message: 'Cambios almacenados' }
    },
    resetForm() {
      this.$refs.form.reset()
      this.snackbar = { ...this.snackbar, show: true, message: 'Formulario reiniciado' }
      this.localUser = { ...this.user }
    },
  },
}
</script>
<style lang="scss" scoped>
.hide {
  visibility: hidden;
}
</style>
