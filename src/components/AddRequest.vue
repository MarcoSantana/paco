<template>
  <div>
    <h2>Requisitos para solicitar Certificación</h2>
    <div>
      <h3>**Importante**</h3>
      <div>
        Todos los documentos solicitados deberán estar digitalizados en formato PDF o JPG. Y cargados en esta plataforma
      </div>
    </div>
    <!--
     // TODO Put this into an accordion
     -->
    <div>
      <ol>
        <li>Ser médico cirujano debidamente autorizado para ejercer la medicina en México.</li>
        <li>Copia del título y cédula profesional de la licenciatura en medicina.</li>
        <li>
          Examen Nacional de Aspirantes a Residencias Médicas (ENARM), realizado por la Comisión Interinstitucional para
          la Formación de Recursos Humanos para la Salud (CIFRHS); Copia de la constancia de haber efectuado y aprobado
          el Examen Nacional de Aspirantes a Residencias Médicas (ENARM), realizado por la Comisión Interinstitucional
          para la Formación de Recursos Humanos para la Salud (CIFRHS);
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
          Tres fotografías oval tamaño diploma (5x7cm) blanco y negro, con fondo blanco, vestimenta formal. Con nombre
          completo al reverso (con tinta).
        </li>
        <li>Imprimir, llenar completamente y anexar la solicitud de Certificación</li>
        <li>
          Vigente en Medicina de Urgencias o Urgencias Pediátricas según sea el caso. (Descargar de la página web del
          Consejo).
        </li>
        <li>Curriculum vitae</li>
        <li>Donativo no reembolsable de $ 5,700. 00/100 m.n.</li>
      </ol>
    </div>

    <v-stepper v-model="curr" color="green">
      <v-stepper-content v-for="(step, n) in steps" :key="n" :step="n + 1">
        <!-- //TODO the header looks like shit 202112.02-17.13 -->
        <v-stepper-header class="overflow-x-auto mb-3">
          <v-stepper-step
            :complete="stepComplete(n + 1)"
            :step="n + 1"
            :rules="[value => !!step.valid]"
            :color="stepStatus(n + 1)"
            >{{ step.name }}</v-stepper-step
          >
        </v-stepper-header>
        <v-card class="mx-auto" max-width="500">
          <v-fade-transition>
            <!-- // TODO Add a better lazy-src 202112.02-17.14 -->
            <v-img
              v-if="files[n] && (files[n].type === 'image/png' || files[n].type === 'image/jpeg')"
              class="ma-5"
              contain
              lazy-src="https://picsum.photos/id/11/10/6"
              max-height="150"
              max-width="250"
              :src="getURL(files[n])"
            />
          </v-fade-transition>
          <v-fade-transition>
            <object
              v-if="files[n] && files[n].name && files[n].type === 'application/pdf'"
              class="ma-5"
              style="max-width: 500px; min-width: 344px; min-height: 500px;"
              :data="getURL(files[n])"
            />
          </v-fade-transition>
          <v-card-text v-if="step.upload">
            <v-form :ref="'stepForm'" v-model="step.valid" lazy-validation>
              <v-file-input
                v-if="step.upload"
                :ref="step.refName"
                v-model="files[n]"
                :rules="step.rules"
                accept="image/png, image/jpeg, application/pdf"
                :placeholder="step.placeholder"
                counter
                show-size
                truncate-length="15"
                required
              />
            </v-form>
            <v-alert v-if="documentCreationMessage.message" dense text :type="documentCreationMessage.type">
              {{ documentCreationMessage.message }}
            </v-alert>
            <v-btn
              v-if="documentCreationMessage.type !== 'success'"
              color="success"
              :disabled="!step.valid"
              @click="validate(n)"
            >
              Guardar
              <v-icon right dark>
                mdi-cloud-upload
              </v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
        <v-btn v-if="n + 1 < steps.length + 1" color="primary" :disabled="!step.valid" @click="nextStep(n)"
          >Continuar</v-btn
        >
        <v-btn v-else color="success" @click="done()">Terminar</v-btn>
        <v-btn text @click="curr = n">Atrás</v-btn>
      </v-stepper-content>
    </v-stepper>
    <!-- steps -->
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { isNil } from 'lodash'

// TODO move this elsewhere 202112.02-17.22
// Rules
const required = value => !!value || 'Este campo es obligatorio'
const maxSize = (value, max) => !value || value.size < max || `El archivo no puede exceder los ${max / 1000000} Mb`
// const minSize = (value, min) => !value || value.size < min || `El archivo no puede ser menor a los ${min / 1000000} Mb`

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    curr: 1,
    files: [],
    // <!--TODO: Move this elsewhere-->
    steps: [
      {
        name: 'Copia del título y cédula profesional de la licenciatura en medicina.',
        upload: true,
        // TODO separate this into functions to reuse them
        rules: [value => maxSize(value, 2000000), value => required(value)],
        placeholder: 'Título profesional',
        refName: 'titulo',
        valid: false,
        // TODO: Put here everything you need to create the upload event
        // TODO put here the props for the image component
      },
      {
        name:
          ' Examen Nacional de Aspirantes a Residencias Médicas (ENARM), realizado por la Comisión Interinstitucional para la Formación de Recursos Humanos para la Salud (CIFRHS); Copia de la constancia de haber efectuado y aprobado el Examen Nacional de Aspirantes a Residencias Médicas (ENARM), realizado por la Comisión Interinstitucional para la Formación de Recursos Humanos para la Salud (CIFRHS); ',
      },
      {
        name:
          ' En el caso de Urgencias Pediátricas deberá entregar además el diploma institucional y diploma de la institución educativa (universitaria) que lo avala en Pediatría. ',
      },
      {
        name:
          ' En el caso de Urgencias Pediátricas, constancia de haber terminado satisfactoriamente una residencia progresiva hospitalaria de por lo menos 2 años. ',
      },
      { name: 'Copia del diploma institucional en Medicina de Urgencias o en su caso Urgencias Pediatricas.' },
      { name: 'Copia del diploma de la institución educativa (Universitaria) que lo avala.' },
      {
        name:
          ' Tres fotografías oval tamaño diploma (5x7cm) blanco y negro, con fondo blanco, vestimenta formal. Con nombre completo al reverso (con tinta). ',
      },
      { name: 'Donativo no reembolsable de $ 5,700. 00/100 m.n.' },
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
  },
  watch: {},
  mounted() {
    // this.setFormNameToCreate('Solicitud de examen')
    this.setEvent()
  },
  methods: {
    ...mapActions('documents', ['triggerAddDocumentAction']),
    ...mapMutations('documents', ['setDocumentNameToCreate', 'setDocumentCreationMessage']),
    ...mapActions('events', ['setUserEvent']),
    ...mapActions('documents', ['createUserDocument']),

    // <!--TODO: Add a method/action to update the document(fb) onModify (or whatever its called)-->
    // ...mapMutations('forms', ['setFormNameToCreate']),
    // ...mapActions('forms', ['triggerAddCurrentFormAction', 'triggerAddFormAction']),
    // ...mapGetters('forms', ['getCurrentForm']),
    // getAttrs(vnode) {
    //   return get(vnode[0], 'attributes.input.data-test', {})
    // },
    // updateCurrentForm() {
    //   this.triggerAddCurrentFormAction(this.model)
    // },
    saveDocument(n) {
      this.setDocumentNameToCreate(this.step[n].name)
      this.triggerAddDocumentAction(this.formModel)
      this.isFinished = true
    },
    setEvent() {
      if (isNil(this.currentUserEvent)) {
        this.setUserEvent(this.id)
      }
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
