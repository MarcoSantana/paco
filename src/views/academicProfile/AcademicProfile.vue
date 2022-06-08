<template>
  <v-container>
    <h3 class="text-h3 pb-3">Perfil académico</h3>
    <v-row>
      <v-col cols="sm-6">
        <v-card outlined class="pa-3">
          <v-card-title>Licenciatura</v-card-title>
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
          <v-card-title>Especialidad</v-card-title>
          <!-- TODO stop using this model use the info from the academicProfile -->
          <v-list v-if="licenseData" dense>
            <v-list-item v-for="(item, key) in licenseData" :key="key">
              <v-list-item-content class="text-capitalize">
                <v-list-item-title class="font-weight-bold">
                  {{ item | genderize | missingData }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t(`academicProfile.postDegreeLicense.${key}`, {}) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list v-else>
            <v-list-item v-for="(item, key) in licenseData" :key="key">
              <v-list-item-content class="px-5 text-capitalize">
                <v-list-item-title class="text-h5">
                  {{ item | genderize | missingData }}
                </v-list-item-title>
                {{ $t(`academicProfile.${key}`, {}) }}
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <specialty-license
            :updateable="true"
            name="academicProfile.postDegreeLicense.componentName"
            @license="data => (licenseData = data)"
          ></specialty-license>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'
import { isNil } from 'lodash'
import SpecialtyLicense from '@/views/academicProfile/SpecialtyLicense'

export default {
  name: 'AcademicProfile',
  components: { SpecialtyLicense },
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
    return {
      licenseData: null,
      foo: 0,
    }
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('academicProfile', ['academicProfile']),
  },
  methods: {},
}
</script>
