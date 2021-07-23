<template>
  <div class="box">
    <h2 v-if="model && model.errors" class="error">
      <ul v-for="error in model.errors" :key="error.field.label">
        <li>{{ error.field.label }} >> {{ error.error }}</li>
      </ul>
    </h2>
    <form-wizard
      ref="wizard"
      shape="tab"
      step-size="xs"
      color="#2596c7"
      error-color="#e74c3c"
      title="Solicitud de certificación"
      subtitle="Pasos de solicitud"
      finish-button-text="Terminado"
      @on-complete="onComplete()"
    >
      <tab-content title="Requisitos" class="requirements">
        <h2>Requisitos para solicitar Certificación</h2>
        <div>
          <h3>
            **Importante**
          </h3>
          <div>
            Todos los documentos solicitados deberán estar digitalizados en formato PDF o JPG. Y cargados en esta
            plataforma
          </div>
        </div>
        <div>
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
              nombre csompleto al reverso (con tinta).
            </li>
            <li>Imprimir, llenar completamente y anexar la solicitud de Certificación</li>
            <li>
              Vigente en Medicina de Urgencias o Urgencias Pediátricas según sea el caso. (Descargar de la página web
              del Consejo).
            </li>
            <li>Curriculum vitae</li>
            <li>Donativo no reembolsable de $ 5,700. 00/100 m.n.</li>
          </ol>
        </div>
      </tab-content>
      <tab-content v-for="item in groups" :key="item.legend" :before-change="validateAsync" :title="item.legend">
        <div v-if="!!errorMsg && errorMsg.length > 1" class="field-wrap">
          <h3>{{ errorMsg }}</h3>
        </div>
        <vue-form-generator
          :ref="getAttrs(item.fields)"
          :schema="item"
          :model="model"
          :options="formOptions"
          @validated="onValidated"
          @model-updated="updateCurrentForm"
        >
        </vue-form-generator>
      </tab-content>
      <tab-content title="Guardar">
        <div :class="documentCreationMessage.type">{{ documentCreationMessage.message }}</div>
        <button
          v-if="!isFinished"
          :disabled="documentCreationPending"
          class="form-wizard-button"
          @click="saveDocument()"
        >
          Guardar
        </button>
      </tab-content>
      <tab-content title="Siguientes pasos">
        Aquí ponemos los siguientes pasos a para el aspirante
      </tab-content>
      <div v-if="loadingWizard" class="loader"></div>
      <span slot="prev">
        <!-- TODO call reset method 202107.18-20.12 -->
        <button
          v-show="!isFinished"
          class="reset-button"
          @click="
            model = {}
            $refs.wizard.reset()
          "
        >
          Borrar formulario
        </button>
      </span>
      <button slot="next" class="form-wizard-button" data-test="document-next-btn">
        Adelante
      </button>
    </form-wizard>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'
import { get, isEmpty, isNil } from 'lodash'
import 'vue-form-generator/dist/vfg'
import cmmuCertificationSchema from '@/components/cmmuCertificationSchema'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default {
  components: { 'form-wizard': FormWizard, 'tab-content': TabContent },
  mixins: [cmmuCertificationSchema],
  data: () => ({
    currentIsValid: false,
    steps: [],
    formOptions: {
      validateAfterLoad: false,
      validateAfterChanged: true,
      validateAsync: false,
      validateBeforeSubmit: true,
    },
    model: {},
    // wizard
    loadingWizard: false,
    count: 0,
    errorMsg: null,
    isFinished: false,
  }),
  computed: {
    ...mapState('forms', ['currentForm', 'formNameToCreate']),
    ...mapState('documents', ['documentCreationPending', 'documentCreationMessage']),
    groups() {
      return this.schema.groups
    },
  },
  watch: {},
  mounted() {
    this.setFormNameToCreate('Solicitud de examen')
    // Reset the form state
  },
  methods: {
    ...mapMutations('forms', ['setFormNameToCreate']),
    ...mapMutations('documents', ['setDocumentNameToCreate', 'setDocumentCreationMessage']),
    ...mapActions('forms', ['triggerAddCurrentFormAction', 'triggerAddFormAction']),
    ...mapActions('documents', ['triggerAddDocumentAction']),
    ...mapGetters('forms', ['getCurrentForm']),
    getAttrs(vnode) {
      return get(vnode[0], 'attributes.input.data-test', {})
    },
    updateCurrentForm() {
      this.triggerAddCurrentFormAction(this.model)
    },
    // vfg
    onValidated(isValid, errors) {
      this.errorMsg = errors
      this.currentIsValid = isValid
      // this.currentIsValid = true
    },
    // Reset the form state
    reset() {
      this.model = {}
      this.isFinished = false
      this.setDocumentCreationMessage({})
      this.setDocumentNameToCreate = null
      this.$refs.wizard.reset()
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
      this.loadingWizard = value
    },
    handleErrorMessage(errorMsg) {
      if (!isNil(errorMsg) || !isEmpty(errorMsg)) this.errorMsg = errorMsg
      // TODO Give this better style
      this.errorMsg = this.model.errors
      // this.$store.state.currentForm.errors.push(errorMsg)
      console.log('errorMsg: ', errorMsg)
      return true
    },
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
<style lang="scss">
@import '@/theme/style.scss';
@import '@/theme/variables.scss';
.requirements {
  padding: 1.5rem;
  @extend .box;
  div {
    padding: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 75%;
  }
  ol {
    background-color: $light-accent;
    :nth-child(2n + 1) {
      background-color: $light-accent-1;
    }
  }
}
.reset-button {
  @extend .form-wizard-button;
  background-color: lighten($danger-color, 10%);
  color: darken($danger-color, 40%);
}

fieldset {
  margin-top: 1.75rem;
  border: none;
  h1 {
    color: $main;
  }
  legend {
    font-size: 1.5rem;
    color: $main;
    padding-bottom: 0.75rem;
  }
}
/* form wizard */
.loader,
.loader:after {
  border-radius: 75%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(255, 255, 255, 0.2);
  border-right: 1.1em solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
  border-left: 1.1em solid $secondary;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

fieldset {
  border-style: dotted;
  border-color: $light-accent;
}
.field-wrap {
  color: red;
}

.file-upload {
  :hover {
    background: $light-accent;
  }

  label {
    opacity: 0.8; // This makes visible the label wich is behind
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: $light-accent-1;
    color: $main;
    min-height: 80px; /* minimum height */
    cursor: pointer;
    position: relative;
    cursor: pointer;
    font-size: 1.2em;
    display: grid;
    place-items: center;
    margin-top: 3.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    & span {
      margin-left: 1rem;
      margin-right: 1rem;
    }

    @include respond(tablet) {
      // responsive code for tablet viewport i.e. 600px
      max-height: 50px;
      width: 100%;
    }

    @include respond(mobile) {
      // responsive code for mobile viewport i.e. 480px
      font-size: 0.8rem;
    }
  }
}
</style>
