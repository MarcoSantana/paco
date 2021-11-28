<template>
  <div class="box">
    ID::>> {{ id }}
    <!-- <h2>
         TODO Here we must check if there is an active request event (aviable certification exams) and if the user already
         started the process 202111.25-18.46
         </h2> -->
    <h2 v-if="model && model.errors" class="error">
      <ul v-for="error in model.errors" :key="error.field.label">
        <li>{{ error.field.label }} >> {{ error.error }}</li>
      </ul>
    </h2>
    <h2>Requisitos para solicitar Certificación</h2>
    <div>
      <h3>
        **Importante**
      </h3>
      <div>
        Todos los documentos solicitados deberán estar digitalizados en formato PDF o JPG. Y cargados en esta plataforma
      </div>
    </div>
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

    <v-stepper v-for="(myStep, index) in stepperSteps" :key="myStep.name" v-model="e6" vertical>
      <!--TODO: rename this model-->
      <v-stepper-step :complete="e6 >= index" :step="index + 1">
        {{ myStep.name }}
      </v-stepper-step>
      <v-stepper-content :step="index">
        <v-card color="grey lighten-1" class="mb-12" height="200px">
          <span v-if="myStep.upload">
            <v-file-input v-model="foo[index]" counter show-size truncate-length="15" />
          </span>
          <!--TODO: add proper styling looks like crap -->
          <!--TODO: Validation to disable next button, validation must come ALSO form fb storage -->
          <v-img
            v-if="foo[index] && (foo[index].type === 'image/png' || foo[index].type === 'image/jpeg')"
            contain
            lazy-src="https://picsum.photos/id/11/10/6"
            max-height="150"
            max-width="250"
            :src="getURL(foo[index])"
          />
          <object v-if="foo[index] && foo[index].type === 'application/pdf'" :data="getURL(foo[index])" />
        </v-card>
        <v-btn color="primary" @click="e6 = index + 1">
          Continuar
        </v-btn>
        <v-btn text>
          Cancelar
        </v-btn>
      </v-stepper-content>
    </v-stepper>
    <!-- steps -->
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'
import { isNil } from 'lodash'
// import { get, isEmpty, isNil } from 'lodash'

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    foo: [],
    currentIsValid: false,
    e6: 0,
    // <!--TODO: Move this elsewhere-->
    // TODO Use the dynamic component load to upload the apropiate file
    stepperSteps: [
      {
        name: 'Copia del título y cédula profesional de la licenciatura en medicina.',
        upload: true,
        // TODO: Put here everything you need to create the upload event
        // TODO: Validation rules
        // TODO put here the props for the file component
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
    ],
    model: {},
    // wizard
    errorMsg: null,
    isFinished: false,
  }),
  computed: {
    ...mapState('forms', ['currentForm', 'formNameToCreate']),
    ...mapState('documents', ['documentCreationPending', 'documentCreationMessage']),
  },
  watch: {},
  mounted() {
    // this.setFormNameToCreate('Solicitud de examen')
  },
  methods: {
    ...mapActions('documents', ['triggerAddDocumentAction']),
    ...mapMutations('documents', ['setDocumentNameToCreate', 'setDocumentCreationMessage']),
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
    // vfg
    // onValidated(isValid, errors) {
    //   this.errorMsg = errors
    //   this.currentIsValid = isValid
    //   // this.currentIsValid = true
    // },
    // Reset the form state
    reset() {
      this.model = {}
      this.isFinished = false
      this.setDocumentCreationMessage({})
      this.setDocumentNameToCreate = null
      this.$refs.wizard.reset()
    },
    getURL(file) {
      if (!isNil(file)) {
        return URL.createObjectURL(file)
      }
      return null
    },
    fileIsNil(file) {
      return isNil(file)
    },
    // form wizard
    onComplete() {
      this.$router.push('/home')
    },
    saveDocument() {
      // This might take a while so make it async and show a loader
      // Maybe add a timeout
      // Make a fixed value the request skeleton to improve failsafe
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.setLoading(true)
          try {
            this.setDocumentNameToCreate('Solicitud de certificacion')
            this.triggerAddDocumentAction(this.model)
            this.errorMsg = null
            this.isFinished = true
            resolve(true)
          } catch (error) {
            this.errorMsg = error
            reject(new Error(error))
          } finally {
            this.setLoading(false)
          }
        }, 1000)
      })
    },
    beforeTabSwitch() {
      // eslint-disable-next-line no-alert
      alert('Before tab switch')
      return true
    },
    setLoading(value) {
      console.log(value)
      // this.loadingWizard = value
    },
    // handleErrorMessage(errorMsg) {
    //   if (!isNil(errorMsg) || !isEmpty(errorMsg)) this.errorMsg = errorMsg
    //   // TODO Give this better style
    //   this.errorMsg = this.model.errors
    //   // this.$store.state.currentForm.errors.push(errorMsg)
    //   console.log('errorMsg: ', errorMsg)
    //   return true
    // },
    // TODO recycle me
    validateAsync() {
      return new Promise((resolve, reject) => {
        this.setLoading(true)
        setTimeout(() => {
          if (!this.currentIsValid) {
            // const msg = this.errorMsg
            const msg = 'Complete este paso antes de pasar al siguiente'
            this.errorMsg = this.model.errors
            this.errorMsg = msg
            reject(new Error(msg))
          } else {
            this.currentIsValid = false
            this.errorMsg = null
            resolve(true)
          }
          this.setLoading(false)
        }, 1000)
      })
    },
  },
}
</script>
<style lang="scss"></style>
