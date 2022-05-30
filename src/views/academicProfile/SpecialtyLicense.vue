<template>
  <v-container>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure hic voluptates unde ab, cupiditate labore non esse.
    Illo quae asperiores unde, aspernatur quaerat consequatur aperiam distinctio blanditiis ut, numquam eveniet? Lorem
    ipsum dolor sit amet consectetur adipisicing elit. Accusamus soluta fuga impedit iste cumque animi ipsum quia, ex
    blanditiis rem nulla unde odit. Ipsa nostrum assumenda ex quos, nihil nobis?
    <ul>
      <li>Add update button</li>
      <li>Add "Why I am seeing this?"</li>
    </ul>
    <v-dialog v-model="$asyncComputed.licenseData.updating" max-width="290">
      <v-card color="primary" dark>
        <v-card-text>
          Cargando datos
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-text-field v-model="licenseNumber" clearable />
  </v-container>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { isNil } from 'lodash'

export default {
  name: 'SpecialtyLicense',
  data: () => ({
    licenseNumber: '',
  }),
  computed: { ...mapState('academicProfile', ['academicProfile']) },
  watch: {
    licenseData: function licenseData(val) {
      return this.$emit('license', val)
    },
  },
  methods: { ...mapMutations('academicProfile', ['updateAcademicProfile']) },
  asyncComputed: {
    licenseData: {
      async get() {
        if (isNil(this.licenseNumber) || Number.isNaN(this.licenseNumber)) return null
        if (this.licenseNumber.length < 7 || this.licenseNumber.length > 10) return null
        // TODO Debouncer me
        console.log('this.licenseNumber', this.licenseNumber)
        const val = this.licenseNumber
        const response = await fetch(
          `https://us-central1-paco-1a08b.cloudfunctions.net/licenseAPI-licenseAPI/${val}`,
          {}
        )
        return response.json()
      },
    },
  },
}
</script>
