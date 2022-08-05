<template>
  <v-container>
    <h3 class="text-h3 pb-3">Perfil académico</h3>
    <v-row>
      <v-col cols="sm-6">
        <v-card outlined class="pa-3">
          <v-card-title class="title">Cédula de licenciatura</v-card-title>
          <v-list dense>
            <v-list-item
              v-for="(item, key) in academicProfile.license"
              :key="key"
              two-line
            >
              <v-list-item-content class="text-capitalize">
                <v-list-item-title class="font-weight-bold">
                  {{ item | genderize | missingData }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t(`academicProfile.license.${key}`, {}) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="sm-6">
        <v-card outlined class="pa-3">
          <v-card-title class="title">Cédula de especialidad</v-card-title>
          <!-- TODO stop using this model use the info from the academicProfile -->
          <v-list v-if="academicProfile.specialtyLicense" dense>
            <v-list-item
              v-for="(item, key) in academicProfile.specialtyLicense"
              :key="key"
            >
              <v-list-item-content class="text-capitalize">
                <v-list-item-title class="font-weight-bold">
                  {{ item | genderize | missingData }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t(`academicProfile.specialtyLicense.${key}`, {}) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <specialty-license
              :updateable="true"
              name="academicProfile.specialtyLicense.componentName"
              @license="updateSpecialtyLicense"
            ></specialty-license>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12">
        <university :user="user" :academic-profile="academicProfile" />
      </v-col>
      <v-col cols="12">
        <post-degree :user="user" :academic-profile="academicProfile" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { isNil } from 'lodash'
import SpecialtyLicense from '@/views/academicProfile/SpecialtyLicense'
import University from '@/views/academicProfile/University'
import PostDegree from '@/views/academicProfile/PostDegree'

export default {
  name: 'AcademicProfile',
  components: { PostDegree, SpecialtyLicense, University },
  filters: {
    genderize: val => {
      if (isNil(val) || val.isNaN) return val
      switch (val) {
        case '1':
          return 'Hombre'
        case '2':
          return 'Mujer'
        default:
          return val
      }
    },
    missingData: val => {
      if (isNil(val)) return 'Datos faltantes'
      return val
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('academicProfile', ['academicProfile']),
  },
  watch: {},
  mounted() {
    if (isNil(this.academicProfile)) {
      this.getAcademicProfile()
    }
  },
  methods: {
    ...mapActions('academicProfile', ['getAcademicProfile']),
    ...mapMutations('academicProfile', ['updateAcademicProfile']),
    updateSpecialtyLicense(license) {
      this.updateAcademicProfile({ specialtyLicense: { ...license } })
    },
  },
}
</script>
<style scoped>
.title {
  white-space: pre-warp;
  word-break: keep-all;
}
</style>
