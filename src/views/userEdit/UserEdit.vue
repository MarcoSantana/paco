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
                    @click="save"
                    class="mx-3"
                    color="success"
                    outlined
                    tile
                  >Guardar cambios</v-btn>
                  <v-btn
                    :disabled="!changed"
                    @click="resetForm"
                    class="mx-3"
                    color="warning"
                    outlined
                    tile
                  >Reiniciar formulario</v-btn>
                </v-sheet>
              </v-card-actions>
            </form>
          </validation-observer>
        </v-card>
      </v-sheet>
    </v-row>
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
      valid: true,
    }
  },
  computed: {
    ...mapState('authentication', ['user']),
    localUser: {
      // eslint-disable-next-line object-shorthand
      get: function () {
        return this.getUser()
      },
      // eslint-disable-next-line object-shorthand
      set: function (newValue) {
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
    },
    resetForm() {
      this.$refs.form.reset()
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
