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
      <object
        v-if="file.name && file.type === 'application/pdf'"
        class="ma-5"
        style="max-width: 500px; min-width: 344px; min-height: 500px;"
        :data="getURL(file)"
      />
    </v-fade-transition>
    <v-card-text>
      <v-form :ref="'documentUpload'" v-model="valid" lazy-validation>
        <v-file-input
          v-model="files"
          :rules="rules"
          accept="image/png, image/jpeg, application/pdf"
          :placeholder="document.placeholder"
          counter
          show-size
          truncate-length="15"
          required
          @change="setDocumentCreationMessage({})"
        />
      </v-form>
      <v-alert v-if="documentCreationMessage.message" dense text :type="documentCreationMessage.type">
        {{ documentCreationMessage.message }}
      </v-alert>
      <v-btn
        v-if="documentCreationMessage.type !== 'success'"
        color="success"
        :disabled="!valid || files.length == 0"
        @click="validate()"
      >
        Guardar
        <v-icon right dark>
          mdi-cloud-upload
        </v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

const required = val => !!val || 'Este campo es obligatorio'
const maxSize = (value, max) => !value || value.size < max || `El archivo no puede exceder los ${max / 1000000} Mb`

export default {
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    valid: true,
    files: [],
    rules: [value => maxSize(value, 2000000), value => required(value)],
  }),
  computed: {
    ...mapState('documents', ['documentNameToCreate', 'documentCreationPending', 'documentCreationMessage']),
  },
  // mounted: console.log('UploadDocument mounted'),

  methods: {
    ...mapActions('documents', ['triggerAddDocumentAction']),
    ...mapMutations('documents', ['setDocumentNameToCreate', 'setDocumentCreationMessage']),
    ...mapActions('documents', ['createUserDocument']),

    validate() {
      this.valid = false
      const v = this.$refs.documentUpload.validate()
      if (v) {
        this.valid = true
        // this.createLocalDocument({ name: 'Documento de prueba, por favor ignore', upload: { name: 'foo' } }, n)
        // TODO do some timeout and a loader to give better feedback
        // TODO  Emit event of valid or not
      }
    },
  },
}
</script>
