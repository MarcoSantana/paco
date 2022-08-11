<template>
  <v-card>
    <v-card-title class="title">
      Universidad formativa (Licenciatura/pregrado)
    </v-card-title>
    <v-card-text>
      <v-row class="mb-3">
        <v-alert
          v-if="localMessage && localMessage.message"
          :type="localMessage.type"
          dismissible
          outlined
        >
          {{ localMessage.message }}
        </v-alert>
      </v-row>
      <v-row class="mb-3">
        <v-col v-if="!hideFields" class="sm-6">
          <v-card class="pa">
            <v-card-title v-if="fullCollege.college">
              Universidad
            </v-card-title>
            <v-card-text>{{ fullCollege.college.name }}</v-card-text>
            <span
              v-if="
                fullCollege.college.campus && fullCollege.college.campus.name
              "
            >
              <v-card-title>Campus</v-card-title>
              <v-card-text>{{ fullCollege.college.campus.name }}</v-card-text>
            </span>
            <v-card-actions v-if="fullCollege.college.campus.id">
              <v-btn outlined color="success" @click="save">
                <v-icon class="mr-2">
                  mdi-content-save
                </v-icon>
                {{ $t('actions.save') }}
              </v-btn>
              <v-spacer />
              <v-btn color="error" outlined @click="reset">
                <v-icon class="mr-2">
                  mdi-cancel
                </v-icon>
                {{ $t('actions.cancel') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col v-if="academicProfile.degree" class="sm-6">
          <v-card class="pa">
            <v-card-title>Universidad</v-card-title>
            <v-card-text>
              {{ academicProfile.degree.college.name }}
            </v-card-text>
            <v-card-title>Campus</v-card-title>
            <v-card-text
              v-if="
                academicProfile.degree.college &&
                  academicProfile.degree.college.campus
              "
            >
              {{ academicProfile.degree.college.campus.name }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-sheet>
        <v-col rows="12">
          Seleccionar nueva universisdad
          <v-select
            v-model="college"
            :items="colleges"
            item-text="name"
            persistent-hint
            return-object
            single-line
            label="Universidad formativa"
            solo
          ></v-select>
        </v-col>
        <v-col rows="12">
          <v-select
            v-if="college"
            v-model="campus"
            :items="campi"
            item-text="name"
            label="campus"
            persistent-hint
            single-line
            return-object
            @change="hideFields = false"
          ></v-select>
        </v-col>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>
<script>
import { isNil } from 'lodash'
import Message from '@/classes/Message'
import { mapState, mapActions } from 'vuex'

export default {
  components: {},
  data: () => ({
    campus: {},
    college: null,
    hideFields: true,
    localMessage: null,
  }), // data
  computed: {
    ...mapState('colleges', ['colleges', 'campi']),
    ...mapState('academicProfile', ['academicProfile']),
    fullCollege() {
      if (isNil(this.college) && isNil(this.campus)) return null
      return {
        documentName: 'degree',
        college: { ...this.college, campus: { ...this.campus } },
      }
    },
  }, // computed
  watch: {
    async college(newVal) {
      if (!newVal) return null
      console.log('campus watch', newVal)
      const foo = await this.getCollegeCampi(newVal.id)
      console.log('campi', foo)
      return newVal
    },
  }, // watch

  mounted() {
    // Popullate colleges
    if (!this.colleges) {
      this.$store.dispatch('colleges/getColleges', null, { root: true })
    }
    if (isNil(this.academicProfile)) {
      this.$store.dispatch('academicProfile/getAcademicProfile', null, {
        root: true,
      })
    }
  }, // mounted
  methods: {
    ...mapActions('colleges', ['getCollegeCampi']),
    ...mapActions('academicProfile', ['triggerUpdateAcademicProfile']),
    randomName(names) {
      const result = names[Math.floor(Math.random(names.length) * 10)]
      console.log('names', names)
      return result && result.name ? result.name : null
    }, // randomName
    reset() {
      this.college = null
      this.campus = null
      this.hideFields = true
    }, // reset
    save() {
      if (isNil(this.fullCollege.college.id)) {
        this.localMessage = new Message({
          type: 'error',
          message: 'Debe elegir una universidad',
        })
        return
      }
      this.hideFields = true
      this.triggerUpdateAcademicProfile({
        documentName: 'degree',
        ...this.fullCollege,
      })
      this.localMessage = new Message({
        type: 'success',
        message: 'Universidad actualizada',
      })
    },
  }, // methods
}
</script>
<style scoped>
.title {
  white-space: pre-wrap;

  /*this stops the word breaking*/
  word-break: keep-all;
}
</style>
