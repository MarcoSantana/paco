<template>
  <v-container>
    <v-text-field v-if="!$asyncComputed.licenseData.updating" v-model="licenseNumber" />
    <v-dialog v-if="$asyncComputed.licenseData.updating" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Buscando datos...
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { isNil } from 'lodash'

export default {
  name: 'SpecialtyLicense',
  data: () => ({
    licenseNumber: '',
  }),
  watch: {
    licenseData(val) {
      console.log('emit in licenseData watch', val)
      this.$emit('license', val)
    },
  },
  asyncComputed: {
    licenseData: {
      get() {
        if (isNil(this.licenseNumber) || Number.isNaN(this.licenseNumber)) return null
        if (this.licenseNumber.length < 7 || this.licenseNumber.length > 10) return null
        const val = this.licenseNumber
        return fetch(
          `https://us-central1-paco-1a08b.cloudfunctions.net/licenseAPI-licenseAPI/${val}`,
          {}
        ).then(response => response.json())
      },
    },
  },
  methods: {},
}
</script>
