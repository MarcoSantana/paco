<template>
  <v-card class="mx-auto" max-width="500">
    <v-alert v-if="documentCreationMessage.message" text :type="documentCreationMessage.type">
      {{ documentCreationMessage.message }}
    </v-alert>
    <validation-observer v-slot="{ invalid }">
      <v-card-text class="ma-5">
        <div v-for="field in document.fields" :key="field.name" class="pr-5">
          <keep-alive
            ><validation-provider v-slot="{ errors }" :name="field.name" :rules="field.rules">
              <span :class="{ error: errors[0] }">
                <component
                  :is="field.type"
                  :ref="field.name"
                  v-model="fieldModel[field.name]"
                  :name="field.name"
                  :data-vv-name="scope"
                  :label="field.label"
                  :placeholder="field.placeholder"
                  :error="errors.length > 0"
                  :error-messages="errors"
                ></component>
              </span> </validation-provider
          ></keep-alive>
        </div>
      </v-card-text>
      <v-card-text>
        <show-file v-for="(file, i) in docURLs" :key="`url-${i}`" :url="file" />
        <keep-alive
          ><validation-provider v-slot="{ errors }" :name="`file-${document.name}`" rules="required|size:2000">
            <v-file-input
              v-model="files"
              data-vv-as="file"
              :data-vv-name="scope"
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
              @click="setDocumentCreationMessage({})"
              @change="docURLs = populateLocalFiles(files)"
            ></v-file-input> </validation-provider
        ></keep-alive>
        <v-btn
          v-if="documentCreationMessage.type !== 'success'"
          color="success"
          :disabled="invalid"
          @click="validate()"
        >
          Guardar
          <v-icon right dark>mdi-cloud-upload</v-icon>
        </v-btn>
      </v-card-text>
    </validation-observer>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { VTextField } from 'vuetify/lib'
import { storage } from 'firebase'
import { isNil } from 'lodash'
import ShowFile from '@/components/ShowFile'

export default {
  components: { VTextField, ShowFile },
  props: {
    document: {
      type: Object,
      required: true,
    },
    showFiles: {
      type: Array,
      required: false,
    },
    scope: { type: String, required: false },
  },
  data: () => ({
    email: null,
    lastName: null,
    firstName: null,
    error: {},
    fieldModel: [],
    files: [],
    docURLs: [],
  }),
  asyncComputed: {},
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
    this.populateRemoteFiles(this.showFiles)
  },
  methods: {
    // TODO useme
    ...mapActions('documents', ['triggerAddDocumentAction']),
    ...mapMutations('documents', ['setDocumentNameToCreate', 'setDocumentCreationMessage']),
    ...mapActions('documents', ['createUserDocument']),
    getURL(file) {
      if (isNil(file)) return null
      return URL.createObjectURL(file)
    },
    createLocalDocument(document) {
      if (isNil(document) || isNil(this.files)) {
        this.valid = false
        return
      }
      document.upload = this.files
      this.createUserDocument(document)
    },
    async validate() {
      if (!this.valid && this.invalid) return null
      this.setDocumentCreationMessage({ type: 'info', message: 'Validando documento' })
      this.setDocumentCreationMessage({ type: 'warning', message: 'Creando documento' })
      this.createLocalDocument({ name: this.document.name, ...this.fieldModel, upload: this.files })
      this.$emit('document-added', this.documents[this.documents.length - 1])
      return true
    },
    async getDownloadURL(docRef) {
      const storageRef = storage().ref(docRef)
      const url = await storageRef.getDownloadURL()
      return url
    },
    populateLocalFiles(files) {
      if (isNil(files)) return null
      return files.map(file => {
        return URL.createObjectURL(file)
      })
    },
    populateRemoteFiles(files) {
      if (isNil(files)) return null
      return files.map(async file => {
        this.docURLs.push(await this.getDownloadURL(file))
      })
    },
  },
}
</script>
