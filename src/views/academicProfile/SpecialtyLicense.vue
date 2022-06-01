<template>
  <v-container>
    <v-dialog v-model="loading" max-width="290">
      <v-card color="primary" dark>
        <v-card-text>
          Cargando datos
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <validation-observer>
      <validation-provider v-slot="{ errors }" rules="numeric|length:7,10">
        <v-text-field v-model="licenseNumber" clearable>
          <template v-slot:append @click="debouncedLicenseCheck">
            <v-fade-transition leave-absolute>
              <v-progress-circular v-if="loading" size="24" color="info" indeterminate></v-progress-circular>
              <v-icon v-else left>
                mdi-search-web
              </v-icon>
            </v-fade-transition>
          </template>
          <template v-slot:prepend>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="info" v-bind="attrs" v-on="on">
                  mdi-information
                </v-icon>
              </template>
              <span>Búsqueda de cédula profesional</span>
            </v-tooltip>
          </template>
        </v-text-field>
        <span class="error--text error lighten-4">{{ errors[0] }}</span>
      </validation-provider>
    </validation-observer>
    <ul>
      <h3>TODO</h3>
      <li>Add update button (put this in parent component)</li>
      <li>Add "Why I am seeing this?" (put this in parent component)</li>
      <li>Add a tooltip to explain the license search (put this in parent component)</li>
      <li>Refactor name and reuse it in signup</li>
      <li>As part of the refactor move it to components directory</li>
    </ul>
  </v-container>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { isNil, debounce } from 'lodash'

export default {
  name: 'SpecialtyLicense',
  data: () => ({
    licenseNumber: '',
    loading: false,
    licenseData: null,
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
    ...mapMutations('academicProfile', ['updateAcademicProfile']),
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
  },
}
</script>
