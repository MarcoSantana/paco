<template>
  <div class="box">
    <h2 v-if="model && model.errors" class="error">
      <ul v-for="error in model.errors" :key="error.field.label">
        <li>{{ error.field.label }} >> {{ error.error }}</li>
      </ul>
    </h2>
    <h2>
      <div v-if="currentRequest" class="error">
        Usted ya ha realizado esta solicitud. <br />
        Si desea ver los archivos de este documento, <br />
        por favor diríjase a la sección de <router-link to="documents">"Mis Documentos"</router-link>
      </div>
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
            <li>Ser médico cirujano debidamente autorizado para ejercer la medicina en México.</li>

            <li>Copia del título y cédula profesional de la licenciatura en medicina.</li>
            <li>
              Examen Nacional de Aspirantes a Residencias Médicas (ENARM), realizado por la Comisión Interinstitucional
              para la Formación de Recursos Humanos para la Salud (CIFRHS); Copia de la constancia de haber efectuado y
              aprobado el Examen Nacional de Aspirantes a Residencias Médicas (ENARM), realizado por la Comisión
              Interinstitucional para la Formación de Recursos Humanos para la Salud (CIFRHS);
            </li>
            <li>
              En el caso de Urgencias Pediátricas deberá entregar además el diploma institucional y diploma de la
              institución educativa (universitaria) que lo avala en Pediatría.
            </li>
            <li>
              En el caso de Urgencias Pediátricas, constancia de haber terminado satisfactoriamente una residencia
              progresiva hospitalaria de por lo menos 2 años.
            </li>
            <li>Copia del diploma institucional en Medicina de Urgencias o en su caso Urgencias Pediatricas.</li>
            <li>Copia del diploma de la institución educativa (Universitaria) que lo avala.</li>
            <li>
              Tres fotografías oval tamaño diploma (5x7cm) blanco y negro, con fondo blanco, vestimenta formal. Con
              nombre completo al reverso (con tinta).
            </li>
            <li>Imprimir, llenar completamente y anexar la solicitud de Certificación</li>
            <li>
              Vigente en Medicina de Urgencias o Urgencias Pediátricas según sea el caso. (Descargar de la página web
              del Consejo).
            </li>
            <li>Curriculum vitae</li>
            <li>Donativo no reembolsable de $ 5,700. 00/100 m.n.</li>
          </ol>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-stepper v-model="curr" color="primary">
      <v-stepper-content v-for="(step, n) in steps" :key="n" :step="n + 1">
        <validation-observer v-slot="{ invalid }">
          <v-stepper-step
            :complete="stepComplete(n + 1)"
            :step="n + 1"
            :rules="[value => !invalid]"
            :color="stepStatus(n + 1)"
            >{{ step.longName }}</v-stepper-step
          >
          <upload-document
            v-show="step.upload"
            :document="step"
            :show-files="
              getEventFiles(
                currentUserEvent.documents && currentUserEvent.documents[step.name]
                  ? currentUserEvent.documents[step.name]
                  : null
              )
            "
            @document-created="updateEvent"
          ></upload-document>
          <v-btn
            v-if="n + 1 < steps.length + 1"
            :disabled="!disableNext"
            color="primary"
            @click="
              nextStep(n)
              disableNext = false
            "
            >{{ $t('actions.continue') }}</v-btn
          >
          <v-btn v-else color="success" @click="done()">Terminar</v-btn>
          <v-btn
            v-if="n > 0"
            text
            @click="
              curr = n
              disableNext = true
            "
            >Atrás</v-btn
          >
        </validation-observer>
      </v-stepper-content>
    </v-stepper>
    <!-- steps -->
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { isNil } from 'lodash'
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
        longName:
          'Examen Nacional de Aspirantes a Residencias Médicas (ENARM), realizado por la Comisión Interinstitucional para la Formación de Recursos Humanos para la Salud (CIFRHS); Copia de la constancia de haber efectuado y aprobado el ENARM, CIFRHS',
        name: 'enarm',
        upload: true,
        required: true,
        fields: [
          {
            label: `comment`,
            name: 'comment',
            placeholder: 'Comentario sobre el documento',
            type: 'v-text-field',
            rules: { required: false, length: { max: 160, min: 0 } },
            counter: true,
          },
        ],
      },
      {
        longName:
          ' En el caso de Urgencias Pediátricas deberá entregar además el diploma institucional y diploma de la institución educativa (universitaria) que lo avala en Pediatría. ',
        name: 'diplomas',
        upload: true,
        required: false,
        fields: [
          {
            label: 'comment',
            name: 'comment',
            placeholder: 'Comentario sobre el documento',
            type: 'v-text-field',
            rules: { required: false, length: { max: 160, min: 0 } },
            counter: true,
          },
        ],
      },
      {
        longName:
          ' En el caso de Urgencias Pediátricas, constancia de haber terminado satisfactoriamente una residencia progresiva hospitalaria de por lo menos 2 años. ',
        name: 'pediatricVoucher',
        upload: true,
        required: false,
        fields: [
          {
            label: 'comment',
            name: 'comment',
            placeholder: 'Comentario sobre el documento',
            type: 'v-text-field',
            rules: { required: false, length: { max: 160, min: 0 } },
            counter: true,
          },
        ],
      },
      {
        longName: 'Copia del diploma institucional en Medicina de Urgencias o en su caso Urgencias Pediatricas.',
        name: 'specialtyDiploma',
        upload: true,
        required: true,
        fields: [
          {
            label: 'comment',
            name: 'comment',
            placeholder: 'Comentario sobre el documento',
            type: 'v-text-field',
            rules: { required: false, length: { max: 160, min: 0 } },
            counter: true,
          },
        ],
      },
      {
        longName: 'Copia del diploma de la institución educativa (Universitaria) que lo avala.',
        name: 'degreeDiploma',
        upload: true,
        required: true,
        fields: [
          {
            label: 'comment',
            name: 'comment',
            placeholder: 'Comentario sobre el documento',
            type: 'v-text-field',
            rules: { required: false, length: { max: 160, min: 0 } },
            counter: true,
          },
        ],
      },
      {
        longName: 'Fotografía oval tamaño diploma (5x7cm) blanco y negro, con fondo blanco, vestimenta formal.',
        name: 'mugshot',
        upload: true,
        required: true,
        fields: [
          {
            label: 'comment',
            name: 'comment',
            placeholder: 'Comentario sobre el documento',
            type: 'v-text-field',
            rules: { required: false, length: { max: 160, min: 0 } },
            counter: true,
          },
        ],
      },
      {
        longName: 'Donativo no reembolsable de $ 5,700. 00/100 m.n.',
        name: 'voucher',
        upload: true,
        required: true,
        fields: [
          {
            label: 'comment',
            name: 'comment',
            placeholder: 'Comentario sobre el documento',
            type: 'v-text-field',
            rules: { required: false, length: { max: 160, min: 0 } },
            counter: true,
          },
        ],
      },
      { name: 'Solicitud completa' },
    ],
    model: {},
    // wizard
    errorMsg: null,
    isFinished: false,
  }),
  computed: {
    ...mapState('events', ['currentEvent', 'eventCreationPending', 'eventCreationMessage']),
    ...mapState('documents', ['documentNameToCreate', 'documentCreationPending', 'documentCreationMessage']),
    ...mapGetters('events', ['getUserEvent']),
    currentUserEvent() {
      return this.getUserEvent(this.id)
    },
    // TODO disableNext with getter and setter to add the required feature so the user can skip some steps
  },
  watch: {},
  mounted() {
    this.setEvent()
  },
  methods: {
    ...mapActions('documents', ['triggerAddDocumentAction']),
    ...mapMutations('documents', ['setDocumentNameToCreate', 'setDocumentCreationMessage']),
    ...mapMutations('events', ['setCurrentEvent']),
    ...mapActions('events', ['setUserEvent', 'updateUserEvent']),
    ...mapActions('documents', ['createUserDocument']),

    async validateForm() {
      console.log('validating form from refs')
      const result = await this.$refs.stepForm.validate()
      this.invalid = result
      return result
    },
    getEventFiles(value) {
      return !isNil(value) && !isNil(value.files) ? Object.values(value.files) : null
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
      const data = {}
      data.documents = val
      data.currentUserEvent = this.currentUserEvent
      this.updateUserEvent(data)
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
      return this.curr > step ? 'green' : 'blue'
    },
    validate(n) {
      this.steps[n].valid = false
      const v = this.$refs.stepForm[n].validate()
      if (v) {
        console.clear()
        this.steps[n].valid = true
        this.createLocalDocument({ name: 'Documento de prueba, por favor ignore', upload: { name: 'foo' } }, n)
        // TODO do some timeout and a loader to give better feedback
        // continue to next
        // this.curr = n + 2
      }
    },
    done() {
      this.curr = this.steps.length + 1
      // TODO show some loader
      // TODO feedback and query to link to home
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
      this.$router.push('/home')
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
