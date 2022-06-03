<template>
  <v-container>
    <h3>{{ $t(`${name}`, {}) }}</h3>
    <v-dialog v-model="loading" max-width="290">
      <v-card color="primary" dark>
        <v-card-text>
          Cargando datos
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="help" max-width="290">
      <v-card>
        <v-card-title class="text-h5 primary lighten-2 white--text">¿Qué es este campo?</v-card-title>
        <v-card-text class="pt-2">
          <p>Aquí debe de capturar su cédula profesional</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="help = false">Entiendo</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <validation-observer>
      <validation-provider v-slot="{ errors }" rules="numeric|length:7,10">
        <v-text-field v-model="licenseNumber" clearable>
          <template v-slot:append @click="debouncedLicenseCheck">
            <v-fade-transition leave-absolute>
              <v-progress-circular v-if="loading" size="24" color="info" indeterminate></v-progress-circular>
              <v-icon v-else left>mdi-search-web</v-icon>
            </v-fade-transition>
          </template>
          <template v-slot:prepend>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="info" v-bind="attrs" v-on="on" @click="help = true">mdi-information</v-icon>
              </template>
              <span>Búsqueda de cédula profesional</span>
            </v-tooltip>
          </template>
        </v-text-field>
        <span class="error--text error lighten-4">{{ errors[0] }}</span>
      </validation-provider>
      <v-btn v-if="updateable && licenseData" @click="updateLicense">I am updateable</v-btn>
    </validation-observer>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { isNil, debounce } from 'lodash'

export default {
  name: 'SpecialtyLicense',
  props: {
    name: { type: String, required: true },
    updateable: { type: Boolean, default: false },
  },
  data: () => ({
    help: false,
    // licenseNumber: '',
    loading: false,
    licenseData: null,
    licenseNumber: 4273560,
    invalidField: null,
  }),
  computed: { ...mapState('academicProfile', ['academicProfile']) },
  watch: {
    licenseNumber: function licenseNumber() {
      if (isNil(this.licenseNumber)) {
        this.licenseData = null
        return null
      }
      if (Number.isNaN(this.licenseNumber)) return null
      this.debouncedLicenseCheck(this)
      return true
    },
    licenseData: function licenseData(val) {
      return this.$emit('license', val)
    },
  },
  methods: {
    ...mapActions('academicProfile', ['triggerUpdateAcademicProfile']),
    debouncedLicenseCheck: debounce(function bar() {
      if (Number.isNaN(+this.licenseNumber)) return null
      if (isNil(this.licenseNumber)) return null
      if (this.licenseNumber.length < 7 || this.licenseNumber.length > 10) return null
      return this.licenseCheck(this)
    }, 250),
    licenseCheck: async that => {
      that.loading = true
      const myResponse = await fetch(
        `https://us-central1-paco-1a08b.cloudfunctions.net/licenseAPI-licenseAPI/${that.licenseNumber}`,
        {}
      )
      that.loading = false
      that.licenseData = await myResponse.json()
      return myResponse
    },
    updateLicense: async function updateLicense() {
      if (!this.updateable) {
        return
      }
      if (isNil(this.licenseData)) {
        return
      }
      const data = { ...this.licenseData, name: this.name }
      // console.log('license data', JSON.stringify(this.licenseData))
      // console.log('data', JSON.stringify(data))
      // TODO Fix this awful name, iot does not work with the DB 202206.02-19.17
      this.triggerUpdateAcademicProfile(data).then(() => console.log('done'))
    },
  },
}
</script>
