<template>
  <v-container>
    <ul>
      <li><h3>TODO</h3></li>
      <li>Add update button</li>
      <li>Add "Why I am seeing this?"</li>
      <li>Add a tooltip to explain the license search</li>
      <li>Hide the search button or better if there is a cancelled version of the icon for the invalid state</li>
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
    <v-text-field
      v-model="licenseNumber"
      clearable
      :append-icon="`mdi-search-web`"
      @click:append="debouncedLicenseCheck"
    />
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
      console.log('licenseCheck')
      if (isNil(that.licenseNumber) && Number.isNaN(that.licenseNumber)) return null
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
