<template>
  <v-card class="mx-auto" max-width="500">
    <v-fade-transition v-for="file in files" :key="file.name">
      <v-img
        v-if="file.type === 'image/png' || files.type === 'image/jpeg'"
        class="ma-5"
        contain
        lazy-src="https://picsum.photos/id/11/10/6"
        max-height="150"
        max-width="250"
        :src="getURL(file)"
      />
      <!-- TODO Center this inside the card 202112.04-08.24 -->
      <object
        v-if="file.name && file.type === 'application/pdf'"
        class="ma-5"
        style="max-width: 500px; min-width: 344px; min-height: 500px;"
        :data="getURL(file)"
      />
    </v-fade-transition>
    <v-alert v-if="documentCreationMessage.message" text :type="documentCreationMessage.type">
      {{ documentCreationMessage.message }}
    </v-alert>
    <v-card-text class="ma-5">
      <div v-for="field in document.fields" :key="field.name" class="pr-5">
        <validation-provider v-slot="{ errors }" rules="numeric|length:7,12|required">
          <span :class="{ error: errors[0] }">
            <v-text-field
              ref="titulo"
              v-model="foo[field.name]"
              :label="field.label"
              :error="errors.length > 0"
              :error-messages="errors[0]"
              hide-details="auto"
              counter
              placeholder="Número de cédula profesional"
              required
            ></v-text-field>
          </span>
        </validation-provider>
      </div>
    </v-card-text>
    <v-card-text>
      <validation-provider v-slot="{ errors }" rules="required|size:2000">
        <v-file-input
          v-model="files"
          data-vv-as="file"
          accept="image/png, image/jpeg, application/pdf"
          :placeholder="document.placeholder"
          :error="errors.length > 0"
          :error-messages="errors[0]"
          counter
          chips
          show-size
          truncate-length="15"
          required
          small-chips
          multiple
          clearable
          @change="setDocumentCreationMessage({})"
        ></v-file-input>
      </validation-provider>
      <v-btn
        v-if="documentCreationMessage.type !== 'success'"
        color="success"
        :disabled="!valid || (files && files.length == 0)"
        @click="validate()"
      >
        Guardar
        <v-icon right dark>mdi-cloud-upload</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { isNil } from 'lodash'

export default {
  props: {
    document: {
      type: Object,
      required: true,
    },
    showFiles: {
      type: Array,
      required: false,
    },
  },
  data: () => ({
    valid: true,
  }),
  asyncComputed: {
    files() {
      return !isNil(this.showFiles)
        ? Object.values(this.showFiles).forEach(async url => {
            await fetch(url)
          })
        : null
      // TODO: manage 403 error in fetch
    },
  },
  computed: {
    ...mapState('documents', [
      'documents',
      'documentNameToCreate',
      'documentCreationPending',
      'documentCreationMessage',
    ]),
  },
  mounted() {
    this.setDocumentCreationMessage({})
  },
  methods: {
    // TODO useme
    ...mapActions('documents', ['triggerAddDocumentAction']),
    ...mapMutations('documents', ['setDocumentNameToCreate', 'setDocumentCreationMessage']),
    ...mapActions('documents', ['createUserDocument']),
    maxSize(files, max) {
      return !files || !files.some(file => file.size > max) || `El archivo no puede exceder los ${max / 1e6} Mb`
    },
    required(files) {
      return !isNil(files) || 'Este campo es obligatorio'
      // return !isNil(val) || 'Este campo es obligatorio'
    },
    getURL(file) {
      if (!isNil(file)) {
        return URL.createObjectURL(file)
      }
      return null
    },
    createLocalDocument(document) {
      if (isNil(document) || isNil(this.files)) return
      document.upload = this.files
      this.createUserDocument(document)
    },
    async validate() {
      // this.valid = false
      this.setDocumentCreationMessage({ type: 'info', message: 'Validando documento' })
      if (this.valid) {
        this.setDocumentCreationMessage({ type: 'warning', message: 'Creando documento' })
        this.createLocalDocument({ name: this.document.name, upload: this.files })
        this.$emit('document-added', this.documents[this.documents.length - 1])
        console.log('Running validate')
        // TODO do some timeout and a loader to give better feedback
      }
    },
  },
}
</script>
