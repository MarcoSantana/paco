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
    <validation-observer v-slot="{ invalid }">
      <form @submit.prevent="onSubmit">
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
                  <option v-for="item in document" :key="item.name">{{ item.name }}</option>
                </select>
              </span>
            </validation-provider>
          </tab-content>
          <tab-content :title="documentType == null ? 'Anexar documento' : 'Anexar ' + documentType" icon="ti-settings">
            Formulario para anexar {{ documentType }}
            <template>
              <vue-form-json-schema v-model="model" :schema="schema" :ui-schema="uiSchema"> </vue-form-json-schema>
            </template>
            Model: {{ model }}
          </tab-content>
          <tab-content title="Vista previa" icon="ti-check">
            <h1>Put here the preview</h1>
            Maybe this is a component on its own
          </tab-content>
        </form-wizard>
      </form>
    </validation-observer>
    <!-- <input
      placeholder="document name..."
      class="document-name-input"
      type="text"
      :value="documentNameToCreate"
      @input="setDocumentNameToCreate($event.target.value)"
      @keypress.enter="triggerAddDocumentAction"
    />
    <div :class="{ disabled: documentCreationPending }" class="create-document-btn" @click="triggerAddDocumentAction">
      add document
    </div> -->
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import VueFormJsonSchema from 'vue-form-json-schema'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {
    'form-wizard': FormWizard,
    'tab-content': TabContent,
    'vue-form-json-schema': VueFormJsonSchema,
  },
  data: () => ({
    // documentType: null,
    // An object which holds the form values
    model: {},
    // A valid JSON Schema object
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
      },
    },
    // Array of HTML elements or Vue components
    uiSchema: [
      {
        component: 'input',
        model: 'firstName',
        // Same API as [Vue's render functions](https://vuejs.org/v2/guide/render-function.html#The-Data-Object-In-Depth)
        fieldOptions: {
          class: ['form-control'],
          on: ['input'],
          attrs: {
            placeholder: 'Please enter your first name',
          },
        },
      },
    ],
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
  },
}
</script>

<style lang="scss">
@import '@/theme/style.scss';
@import '@/theme/variables.scss';
</style>
