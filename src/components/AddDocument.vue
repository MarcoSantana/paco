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
      title="Cargar nuevo documento"
      subtitle="Pasos para cargar documento"
      back-button-text="Atrás"
      next-button-text="Adelante"
      finish-button-text="Terminado"
      @on-complete="onComplete"
    >
      <tab-content title="Tipo de documento" icon="ti-file">
        <validation-provider rules="required">
          <span id="create-document-type-span" class="{ error: errors[0] }">
            <label for="document-type" class="tip">
              Tipo de documento
            </label>
            <select id="document-type" v-model="documentType" name="document-type">
              <option>Seleccione un documento</option>
              <option v-for="item in document" :key="item.name" :value="item">{{ item.name }}</option>
            </select>
          </span>
        </validation-provider>
      </tab-content>
      <tab-content
        :title="documentType == null ? 'Anexar documento' : 'Anexar ' + documentType.name"
        icon="ti-settings"
      >
        <span v-if="documentType">
          <validation-observer v-slot="{ invalid }">
            <form @submit.prevent="onSubmit">
              <h2 v-if="documentType">Formulario para anexar {{ documentType.name }}</h2>
              <vue-form-generator :schema="schema" :model="model" :options="formOptions"> </vue-form-generator>
            </form>
          </validation-observer>
        </span>
      </tab-content>
      <tab-content title="Vista previa" icon="ti-check">
        <h1>Revise su documento</h1>
        Aquí se presenta el documento terminado
      </tab-content>
    </form-wizard>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
// import UploadFile from '@/components/UploadFile'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {
    'form-wizard': FormWizard,
    'tab-content': TabContent,
    // 'upload-file': UploadFile,
  },
  data: () => ({
    // documentType: null,
    // An object which holds the form values
    fileURL: null,
    model: {
      id: 1,
      name: 'John Doe',
      password: 'J0hnD03!x4',
      skills: ['Javascript', 'VueJS'],
      email: 'john.doe@gmail.com',
      status: true,
    },

    schema: {
      groups: [
        {
          legend: 'User Details',
          fields: [
            {
              type: 'input',
              inputType: 'text',
              label: 'ID (disabled text field)',
              model: 'id',
              readonly: true,
              disabled: true,
              styleClasses: 'document-form',
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Name',
              model: 'name',
              id: 'user_name',
              placeholder: 'Your name',
              featured: true,
              required: true,
              styleClasses: 'document-form',
            },
            {
              type: 'input',
              inputType: 'email',
              label: 'E-mail',
              model: 'email',
              placeholder: "User's e-mail address",
              styleClasses: 'document-form',
            },
            {
              type: 'input',
              inputType: 'password',
              label: 'Password',
              model: 'password',
              min: 6,
              required: true,
              hint: 'Minimum 6 characters',
              validator: 'string',
              styleClasses: 'document-form',
            },
          ],
        },
        // {
        //   legend: 'Skills & Status',
        //   fields: [
        //     {
        //       type: 'select',
        //       label: 'Skills',
        //       model: 'skills',
        //       values: ['Javascript', 'VueJS', 'CSS3', 'HTML5'],
        //       styleClasses: 'document-form',
        //     },
        //     {
        //       type: 'checkbox',
        //       label: 'Status',
        //       model: 'status',
        //       default: true,
        //       styleClasses: 'document-form',
        //     },
        //   ],
        // },
        {
          legend: 'Carga de archivos',
          fields: [
            {
              type: 'upload',
              inputType: 'file',
              label: 'Click para cargar el anverso',
              required: true,
              model: document.front,
              styleClasses: 'file-upload',
            },
            {
              type: 'upload',
              inputType: 'file',
              label: 'Click para cargar el reverso',
              required: true,
              model: document.back,
              styleClasses: 'file-upload',
            }
          ],
        },
      ],
    },

    formOptions: {
      validateAfterLoad: true,
      validateAfterChanged: true,
      validateAsync: true,
    },
    // TODO This is a model to list all the document types 202105.05-18.32
    // at first will be hardcoded but later must come from a db catalog
    document: [
      {
        name: 'Acta de nacimiento',
        required: true,
        points: 0,
      },
      {
        name: 'Cédula profesional',
        required: true,
        points: 0,
      },
      {
        name: 'Diploma de curso',
        required: false,
        points: 5,
      },
    ],
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
  },
}
</script>


<style lang="scss">
@import '@/theme/style.scss';
@import '@/theme/variables.scss';
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
}

.file-upload {
  div {
    :hover {
      background: $light-accent;
    }
    opacity: 0.8;
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: $light-accent-1;
    color: $main;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 200px;
    position: relative;
    cursor: pointer;
  }
  label {
    span {
      font-size: 1.2em;
      padding-left: 1rem;
      margin-right: 1rem;
      padding: 0 2rem;
      position: absolute;
      margin-top: 3.2rem;
      padding-bottom: 1em;
    }
  }
}

// File upload dropzone
.test-class {
  // background-color: lighten($light-accent, 10%);
  min-height: 50px;

  outline: 2px dashed grey; /* the dash box */
  outline-offset: -2rem;
  // background: $light-accent-1;
  color: $main;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
  :hover {
    background-color: $light-accent;
  }
  input[type='file'] {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }
  label {
    color: red;
    padding-bottom: 2rem;
    margin-bottom: 2rem;
  }
}
.dz {
  // background-color: $light-accent-1;
  color: $main;
  display: flex;
  align-items: center;
  justify-content: center;
  &--drag {
    @extend .dz;
    background: green;
  }
  .is-dragging {
    background-color: $vue-color;
  }
}

.vue-form-generator {
  // background-color: $light-accent-1;
  @extend .box;
  color: $main;
  border-radius: 1.5rem;
  // padding: 0.75rem;
  margin: -1.5rem;
  margin-top: 0;
  margin-bottom: 0;
  fieldset {
    border: none;
  }
  input[type='file'] {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }
}
</style>
