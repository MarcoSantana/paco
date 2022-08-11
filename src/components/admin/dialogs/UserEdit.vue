<template>
  <v-container>
    <v-snackbar
      v-model="globalMessage"
      timeout="1000"
      :color="globalMessage.type"
    >
      {{ globalMessage.message }}
    </v-snackbar>

    <span class="subtitle">ID: {{ user.id }}</span>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-layout class="pa-2 ml-5 mt-5" row wrap>
        <v-flex class="ma-1 pa-1" xs12 sm6 md6>
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

        <v-flex class="ma-1 pa-1" xs12 sm6 md6>
          <v-card>
            <v-card-title class="text-subtitle text-capitalize">
              {{ $t('userData.personalProfile.address.id') }}
            </v-card-title>
            <v-card-text
              v-for="(val, key) in personalAddress"
              :key="`personalAddress-${key}`"
            >
              <div v-if="key !== 'id'">
                {{ $t(`userData.personalProfile.address.${key}`) }}:
                {{ val }}
              </div>
            </v-card-text>
            <address-field
              id="personalAddress"
              @address-data="getAddressData"
            ></address-field>
          </v-card>
        </v-flex>

        <v-flex class="ma-1 pa-1" xs12 sm6 md6>
          <v-card class="ml-1">
            <v-card-title>
              {{ $t('userData.personalProfile.dob') }}
            </v-card-title>
            <v-card-text class="text-justify pl-3">
              <div v-if="personalProfile.dob">
                {{ personalProfile.dob }}
              </div>
              <div>
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

        <v-flex class="ma-1 pa-1" xs12 sm6 md6>
          <v-card class="ml-1">
            <v-card-title>Lugar de nacimiento (nacionalidad)</v-card-title>
            <v-card-text class="text-justify pl-3">
              <address-field
                id="pob"
                :types="['(regions)']"
                @address-data="localUser.personalProfile.pob = $event"
              ></address-field>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex class="ma-1 pa-1" xs12 sm12 md12>
          <v-btn color="success" class="ma-4" block dark outlined @click="save">
            {{ $t('actions.save') }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
// @ts-check
import { mapState, mapActions, mapMutations } from 'vuex'
import AddressField from '@/components/admin/dialogs/AddressField.vue'

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

    /**@returns {Array<Object>} personalData */
    personalData() {
      return Object.values(this.localUser.personalProfile)
    }, // personalProfile

    personalAddress() {
      // return the item with id === 'address'
      console.clear()
      console.log(this.personalData)
      return this.personalData.find(item => item.id === 'address')
    }, // personalAddress

    // personalAddress() {
    //   return this.personalProfile.address
    // }, // personalAddress
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
    this.personalProfile = []
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
