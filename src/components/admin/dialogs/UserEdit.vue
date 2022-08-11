<template>
  <v-container>
    globalMessage {{ globalMessage }}
    <v-snackbar
      v-model="globalMessage"
      timeout="1000"
      color="globalMessage.type"
    >
      {{ globalMessage.message }}
    </v-snackbar>
    <v-card v-if="userForm">
      <span class="subtitle">ID: {{ user.id }}</span>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="localUser.license"
          counter
          :rules="userForm().license.rules"
          label="Cédula profesional"
          required
        ></v-text-field>
        <v-text-field
          v-model="localUser.name"
          :counter="30"
          :rules="userForm().name.rules"
          label="Nombre(s)"
          required
        ></v-text-field>
        <v-text-field
          v-model="localUser.lastname1"
          :counter="30"
          :rules="userForm().lastname1.rules"
          label="Apellido (paterno)"
          required
        ></v-text-field>
        <v-text-field
          v-model="localUser.lastname2"
          :counter="30"
          :rules="userForm().lastname2.rules"
          label="Apellido (materno)"
          required
        ></v-text-field>
        <v-text-field
          v-model="localUser.email"
          :rules="userForm().email.rules"
          label="Correo electrónico"
          required
        ></v-text-field>
        <div
          class="v-inpu
          v-input--is-label-active
          v-input--is-dirty
          theme--light
          v-text-field
          v-text-field--is-booted"
        >
          <div class="v-input__control">
            <div class="v-input__slot">
              <div class="v-text-field__slot">
                <label
                  for="map2"
                  class="v-label v-label--active theme--light"
                  style="left: 0px; right: auto; position: absolute;"
                >
                  Dirección personal
                </label>
                <vue-google-autocomplete
                  id="map2"
                  ref="address2"
                  class="v-input v-input--is-label-active v-input--is-dirty theme--light v-text-field v-text-field--is-booted"
                  classname="form-control"
                  placeholder="Busque su dirección"
                  country="mx"
                  @placechanged="getAddressData"
                ></vue-google-autocomplete>
              </div>
            </div>
          </div>
        </div>

        <v-btn color="success" class="mr-4" dark outlined @click="save">
          {{ $t('actions.save') }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
// @ts-check
import { mapState, mapActions, mapMutations } from 'vuex'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

export default {
  name: 'UserEditDialog',
  components: { VueGoogleAutocomplete },

  props: {
    user: { type: Object, required: true },
  }, // mounted

  data: () => ({
    localUser: {},
    personalProfile: [],
    valid: true,
  }), // props

  computed: {
    ...mapState('admin', ['currentUser', 'globalMessage']),
    ...mapState('colleges', ['colleges', 'campi']),
    /** The user to be edited
     * @returns {Object}
     */
  }, // computed

  watch: {
    async user(newVal, oldVal) {
      if (oldVal.id !== newVal.id) {
        // await this.triggerSetCurrentUserWithProfile(newVal.id)
        this.localUser = this.user
        this.personalProfile = {}
      }
    }, // user
  }, // watch

  async beforeMount() {
    // await this.setCurrentUser(this.user)
    await this.triggerSetCurrentUserWithProfile(this.user.id).then(
      () => (this.localUser = this.currentUser)
    )
  },

  mounted() {
    this.localUser = null
    console.log('this.curentsuer', this.currentUser)
    this.localUser = { ...this.user }
  }, // mounted

  beforeDestroy() {
    this.setCurrentuser({})
    this.localUser = null
    this.personalProfile = {}
  },

  methods: {
    ...mapActions('admin', [
      'updateUserData',
      'updateUserPersonalProfile',
      'triggerSetCurrentUserWithProfile',
    ]),
    ...mapMutations('admin', ['setCurrentuser']),
    getAddressData(e) {
      console.log('getAddressData', e)
      this.personalProfile.push({
        documentName: 'address',
        documentValue: e,
      })
    },
    userForm() {
      return {
        license: {
          rules: [
            (/** @type {any} */ v) => !!v || 'La cédula es requerida',
            (/** @type {string | any[]} */ v) =>
              (v && v.length >= 7 && v.length <= 10) ||
              'La cédula debe ser de 7 a 10 caracteres',
          ], // rules
        }, // license
        name: {
          rules: [
            (/** @type {any} */ v) => !!v || 'El nombre es requerido',
            (/** @type {string | any[]} */ v) =>
              (v && v.length > 2) ||
              'El nombre debe tener al menos 2 carcateres',
          ],
        }, // name

        lastname1: {
          rules: [
            (/** @type {any} */ v) => !!v || 'El primer apellido es requerido',
            (/** @type {string | any[]} */ v) =>
              (v && v.length >= 2) ||
              'El apellido debe tener al menos 2 carcateres',
          ],
        }, // lastname1

        lastname2: {
          rules: [
            (/** @type {string | any[]} */ v) =>
              (v && v.length >= 2) ||
              'El apellido debe tener al menos 2 carcateres',
          ],
        }, // lastname2

        email: {
          rules: [
            /** @returns {boolean|string} */
            (/** @type {string}  */ v) =>
              !!v || 'Debe ingresar un correo válido',

            /** @returns {boolean|string} */
            (/** @type {string} */ v) =>
              /.+@.+\..+/.test(v) || 'Debe ingresar un correo válido',
          ],
        }, // email

        phoneNumber: {
          rules: [
            /**
             * @param {string|null} v
             *  @returns {boolean|string}
             */
            (/** @type {string}  */ v) =>
              !!RegExp(
                '(52)?1?(([2-9][1-9][1-8]\\d{7})|([2-9][1-9][1-9][1-8]\\d{6}))'
              ).test(v) || 'Debe ser un número teléfono válido en México',
          ], // rules
        }, // phoneNumber
      }
    }, // userForm
    validate() {
      this.$refs.form.validate()
    },
    reset() {
      // this.$refs.form.reset()
      this.$emit('close')
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    save() {
      // if (!this.valid) return
      // this.updateUserData(this.localUser)
      this.updateUserPersonalProfile({
        id: this.localUser.id,
        data: [...this.personalProfile],
      })
    },
  }, // methods
}
</script>
