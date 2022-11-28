<template>
  <v-sheet light class="black--text">
    <v-sheet
      class="title text-h4 text-capitalize text-center ma-3"
      :color="requestStatus.color"
      dark
    >
      {{ requestStatus.string }}
    </v-sheet>
    <h2 v-if="model && model.errors" class="error">
      <ul v-for="error in model.errors" :key="error.field.label">
        <li>{{ error.field.label }} >> {{ error.error }}</li>
      </ul>
    </h2>
    <h2>
      <v-card v-if="isRequestComplete" :class="requestStatus.color">
        <v-card-text class="white--text text-h5">
          Usted ya ha realizado esta solicitud.
          <br />
          Si desea ver los archivos de este documento,
          <br />
          por favor diríjase a la sección de
          <router-link :to="{ name: 'documents' }">
            "Mis Documentos"
          </router-link>
        </v-card-text>
      </v-card>
    </h2>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Requisitos
          <template v-slot:actions>
            <v-icon color="primary">mdi-plus</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ol>
            <li>
              Ser médico cirujano debidamente autorizado para ejercer la
              medicina en México.
            </li>

            <li>
              Copia del título y cédula profesional de la licenciatura en
              medicina.
            </li>
            <li>
              Examen Nacional de Aspirantes a Residencias Médicas (ENARM),
              realizado por la Comisión Interinstitucional para la Formación de
              Recursos Humanos para la Salud (CIFRHS); Copia de la constancia de
              haber efectuado y aprobado el Examen Nacional de Aspirantes a
              Residencias Médicas (ENARM), realizado por la Comisión
              Interinstitucional para la Formación de Recursos Humanos para la
              Salud (CIFRHS);
            </li>
            <li>
              En el caso de Urgencias Pediátricas deberá entregar además el
              diploma institucional y diploma de la institución educativa
              (universitaria) que lo avala en Pediatría.
            </li>
            <li>
              En el caso de Urgencias Pediátricas, constancia de haber terminado
              satisfactoriamente una residencia progresiva hospitalaria de por
              lo menos 2 años.
            </li>
            <li>
              Copia del diploma institucional en Medicina de Urgencias o en su
              caso Urgencias Pediatricas.
            </li>
            <li>
              Copia del diploma de la institución educativa (Universitaria) que
              lo avala.
            </li>
            <li>
              Tres fotografías oval tamaño diploma (5x7cm) blanco y negro, con
              fondo blanco, vestimenta formal. Con nombre completo al reverso
              (con tinta).
            </li>
            <li>
              Imprimir, llenar completamente y anexar la solicitud de
              Certificación
            </li>
            <li>
              Vigente en Medicina de Urgencias o Urgencias Pediátricas según sea
              el caso. (Descargar de la página web del Consejo).
            </li>
            <li>Curriculum vitae</li>
            <li>Donativo no reembolsable de $ 5,700. 00/100 m.n.</li>
          </ol>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-stepper
      v-model="curr"
      color="primary"
      vertical
      outlined
      non-linear
      elevation="0"
    >
      <validation-observer v-slot="{ invalid }">
        <span v-for="(step, n) in steps" :key="n">
          <validation-provider v-slot="{ validate, reset }">
            <v-stepper-header>
              <v-stepper-step
                :color="stepStatus(n + 1)"
                :complete="isRequestComplete || stepComplete(n + 1)"
                :rules="[value => !invalid]"
                :step="n + 1"
              >
                {{ startCase($t('document.types')[step.name]) }}
              </v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content :step="n + 1">
                <v-sheet v-if="step.description" hidden class="flat">
                  <p>{{ step.description }}</p>
                </v-sheet>
                <v-sheet
                  :color="documentStatus(document(step.name)).color"
                  class="pa-3 primary--text"
                >
                  <p class="text-h4 text-capitalize">
                    {{ documentStatus(document(step.name)).string }}
                  </p>
                  <upload-document
                    v-if="documentStatus(document(step.name)).isEditable"
                    :document="step"
                    :show-files="
                      getEventFiles(
                        currentUserEvent.documents &&
                          currentUserEvent.documents[step.name]
                          ? currentUserEvent.documents[step.name]
                          : null
                      )
                    "
                    @document-created="updateEvent"
                  ></upload-document>
                </v-sheet>
                <v-btn
                  v-if="n < steps.length - 1"
                  class="ma-3"
                  :disabled="
                    isNil(document(step.name)) && step.required && !disableNext
                  "
                  color="primary"
                  @click="
                    nextStep(n)
                    disableNext = false
                  "
                >
                  {{ $t('actions.continue') }}
                </v-btn>
                <v-btn
                  v-if="n + 1 === steps.length"
                  class="ma-3"
                  color="success"
                  @click="done()"
                >
                  Terminar
                </v-btn>
                <v-btn
                  v-if="n > 0"
                  text
                  @click="
                    curr = n
                    disableNext = true
                  "
                >
                  Atrás
                </v-btn>
              </v-stepper-content>
            </v-stepper-items>
          </validation-provider>
        </span>
      </validation-observer>
    </v-stepper>
    <!-- steps -->
  </v-sheet>
</template>
<script>
import { startCase, isNil } from 'lodash'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

import UploadDocument from '@/components/UploadDocument.vue'

export default {
  components: { UploadDocument },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    //
    invalid: true,
    disableNext: false,
    curr: 1,
    files: [],
    // <!--TODO: Move this elsewhere-->
    steps: [
      {
        longName: 'Sede de aplicación',
        name: 'examLocation',
        placeholder: 'Luagr de aplicación de examen',
        upload: false,
        required: false,
        fields: [
          {
            label: 'examLocation',
            name: 'examLocation',
            placeholder: 'Lugar de aplicación de examen',
            type: 'fieldExamLocation',
            rules: { required: true },
          },
        ], // fields
      },
      {
        longName: 'Fotografía del sustentante',
        name: 'mugshot',
        placeholder: 'Fotografía',
        required: true,
        upload: true,
        // fields: [
        //   {
        //     label: 'examLocation',
        //     name: 'examLocation',
        //     placeholder: 'Lugar de aplicación de examen',
        //     type: 'fieldExamLocation',
        //     rules: { required: true },
        //   },
        // ], // fields
      },
      {
        longName: 'Comprobante de donativo',
        placeholder: 'Donativo',
        name: 'voucher',
        upload: true,
        required: true,
      },
      {
        longName: 'Título de Licenciatura en Medicina',
        name: 'degreeDiploma',
        placeholder: 'Título',
        required: 'true',
        upload: true,
        fields: [
          {
            label: 'university',
            name: 'university',
            placeholder: 'Título',
            type: 'fieldUniversity',
            rules: { required: true },
          },
        ],
      },
      {
        longName:
          'Constancia de ENARM o Equivalente (Carta de aceptación a la especialidad de urgencias)',
        placeholder: 'ENARM',
        name: 'enarm',
        upload: true,
        required: true,
        fields: [
          {
            label: `comment`,
            name: 'comment',
            placeholder: 'Comentario sobre el documento',
            type: 'CommentField',
            rules: { required: false, length: { max: 160, min: 0 } },
            counter: true,
          },
        ],
      },
      {
        longName: 'Cédula de licenciatura',
        name: 'license',
        upload: true,
        required: true,
        placeholder: 'Cédula profesional',
      },
      {
        longName:
          'Constancia de haber terminado satisfactoriamente una residencia progresiva  hospitalaria en medicina de urgencias, de por lo menos 3 años',
        name: 'postDegreeCertificate',
        upload: true,
        required: true,
        placeholder: 'Constancia de residencia',
      },
      {
        longName:
          'Diploma Institucional (IMSS, ISSSTE o Secretaría de Salud de Urgencias)',
        name: 'postDegreeDiploma',
        upload: true,
        required: true,
        placeholder: 'Diploma instituional',
      },
      {
        longName:
          'Diploma de especialidad Universitario o Carta compromiso por dicho diploma',
        name: 'postgraduateUniversitaryDiploma',
        placeholder: 'Diploma de especialidad/Carta compromiso',
        upload: true,
        required: true,
        fields: [
          {
            label: 'university',
            name: 'university',
            placeholder: 'Universidad',
            type: 'fieldUniversity',
            rules: { required: true },
          },
        ],
      },
      {
        longName: 'Último paso',
        name: 'final',
        description:
          'Ha almacenado exitosamente los documentos una vez que sea aprobada su solicitud recibirá un correo electrónico informándole',
        required: false,
      },
    ],
    model: {},
    // wizard
    errorMsg: null,
    isFinished: false,
  }),
  computed: {
    ...mapState('events', [
      'currentEvent',
      'userEvents',
      'eventCreationPending',
      'eventCreationMessage',
    ]),
    ...mapState('documents', [
      'documentNameToCreate',
      'documentCreationPending',
      'documentCreationMessage',
    ]),
    ...mapGetters('events', ['getUserEvent']),
    currentUserEvent() {
      return this.getUserEvent(this.id)
    },

    isRequestComplete() {
      console.log('isRequestComplete')
      console.log(this.currentUserEvent.status)
      if (isNil(this.currentUserEvent)) return false
      if (this.currentUserEvent.completed) return false
      if (this.currentUserEvent.status !== 'accepted') return false
      return true
    }, // isComplete

    requestStatus() {
      return {
        color: this.$t(`requests.colors.${this.currentUserEvent.status}`),
        status: this.currentUserEvent.status,
        string: this.$t(`requests.${this.currentUserEvent.status}`),
      }
    }, // requestStatus
    // TODO disableNext with getter and setter to add the required feature so the user can skip some steps
  },
  watch: {},
  mounted() {
    if (isNil(this.currentUserEvent)) this.setEvent()
  },
  methods: {
    ...mapActions('documents', ['triggerAddDocumentAction']),
    ...mapMutations('documents', [
      'setDocumentNameToCreate',
      'setDocumentCreationMessage',
    ]),
    ...mapMutations('events', ['setCurrentEvent']),
    ...mapActions('events', [
      'setUserEvent',
      'updateUserEvent',
      'setCurrentEventComplete',
    ]),
    ...mapActions('documents', ['createUserDocument']),
    document(name) {
      if (isNil(name)) return null
      if (isNil(this.currentUserEvent)) return null
      if (isNil(this.currentUserEvent.documents)) return null
      console.log('this.currentUserEvent')
      console.log(this.currentUserEvent)
      return this.currentUserEvent.documents[name]
        ? this.currentUserEvent.documents[name]
        : null
    }, // document
    documentStatus(document) {
      if (!document) {
        document = {
          color: 'cyan lighten-1',
          exists: false,
          status: 5,
          string: this.$t(`document.statusKey.new`),
          isRejected: false,
          isEditable: true,
        }
      }
      return {
        color: this.$t(`document.statusColor.${document.status}`),
        exists: isNil(document),
        status: document.status,
        string: this.$t(`document.statusKey.${document.status}`),
        isRejected: () => {
          return document.status === 'rejected'
        },
        isEditable: () => {
          return document.status !== 'accepted'
        },
      }
    }, // documentStatus
    startCase(string) {
      return startCase(string)
    },
    isNil(value) {
      return isNil(value)
    },
    async validateForm() {
      console.log('validating form from refs')
      const result = await this.$refs.stepForm.validate()
      this.invalid = result
      return result
    },
    getEventFiles(value) {
      console.log('getEventFiles', value)
      return !isNil(value) && !isNil(value.files)
        ? Object.values(value.files)
        : null
    },
    saveDocument(n) {
      this.setDocumentNameToCreate(this.step[n].name)
      this.triggerAddDocumentAction(this.formModel)
      this.isFinished = true
    },
    setEvent() {
      console.log('running setEvent: ', this.id)
      if (isNil(this.currentUserEvent)) {
        this.setUserEvent(this.id)
      }
    },
    updateEvent(val) {
      // const data = {}
      // data.documents = val
      this.updateUserEvent({ id: this.id, documents: { ...val } })
      this.disableNext = true
    },
    createLocalDocument(document, n) {
      if (isNil(document) || isNil(this.files[n])) return
      document.upload = [this.files[n]]
      this.createUserDocument(document)
    },
    // Steps
    nextStep(n) {
      this.curr = n + 2
      this.setDocumentCreationMessage({ type: null, message: null })
      // TODO Add loader 202112.02-18.50
    },
    stepComplete(step) {
      return this.curr > step
    },
    stepStatus(step) {
      return this.curr > step ? `success` : `info`
    },
    validate(n) {
      this.steps[n].valid = false
      const v = this.$refs.stepForm[n].validate()
      if (v) {
        console.clear()
        this.steps[n].valid = true
        this.createLocalDocument(
          {
            name: 'Documento de prueba, por favor ignore',
            upload: { name: 'foo' },
          },
          n
        )
        // TODO do some timeout and a loader to give better feedback
        // continue to next
        // this.curr = n + 2
      }
    },
    done() {
      this.setCurrentEventComplete({
        id: this.id,
        completed: true,
      })
      this.curr = this.steps.length + 1
      this.$router.push({ name: 'home' })
    },
    getURL(file) {
      if (!isNil(file)) {
        return URL.createObjectURL(file)
      }
      return null
    },
    // form wizard
    onComplete() {
      // TODO feedback and query to link to home
      this.$router.push({ name: 'home' })
    },
    setLoading(value) {
      console.log(value)
      // TODO add a proper loadder
      // this.loadingWizard = value
    },
  },
}
</script>
<style lang="scss"></style>
