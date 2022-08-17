<template>
  <v-container v-if="!loading">
    <v-snackbar
      v-model="globalMessage.message"
      timeout="1000"
      :color="globalMessage.type"
    >
      {{ globalMessage.message }}
    </v-snackbar>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card>
        <v-layout row wrap>
          <v-flex sm6 md6>
            <v-card class="pa-1">
              <v-card-title class="d-flex">
                Datos personales
                <small class="ml-3 subtitle-2 font-weight-thin">
                  ID: {{ user.id }}
                </small>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="localUser.license"
                  counter
                  :rules="userForm().license.rules"
                  label="Cédula profesional"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="localUser.displayName"
                  :counter="30"
                  :rules="userForm().displayName.rules"
                  label="Nombre completo"
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
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex xs12 sm6>
            <v-card>
              <v-card-title class="text-subtitle text-capitalize">
                {{ $t('userData.personalProfile.address.id') }}
                <v-btn
                  text
                  icon
                  @click="editPersonalAddress = !editPersonalAddress"
                >
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text
                v-for="(val, key) in personalAddress"
                :key="`personalAddress-${key}`"
              >
                <div
                  v-if="
                    key !== 'documentName' &&
                      key !== 'id' &&
                      key &&
                      val &&
                      val !== ''
                  "
                >
                  {{ $t(`userData.personalProfile.address.${key}`) }}: {{ val }}
                </div>
              </v-card-text>
              <address-field
                v-if="editPersonalAddress"
                id="personalAddress"
                @address-data="setPersonalAddress"
              ></address-field>
            </v-card>
          </v-flex>

          <v-flex xs12 sm6>
            <v-card class="ml-1">
              <v-card-title class="justify-center text-capitalize">
                {{ $t('userData.personalProfile.dob') }}
                <div v-if="dob">{{ dob.dob }}</div>
                <v-btn
                  text
                  icon
                  @click="
                    editPersonalDOB = !editPersonalDOB
                    personalProfile.dob = null
                  "
                >
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text class="justify-center pl-3">
                <div v-if="personalProfile && personalProfile.dob">
                  {{ dob }}
                </div>
                <div v-if="personalProfile" class="pl-5 pr-0">
                  <dob-field
                    :show="editPersonalDOB"
                    :dob="dob"
                    :rules="userForm().birthdate.rules"
                    @setDOB="dob = $event"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex xs12 sm6>
            <v-card class="ml-1">
              <v-card-title class="justify-center text-capitalize">
                {{ $t('userData.personalProfile.pob') }}
                <v-btn text icon @click="editPersonalPOB = !editPersonalPOB">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text class="text-justify pl-3">
                <div v-if="pob">
                  <div class="subtitle">
                    {{ pob }}
                  </div>
                </div>
                <address-field
                  v-if="editPersonalPOB"
                  id="pob"
                  types="(regions)"
                  :value="personalProfile.pob"
                  @address-data="pob = $event"
                ></address-field>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex sm12 class="pa-3">
            <v-sheet class="justify-center ma-3">
              <v-card-title class="justify-center text-capitalize">
                {{ $t(`academicProfile.documentName`) }}
              </v-card-title>

              <v-layout row wrap>
                <v-flex v-if="license" sm12 md6>
                  <v-card-title>
                    Cédula profesional (licenciatura):
                  </v-card-title>

                  <v-card-text>
                    <div
                      v-for="item in license.toArray()"
                      :key="item"
                      class="text-capitalize"
                    >
                      {{ item }}
                    </div>
                  </v-card-text>
                </v-flex>
                <v-flex v-if="specialtyLicense" sm12 md6>
                  <v-card-title>
                    Cédula profesional (especialidad):
                  </v-card-title>
                  <v-card-text>
                    <div
                      v-for="item in specialtyLicense.toArray()"
                      :key="item"
                      class="text-capitalize"
                    >
                      {{ item }}
                    </div>
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-sheet>
          </v-flex>

          <v-flex class="ma-1 pa-1" xs12 sm12 md12>
            <v-btn
              color="success"
              class="ma-4"
              block
              dark
              outlined
              @click="save"
            >
              {{ $t('actions.save') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
import { find } from 'lodash'
import createLicense from '@/classes/License'
import { mapState, mapActions, mapMutations } from 'vuex'
import AddressField from '@/components/admin/dialogs/AddressField.vue'
import DobField from '@/components/admin/dialogs/DobField.vue'

/**
 * @vue-prop {Object} user - The user to edit
 * @vue-data {Object} localUser - Current user data
 * @vue-data {Boolean} valid - Form validity
 * @vue-computed {Object} currentUser - The current user data from store
 * @vue-computed {Object} globalMessage - A message delivered from the store
 * @vue-computed {Array} personalData - The personal data of the user
 * @vue-computed {Object} personalAddress - The personal address of the user
 */
export default {
  name: 'UserEditDialog',
  components: { AddressField, DobField },

  props: {
    user: { type: Object, required: true },
  }, // props

  data: () => ({
    loading: true,
    localUser: {},
    personalProfile: [],
    editPersonalAddress: false,
    editPersonalPOB: false,
    editPersonalDOB: false,
    valid: true,
  }), // props

  computed: {
    ...mapState('admin', ['currentUser', 'globalMessage']),
    ...mapState('colleges', ['colleges', 'campi']),

    /**@returns {Array} personalData */
    personalData() {
      return Object.values(this.currentUser.profile)
    }, // personalProfile

    personalAddress() {
      const res = find(this.personalProfile, {
        id: 'address',
      })
      console.log('personalAddress', { res })
      return res
    }, // personalAddress

    dob: {
      set: function(value) {
        // TODO How can I make it dryer?
        this.personalProfile.dob = {
          documentName: 'dob',
          id: 'dob',
          dob: value,
        }
      },

      get: function() {
        // FIXME make me a one liner
        const localDOB = find(this.personalProfile, {
          id: 'dob',
        })
        if (!this.personalProfile.dob) return localDOB

        return this.personalProfile.dob.dob
      },
    }, //dob
    pob: {
      set(value) {
        this.personalProfile.pob = {
          pob: value.country,
          latitude: value.latitude,
          longitude: value.longitude,
          documentName: 'pob',
          id: 'pob',
        }
      }, // set

      get() {
        // FIXME make me a one liner
        const localPOB = find(this.personalProfile, {
          id: 'pob',
        })
        if (!this.personalProfile.pob) return localPOB.country

        return this.personalProfile.pob.country
      },
    }, // pob

    academicProfile() {
      // @ts-ignore
      return this.sortAcademicDocument(Object.values(this.currentUser.profile))
    }, // personalAddress

    license() {
      if (!this.user.profile) return null
      return createLicense(
        find(this.currentUser.profile, { documentName: 'license' })
      )
    },
    specialtyLicense() {
      if (!this.currentUser.profile) return null
      const res = find(this.user.profile, {
        documentName: 'specialtyLicense',
      })
      if (!res) return null
      return createLicense(res)
    },
  }, // computed

  watch: {
    async user(newVal, oldVal) {
      if (oldVal.id !== newVal.id) {
        this.localUser = this.user
      }
    }, // user
  }, // watch

  // async beforeMount() {
  //   // @ts-ignore
  //   await this.triggerSetCurrentUserWithProfile(this.user.id).then(
  //     () => (this.localUser = this.currentUser)
  //   )
  // },

  async beforeMount() {
    this.loading = true
    await this.triggerSetCurrentUserWithProfile(this.user.id)
      .then(() => (this.localUser = this.currentUser))
      .then(() => (this.loading = false))
    console.log('this.currentUser', this.currentUser)
    this.personalProfile = this.currentUser.personalProfile
  }, // mounted

  beforeDestroy() {
    // @ts-ignore
    this.setCurrentuser({})
    this.localUser = null
    this.personalProfile = []
  },

  methods: {
    ...mapActions('admin', [
      'updateUserData',
      'updateUserPersonalProfile',
      'triggerSetCurrentUserWithProfile',
    ]),
    ...mapMutations('admin', ['setCurrentuser']),
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
        birthdate: {
          rules: [
            (/** @type {any} */ v) =>
              !!v || 'La fecha de nacimiento es requerida',
          ], // rules
        }, // birthdate
        displayName: {
          rules: [
            (/** @type {any} */ v) => !!v || 'El nombre es requerido',
            (/** @type {string | any[]} */ v) =>
              (v && v.length > 2) ||
              'El completo debe tener al menos 2 carcateres',
          ],
        }, // name
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
      // FIXME
      // @ts-ignore
      this.$refs.form.validate()
    },

    reset() {
      // FIXME
      // this.$refs.form.reset()
      // @ts-ignore
      this.$emit('close')
    },

    resetValidation() {
      // FIXME
      // @ts-ignore
      this.$refs.form.resetValidation()
    },

    /**
     * Sets the personal address to be saved
     *@param {Object} e - Google address
     *@returns void
     */
    setPersonalAddress(e) {
      this.personalProfile.address = { documentName: 'address', ...e }
    },

    /**
      * Saves the user profile
      @return void
     */
    save() {
      // TODO complete this validation
      // if (!this.valid) return
      // TODO complete user data edit
      // this.updateUserData({
      //   id: this.currentUser.id,
      //   data: { ...userData },
      // })
      this.updateUserPersonalProfile({
        id: this.currentUser.id,
        data: { ...this.personalProfile },
      })
    },

    /**
     * @param {Array} document
     * @public
     * @returns {Array}
     */
    sortAcademicDocument(document) {
      return document.sort((a, b) => {
        if (a.documentName < b.documentName) return -1
        if (a.documentName > b.documentName) return 1
        return 0
      })
    }, // methods
  }, // sortAcademicDocument
}
</script>
