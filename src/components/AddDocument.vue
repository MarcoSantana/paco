<template>
  <div class="box">
    <form-wizard
      shape="circle"
      ref="standarDocumentWizard"
      step-size="xs"
      color="#2596c7"
      error-color="#e74c3c"
      title="Cargar nuevo documento"
      subtitle="Pasos para cargar documento"
      finish-button-text="Terminado"
      @on-complete="onComplete"
      @on-loading="setLoading"
      @on-validate="handleValidation"
      @on-error="handleErrorMessage"
    >
      <tab-content title="Tipo de documento" :before-change="validateAsync" icon="ti-file">
        <span id="create-document-type-span" class="{ error: errors[0] }">
          <label for="document-type" class="tip"> Tipo de documento </label>
          <select id="document-type" v-model="documentType" name="document-type" @change="reset">
            <option>Seleccione un documento</option>
            <option v-for="item in documents" :key="item.name" :value="item">{{ item.name }}</option>
          </select>
        </span>
      </tab-content>
      <tab-content
        :title="documentType == null ? 'Anexar documento' : 'Anexar ' + documentType.name"
        icon="ti-settings"
      >
        <span v-if="documentType">
          <h2 v-if="documentType">Formulario para anexar {{ documentType.name }}</h2>
          <vue-form-generator :schema="documentType.schema" :model="formModel" :options="formOptions">
          </vue-form-generator>
        </span>
      </tab-content>
      <tab-content title="Guardar">
        <div :class="documentCreationMessage.type">{{ documentCreationMessage.message }}</div>
        <button :disabled="documentCreationPending || isFinished" class="form-wizard-button" @click="saveDocument()">
          Guardar
        </button>
      </tab-content>
      <tab-content title="Fin" icon="ti-check"> </tab-content>
      <div v-if="loadingWizard" class="loader"></div>
      <div v-if="errorMsg">
        <span class="error">{{ errorMsg }}</span>
      </div>
      <button slot="prev" class="form-wizard-button" data-test="document-prev-btn">Atrás</button>
      <button slot="next" class="form-wizard-button" data-test="document-next-btn">Adelante</button>
      <!-- <button slot="finish" class="form-wizard-button">Guardar</button> -->
      <button slot="finish" :disabled="documentCreationPending" class="form-wizard-button">
        Terminar
        <span v-if="documentCreationPending">Almacenando documento</span>
      </button>
    </form-wizard>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import 'vue-form-generator/dist/vfg'
import FormSchema from '@/components/FormsSchema'
import { isNil } from 'lodash'

export default {
  components: {
    'form-wizard': FormWizard,
    'tab-content': TabContent,
  },
  mixins: [FormSchema],
  data: () => ({
    loadingWizard: false,
    errorMsg: null,
    fileURL: null,
    formModel: {},
    isFinished: false,

    formOptions: {
      validateAfterLoad: true,
      validateAfterChanged: true,
      validateAsync: true,
    },
    documentType: null,
  }),
  computed: mapState('documents', ['documentNameToCreate', 'documentCreationPending', 'documentCreationMessage']),
  methods: {
    ...mapMutations('documents', ['setDocumentNameToCreate', 'setDocumentCreationMessage']),
    ...mapActions('documents', ['triggerAddDocumentAction']),
    onComplete() {
      // TODO Do not use alert use your own modal 202106.26-19.52
      // eslint-disable-next-line no-alert
      alert('Terminó la carga del documento')
      this.setDocumentCreationMessage({})
      this.$router.push('/home')
    },
    reset() {
      this.isFinished = false
      this.setDocumentCreationMessage({})
      this.$refs('standarDocumentWizard').reset()
    },
    saveDocument() {
      this.setDocumentNameToCreate(this.documentType.name)
      this.triggerAddDocumentAction(this.formModel)
      this.isFinished = true
    },
    addedFile(file) {
      // eslint-disable-next-line no-alert
      alert(`File added ${file.name}`)
    },
    preview(event) {
      console.log('event.target.files :>> ', event.target.files)
      this.fileURL = URL.createObjectURL(event.target.files[0])
      console.log('this.fileURL :>> ', this.fileURL)
    },
    // vue-form-wizard validation
    setLoading(value) {
      this.loadingWizard = value
    },
    handleValidation(isValid, tabIndex) {
      // TODO use this to validate the presence of the actual file and maybe the complete fields
      console.log(`Tab: ${tabIndex} valid: ${isValid}`)
    },
    handleErrorMessage(errorMsg) {
      // TODO Give this better style
      this.errorMsg = errorMsg
    },
    validateAsync() {
      // TODO use this for all tab validations
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (isNil(this.documentType)) {
            this.count += 1
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('Debe elegir un tipo de documento')
          } else {
            this.count = 0
            resolve(true)
          }
        }, 500)
      })
    },
  },
}
</script>

<style lang="scss">
@import '@/theme/style.scss';
@import '@/theme/variables.scss';

// TODO clean me 202105.12-16.28
.error {
  color: $danger-color;
  font-weight: 400;
  font-size: 1.5rem;
}

.info {
  color: $secondary;
  font-weight: 400;
  font-size: 1.5rem;
}

.vue-form-generator .field-image .form-control {
  position: relative;
  margin-top: 5px;
  // height: 100px;
  height: auto;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 50%;
  border-radius: 0.75rem;
  box-sizing: border-box;
  // margin: 5% 5% 5% 5%;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}
// TODO move the loader to a more global scope
// TODO Use a prettier animation
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
