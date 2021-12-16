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
    <validation-observer v-slot="{ invalid }">
      <v-card-text class="ma-5">
        <div v-for="field in document.fields" :key="field.name" class="pr-5">
          <validation-provider v-slot="{ errors }" :name="field.name" rules="numeric|length:7,12|required">
            <span :class="{ error: errors[0] }">
              <v-text-field
                :ref="field.name"
                v-model="foo[field.name]"
                :data-vv-name="scope"
                :label="field.label"
                :placeholder="field.placeholder"
                :error="errors.length > 0"
                :error-messages="errors"
                hide-details="auto"
                counter
                required
              ></v-text-field>
            </span>
          </validation-provider>
        </div>
      </v-card-text>
      <v-card-text>
        <validation-provider v-slot="{ errors }" :name="document.name" rules="required|size:2000">
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
          ></v-file-input>
        </validation-provider>
        <v-btn v-if="documentCreationMessage.type !== 'success'" color="success" :disabled="invalid" @click="fizz()">
          Guardar
          <v-icon right dark>mdi-cloud-upload</v-icon>
        </v-btn>
      </v-card-text>
    </validation-observer>
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
    scope: { type: String, required: false },
  },
  data: () => ({
    email: null,
    lastName: null,
    firstName: null,
    error: {},
    // FIXME this is not a proper name
    foo: [],
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
    getURL(file) {
      if (!isNil(file)) {
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
    fizz() {
      this.$emit('validate', 'foo')
    },
    async validate() {
      // this.valid = false
      this.setDocumentCreationMessage({ type: 'info', message: 'Validando documento' })
      // TODO: Here we must trigger the validation for the full form
      this.fizz()
      this.$refs.stepForm.validate()
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
