<template>
  <v-container>
    <v-snackbar
      v-model="globalMessage.message"
      timeout="1000"
      :color="globalMessage.type"
    >
      {{ globalMessage.message }}
    </v-snackbar>
    <span class="subtitle">ID: {{ user.id }}</span>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card>
        <v-layout row wrap>
          <v-flex sm6 md6>
            <v-card class="pa-1">
              <v-card-title>
                Datos personales
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
              </v-card-title>
              {{ personalAddress }}
              <v-card-text
                v-for="(val, key) in personalAddress"
                :key="`personalAddress-${key}`"
              ></v-card-text>
              <address-field
                id="personalAddress"
                @address-data="setPersonalAddress"
              ></address-field>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6>
            <v-card class="ml-1">
              <v-card-title class="justify-center text-capitalize">
                {{ $t('userData.personalProfile.dob') }}
              </v-card-title>
              <v-card-text class="justify-center pl-3">
                <div v-if="personalProfile && personalProfile.dob">
                  {{ personalProfile.dob }}
                </div>
                <div v-if="localUser.personalProfile" class="pl-5 pr-0">
                  <v-date-picker
                    v-model="localUser.personalProfile.dob"
                    :rules="userForm().birthdate.rules"
                    label="Fecha de nacimiento"
                    required
                  ></v-date-picker>
                </div>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6>
            <v-card class="ml-1">
              <v-card-title>Lugar de nacimiento (nacionalidad)</v-card-title>
              <v-card-text class="text-justify pl-3">
                <div
                  v-if="
                    localUser.personalProfile && localUser.personalProfile.pob
                  "
                >
                  POB: {{ localUser.personalProfile.pob }}
                  {{ localUser.personalProfile.pob }}
                </div>
                <address-field
                  id="pob"
                  types="(regions)"
                  @address-data="setPOB"
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
            <pre>
              Localuser: {{ localUser.personalProfile }}
              PersonalData: {{ personalData }}
              Personal Address: {{ personalAddress }}
            </pre>
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
import { mapState, mapActions, mapMutations } from 'vuex'
import AddressField from '@/components/admin/dialogs/AddressField.vue'
import createLicense from '@/classes/License'

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
  components: { AddressField },

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

    /**@returns {Array} personalData */
    personalData() {
      if (!this.user.personalProfile) return []
      return Object.values(this.localUser.personalProfile)
    }, // personalProfile

    personalAddress() {
      return find(this.localUser.personalProfile, {
        id: 'address',
      })
    }, // personalAddress

    academicProfile() {
      // @ts-ignore
      return this.sortAcademicDocument(Object.values(this.localUser.profile))
    }, // personalAddress

    license() {
      if (!this.localUser.profile) return null
      return createLicense(
        find(this.localUser.profile, { documentName: 'license' })
      )
    },
    specialtyLicense() {
      if (!this.localUser.profile) return null
      const res = find(this.localUser.profile, {
        documentName: 'specialtyLicense',
      })
      if (!res) return null
      return createLicense(res)
    },
  }, // computed

  watch: {
    async user(newVal, oldVal) {
      if (oldVal.id !== newVal.id) {
        // await this.triggerSetCurrentUserWithProfile(newVal.id)
        this.localUser = this.user
        // this.personalProfile = []
      }
    }, // user
  }, // watch

  async beforeMount() {
    // @ts-ignore
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
      // @ts-ignore
      this.$refs.form.validate()
    },

    reset() {
      // this.$refs.form.reset()
      // @ts-ignore
      this.$emit('close')
    },

    resetValidation() {
      // @ts-ignore
      this.$refs.form.resetValidation()
    },

    /**
     * Sets the place of birth to be saved
     *@param {Object} e -- The name of the country as per Google
     *@returns void
     */
    setPOB(e) {
      // @ts-ignore
      this.localUser.personalProfile.pob = {
        documentName: 'pob',
        country: e.country,
      }
    },

    /**
     * Sets the personal address to be saved
     *@param {Object} e - Google address
     *@returns void
     */
    setPersonalAddress(e) {
      this.localUser.personalProfile.address = { documentName: 'address', ...e }
      // @ts-ignore
      // this.localUser.personalProfile = {
      //   // @ts-ignore
      //   ...this.localUser.personalProfile,
      //   address: { documentName: 'address', ...e },
      // }
    },

    /** 
      * Saves the user profile
      @return void
     */
    save() {
      // THIS IS INCOMPLETE DOES NOT SAVE THE PERSONAL PROFILE
      // if (!this.valid) return
      // this.updateUserData(this.localUser)
      // @ts-ignore
      this.updateUserPersonalProfile({
        id: this.currentUser.id,
        data: { ...this.localUser.personalProfile },
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
