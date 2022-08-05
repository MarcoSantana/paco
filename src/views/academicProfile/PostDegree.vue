<template>
  <v-card class="overflow-hidden" light>
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title class="font-weight-light">
        <v-card-title>Especialidad (en medicina de urgencias)</v-card-title>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="secondary" fab small @click="isEditing = !isEditing">
        <v-icon v-if="isEditing">mdi-close</v-icon>
        <v-icon v-else>mdi-pencil</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-col rows="12">
        <template>
          <v-card class="overflow-hidden" light>
            <v-toolbar flat color="primary lighten-3" dark>
              <v-icon class="mr-2">mdi-hospital-building</v-icon>
              <v-toolbar-title class="font-weight-light">
                Hospital de residencia
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-card-title>
                {{
                  localSpecialty.hospital.name || specialty.hospital.name
                    ? localSpecialty.hospital.name
                    : 'Elija un hospital'
                }}
              </v-card-title>

              <v-autocomplete
                v-show="isEditing"
                v-model="hospital"
                :disabled="!isEditing"
                :items="hospitals"
                :filter="customFilter"
                :select="localSpecialty.hospital.name"
                return-object
                color="primary"
                item-text="name"
                label="Hospital de residencia de especialidad"
              ></v-autocomplete>
              <v-divider></v-divider>
            </v-card-text>
          </v-card>

          <v-card class="my-2">
            <v-toolbar flat color="primary lighten-3" dark>
              <v-icon class="mr-2">mdi-calendar</v-icon>
              <v-toolbar-title class="font-weight-light">
                Periodo de residencia
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-card-title v-show="!isEditing" class="text-capitalize">
                Fecha de inicio: {{ formattedDate(localSpecialty.startDate) }}
                <br />
                Fecha de terminación:
                {{ formattedDate(localSpecialty.endDate) }}
              </v-card-title>
              <v-row v-show="isEditing" class="mt-5" justify="space-around">
                <v-sheet>
                  <v-date-picker
                    v-model="picker"
                    :disabled="!isEditing"
                    color="green lighten-3"
                    header-color="primary"
                  >
                    <v-toolbar
                      class="text--center"
                      dark
                      dense
                      tile
                      flat
                      color="green lighten-1"
                    >
                      <v-spacer></v-spacer>
                      Inicio
                      <v-spacer></v-spacer>
                    </v-toolbar>
                  </v-date-picker>
                </v-sheet>
                <v-date-picker
                  v-model="picker2"
                  :disabled="!picker"
                  :min="picker"
                  color="red lighten-3"
                  header-color="primary"
                >
                  <v-toolbar
                    class="text--center"
                    dark
                    dense
                    tile
                    flat
                    color="red lighten-2"
                  >
                    <v-spacer></v-spacer>
                    Fin
                    <v-spacer></v-spacer>
                  </v-toolbar>
                </v-date-picker>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions v-show="isEditing">
              <v-spacer></v-spacer>
              <v-btn block :disabled="!isEditing" color="success" @click="save">
                {{ $t('actions.save') }}
              </v-btn>
            </v-card-actions>
            <v-snackbar
              v-model="showSnackbar"
              :color="message.type"
              outlined
              :timeout="2000"
              absolute
              bottom
              left
            >
              {{ message.message }}
            </v-snackbar>
          </v-card>
        </template>
      </v-col>
    </v-card-text>
  </v-card>
</template>
<script>
import { isNil } from 'lodash'
import intlDate from '@/filters/intlDate'
import Message from '@/classes/Message'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'PostDegree',
  filters: { intlDate },
  data() {
    return {
      hasSaved: false,
      hospital: null,
      isEditing: null,
      message: { type: '', message: '' },
      model: null,
      picker: null, // delete
      picker2: null, // delete
      showSnackbar: false,
    }
  },

  computed: {
    ...mapState('academicProfile', ['academicProfile']),
    ...mapState('hospitals', ['hospitals']),
    header() {
      if (this.isEditing) return 'Elija un hospital'
      return 'Foo'
    },
    specialty() {
      return {
        hospital: { ...this.hospital },
        startDate: this.picker,
        endDate: this.picker2,
      }
    }, // specialty
    localSpecialty() {
      if (this.academicProfile.specialty) return this.academicProfile.specialty
      return {
        hospital: '',
      }
    },
  }, // computed

  async mounted() {
    if (isNil(this.hospitals)) this.getHospitals()
  }, // mounted
  methods: {
    ...mapActions('academicProfile', ['triggerUpdateAcademicProfile']),
    ...mapActions('hospitals', ['getHospitals']),
    customFilter(item, queryText) {
      const textOne = item.name.toLowerCase()
      const textTwo = item.parent.toLowerCase()
      const searchText = queryText.toLowerCase()

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      )
    }, // customFilter
    formattedDate(dateString) {
      if (!dateString) return this.$t('messages.missing.date')
      return new Date(dateString).toLocaleDateString()
    }, // formatted date
    save() {
      if (isNil(this.specialty.hospital.name)) {
        this.message = new Message({
          type: 'error',
          message: 'Debe elegir un hospital',
        })
        this.showSnackbar = true
        this.hasSaved = true
        return
      }
      if (isNil(this.specialty.startDate) || isNil(this.specialty.endDate)) {
        this.message = new Message({
          type: 'error',
          message: 'Debe elegir un periodo válido de tiempo',
        })
        this.showSnackbar = true
        this.hasSaved = true
        return
      }
      this.triggerUpdateAcademicProfile({
        documentName: 'specialty',
        ...this.specialty,
        startDate: new Date(this.specialty.startDate),
        endDate: new Date(this.specialty.endDate),
      })
      this.isEditing = !this.isEditing
      this.message = new Message({
        type: 'success',
        message: 'Hospital actualizado',
      })
      this.showSnackbar = true
      this.hasSaved = true
    }, // save
  }, // methods
}
</script>
