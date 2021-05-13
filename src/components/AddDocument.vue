<template>
  <div class="box">
    <!--
          <h2>TODO</h2>
       <div>
      <ul>
        <li>Add validation</li>
        <li>
          Add minimal fields
          <ul>
            <li>Image</li>
            <li>Document type dropdown</li>
          </ul>
        </li>
        <li>Add a catalog of valida documents in dropdown</li>
        <li>Make upload image mechanism</li>
        <li>preview image</li>
        <li>Image resize</li>
        <li>Reactive dropdowns depending of the document type</li>
        <li>PDF?</li>
        <li>Translate</li>
        <li>Make proper button</li>
        <li>Separate in partials as needed</li>
      </ul>
    </div> -->
    <!-- todo -->

    <form-wizard
      shape="circle"
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
          <select id="document-type" v-model="documentType" name="document-type">
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
          <!-- <pdf v-if="formModel.document" :src="formModel.document.front"></pdf> -->
          <!-- <img v-if="formModel.document" :src="formModel.document.front" alt="frente del documento" /> -->
        </span>
      </tab-content>
      <tab-content title="Vista previa" icon="ti-check">
        <h1>Revise su documento</h1>
        Aquí se presenta el documento terminado
      </tab-content>
      <div v-if="loadingWizard" class="loader"></div>
      <div v-if="errorMsg">
        <span class="error">{{ errorMsg }}</span>
      </div>
      <button slot="prev" class="form-wizard-button">Atrás</button>
      <button slot="next" class="form-wizard-button">Adelante</button>
      <button slot="finish" class="form-wizard-button">Guardar</button>
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
// import pdf from 'vue-pdf'
/*
   TODO
   add a button which deletes the model for the picture and add some validation in the form wizard and or the form generator
*/

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {
    'form-wizard': FormWizard,
    'tab-content': TabContent,
    // pdf,
    // 'upload-file': UploadFile,
  },
  mixins: [FormSchema],
  data: () => ({
    // documentType: null,
    // An object which holds the form values
    loadingWizard: false,
    errorMsg: null,
    fileURL: null,
    formModel: {},

    formOptions: {
      validateAfterLoad: true,
      validateAfterChanged: true,
      validateAsync: true,
    },
    documentType: null,
  }),
  computed: mapState('documents', ['documentNameToCreate', 'documentCreationPending']),
  methods: {
    ...mapMutations('documents', ['setDocumentNameToCreate']),
    ...mapActions('documents', ['triggerAddDocumentAction']),
    onComplete() {
      // eslint-disable-next-line no-alert
      alert('Terminó la carga del documento')
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
      console.log(`Tab: ${tabIndex} valid: ${isValid}`)
    },
    handleErrorMessage(errorMsg) {
      this.errorMsg = errorMsg
    },
    validateAsync() {
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
.vue-form-generator .field-image .preview {
  position: relative;
  margin-top: 5px;
  height: 100px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 50%;
  border-radius: 0.75rem;
  box-sizing: border-box;
  // margin: 5% 5% 5% 5%;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
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

.form-wizard-button {
  &:hover {
    font-weight: bold;
    background: $main;
    color: $light-accent;
  }
  margin-top: 28px;
  width: 100px;
  height: 32px;
  background: $light-accent;
  border: none;
  border-radius: 8px;
  color: $main;
  font-family: 'Roboto', sans-serif; // Change me
  font-weight: 500;
  text-transform: uppercase;
  transition: 0.5s ease;
  cursor: pointer;
}

fieldset {
  border-style: dotted;
  border-color: $light-accent;
}
.field-wrap {
  color: red;
}
.document-form {
  background-color: transparent;
  border: none;
  select,
  input[type='text'],
  input[type='email'],
  input[type='password'] {
    display: block;
    box-sizing: border-box;
    margin-bottom: 20px;
    padding: 4px;
    height: 32px;
    width: 100%;
    border: none;
    border-bottom: 1px solid #aaa;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 15px;
    transition: 0.2s ease;
  }

  input[type='text']:focus,
  input[type='email']:focus,
  input[type='password']:focus {
    outline: none;
    border-bottom: 2px solid $secondary;
    background-color: lighten($color: $secondary, $amount: 50%);
    color: $main;
    transition: 0.8s ease;
    box-shadow: 2px 1px rgba(0, 0, 0, 0.4);
  }

  .hint {
    margin-bottom: 1.2rem;
    margin-top: 0;
  }
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

// .vue-form-generator {
//   // background-color: $light-accent-1;
//   // @extend .box;
//   color: $main;
//   border-radius: 1.5rem;
//   // padding: 0.75rem;
//   margin: -1.5rem;
//   margin-top: 0;
//   margin-bottom: 0;
//   fieldset {
//     border: orange;
//   }
// input[type='file'] {
//   opacity: 0; /* invisible but it's there! */
//   width: 100%;
//   height: 200px;
//   position: absolute;
//   cursor: pointer;
// }
// }
</style>
