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
          <validation-observer v-slot="{ invalid, changed }">
            {{ (valid = !invalid) }}
            {{ (localChanged = changed) }}
            <form @submit.prevent="submit">
              <user-field :model="localUser" disabled name="license" rules="numeric|length:7,10|required" type="text" />
              <user-field :model="localUser" disabled name="email" rules="required|email" type="email" />
              <user-field :model="localUser" name="name" rules="required|length:2,30" type="text" />
              <user-field :model="localUser" name="lastname1" rules="required|length:2,30" type="text" />
              <user-field :model="localUser" name="lastname2" rules="required|length:2,30" type="text" />
              <user-field :model="localUser" name="phoneNumber" rules="required|cellphone" type="tel" />
              <v-card-actions class="d-flex justify-center">
                <v-sheet>
                  <v-btn class="mx-3" tile color="success" outlined :disabled="invalid || !localChanged" @click="save">
                    Guardar cambios
                  </v-btn>
                  <v-btn class="mx-3" tile color="warning" outlined :disabled="!localChanged">Borrar formulario</v-btn>
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
      localChanged: false,
      localSaving: false,
      valid: true,
    }
  },
  computed: {
    ...mapState('authentication', ['user']),
    localUser: {
      // eslint-disable-next-line object-shorthand
      get: function() {
        return this.getUser()
      },
      // eslint-disable-next-line object-shorthand
      set: function(newValue) {
        return this.setUser(...newValue)
      },
    },
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
    ...mapActions('user', ['updateUser']),
    save() {
      this.updateUser(this.localUser)
      this.setUser(this.localUser)
      this.localChanged = false
    },
  },
}
</script>
<style lang="scss" scoped>
.hide {
  visibility: hidden;
}
</style>
