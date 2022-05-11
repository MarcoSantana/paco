<template>
  <v-container>
    <!-- Shows a brief description of this page -->
    <info-dialog />
    <v-row>
      <v-sheet class="col-sm-12 col-md-4">
        <profile-photo :model="user" />
      </v-sheet>

      <v-sheet class="col-sm-12 col-md-8">
        <v-card class="px-5" width="100%">
          <validation-observer v-slot="{ invalid, changed }">
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
                    class="mx-3"
                    tile
                    color="success"
                    outlined
                    :disabled="invalid || !changed"
                  >Guardar cambios</v-btn>
                  <v-btn
                    class="mx-3"
                    tile
                    color="warning"
                    outlined
                    :disabled="!changed"
                  >Borrar formulario</v-btn>
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
import { mapState, mapMutations, mapGetters } from 'vuex'
import capitalize from '@/filters/capitalize'
import InfoDialog from './InfoDialog.vue'
import ProfilePhoto from './ProfilePhoto.vue'
import UserField from './UserField.vue'

export default {
  components: { InfoDialog, ProfilePhoto, UserField },
  filters: { capitalize },
  data() {
    return {
      localUser: this.getUser(),
      errors: null,
      valid: true,
      infoDialog: false,
    }
  },
  computed: {
    ...mapState('authentication', ['user']),
  },

  mounted() {
    // console.log('refs.phoneNumber', this.$refs.phoneNumber.disabled)
    // this.localUser = this.getUser()
    //  console.log('localUser', this.localUser)
    //  this.localUser = Object.assign(this.localUser, this.getUser())
    //  console.log('localUser', this.localUser)
  },
  methods: {
    ...mapMutations('authentication', ['setUser']),
    ...mapGetters('authentication', ['getUser']),
  },
}
</script>
<style lang="scss" scoped>
.hide {
  visibility: hidden;
}
</style>
