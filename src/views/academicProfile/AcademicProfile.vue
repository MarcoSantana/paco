<template>
<v-container>
  <h3 class="text-h3 pb-3">Perfil académico</h3>

  <v-row>
    <v-col cols="sm">
      <v-card>
        <v-card-title class="text-h4">Licenciatura</v-card-title>
        <v-list>
          <v-list-item v-for="(item, key) in academicProfile.license" :key="key">
            <v-list-item-content class="px-5 text-capitalize">
              <v-list-item-title class="text-h5">{{ item | genderize | missingData }}</v-list-item-title>
              {{ $t(`academicProfile.license.${key}`, {}) }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="sm">
      <v-card>
        <v-card-title>Especialidad</v-card-title>
        <v-list v-if="academicProfile.posgraduateLicense">
          <v-list-item v-for="(item, key) in academicProfile.posgraduateLicense" :key="key">
            <v-list-item-content class="px-5 text-capitalize">
              <v-list-item-title class="text-h5">{{ item | genderize | missingData }}</v-list-item-title>
              {{ $t(`academicProfile.${key}`, {}) }}
            </v-list-item-content>
          </v-list-item>
          <v-divider inset></v-divider>
        </v-list>
        <v-card>
            Agregar datos de cédula profesional de especialista
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>
<script>
import { mapState } from 'vuex'
import { isNil } from 'lodash'

export default {
  name: 'AcademicProfile',

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
}
</script>
