<template>
  <v-container>
    <ul>
      <li><h3>TODO</h3></li>
      <li>Add update button</li>
      <li>Add "Why I am seeing this?" (put this in parent component)</li>
      <li>Add a tooltip to explain the license search (put this in parent component)</li>
      <li>Validate field</li>
      <li>Refactor name and reuse it in signup</li>
      <li>As part of the refactor move it to components directory</li>
    </ul>
    <v-dialog v-model="loading" max-width="290">
      <v-card color="primary" dark>
        <v-card-text>
          Cargando datos
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-text-field v-model="licenseNumber" clearable>
      <template v-slot:append @click="debouncedLicenseCheck">
        <v-fade-transition leave-absolute>
          <v-progress-circular v-if="loading" size="24" color="info" indeterminate></v-progress-circular>
          <v-icon v-else left>
            mdi-search-web
          </v-icon>
        </v-fade-transition>
      </template>
    </v-text-field>
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
      this.licenseCheck(this)
    }, 1000),
    licenseCheck: async that => {
      if (isNil(that.licenseNumber)) return null
      if (Number.isNaN(that.licenseNumber)) return null
      if (that.licenseNumber.length < 7 || that.licenseNumber.length > 10) return null
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
