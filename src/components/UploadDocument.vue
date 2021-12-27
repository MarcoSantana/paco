<template>
  <v-card class="mx-auto" max-width="500">
    <show-file v-for="file in docURLs" :key="file.i" :url="file.i" />
    <!-- <show-file v-for="file in docURLs" :key="file" :url="getDownloadURL(file)" /> -->
    <div v-for="file in files" :key="file.name">
      <v-img
        v-if="file.type === 'image/png' || files.type === 'image/jpeg'"
        class="ma-5"
        contain
        lazy-src="https://picsum.photos/id/11/10/6"
        max-height="150"
        max-width="250"
        :src="getURL(file) ? getURL(file) : null"
      />
      <!-- TODO Center this inside the card 202112.04-08.24 -->
      <object
        v-if="file.name && file.type === 'application/pdf'"
        class="ma-5"
        style="max-width: 500px; min-width: 344px; min-height: 500px"
        :data="getURL(file)"
      />
    </div>
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
                  v-model="foo[field.name]"
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
        <keep-alive
          ><validation-provider v-slot="{ errors }" :name="document.name" rules="required|size:2000">
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
              @change="setDocumentCreationMessage({})"
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
    // FIXME this is not a proper name
    foo: [],
    files: [],
    docURLs: [],
  }),
  asyncComputed: {
    // files() {
    //   return !isNil(this.showFiles)
    //     ? Object.values(this.showFiles).forEach(async (url) => {
    //         await fetch(url)
    //       })
    //     : null
    //   // TODO: manage 403 error in fetch
    // },
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
    this.populateFiles(this.showFiles)
  },
  methods: {
    // TODO useme
    ...mapActions('documents', ['triggerAddDocumentAction']),
    ...mapMutations('documents', ['setDocumentNameToCreate', 'setDocumentCreationMessage']),
    ...mapActions('documents', ['createUserDocument']),
    getURL(file) {
      if (!isNil(file)) {
        console.log('typeof file: ', typeof file)
        console.log(file)
        return URL.createObjectURL(file)
      }
      return null
    },
    createLocalDocument(document) {
      if (isNil(document) || isNil(this.files)) {
        this.valid = false
      }
      document.upload = this.files
      this.createUserDocument(document)
    },
    async validate() {
      // this.valid = false
      this.setDocumentCreationMessage({ type: 'info', message: 'Validando documento' })
      if (!this.invalid) {
        this.setDocumentCreationMessage({ type: 'warning', message: 'Creando documento' })
        this.createLocalDocument({ name: this.document.name, upload: this.files })
        this.$emit('document-added', this.documents[this.documents.length - 1])
        console.log('Running validate')
        // TODO do some timeout and a loader to give better feedback
      }
    },
    getDownloadURL(docRef) {
      const storageRef = storage().ref(docRef)
      return storageRef.getDownloadURL().then(result => {
        return result
      })
    },
    populateFiles(files) {
      if (isNil(files)) return null
      const foo = files.map(file => {
        return this.docURLs.push(this.getDownloadURL(file))
      })
      console.log('foo', foo)
      return true
    },
  },
}
</script>
