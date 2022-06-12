<template>
  <v-container>
    <v-card class="pa-3">
      <v-card-title>
        <span class="text-capitalize text-h4">{{ $t(`document.types.${document.name}`) }}</span>
        <span
          :class="(document.status ===3 ? 'error' : '')"
          class="text-capitalize"
        >{{ $t(`document.statusKey.${document.status}`) }}</span>
      </v-card-title>
      <v-alert
        v-if="documentCreationMessage.message"
        text
        :type="documentCreationMessage.type"
      >{{ documentCreationMessage.message }}</v-alert>
      <validation-observer v-slot="{ invalid }">
        <validation-provider
          v-slot="{ errors }"
          inmediate
          :name="document.name"
          rules="required|size:2000"
        >
          <v-card-text v-for="(file, i) in docURLs" :key="file">
            <show-file :url="file" @removeFile="file = null" />
            <v-file-input
              v-if="document.status === 3"
              :key="`${document.name}-file-input`"
              :ref="`fileInput-${i}`"
              v-model="files[i]"
              :name="`fileInput-${document.name}-${i}`"
              :data-vv-as="`file-${i - 1}`"
              accept="image/png, image/jpeg, application/pdf"
              :placeholder="
                `${$t('actions.load')} ${$t(
                  'document.types.' + document.name
                )} ${i + 1}`
              "
              :error="errors.length > 0"
              :error-messages="errors[0]"
              counter
              chips
              show-size
              truncate-length="15"
              required
              small-chips
              clearable
              @click="setDocumentCreationMessage({})"
              @change="docURLs[i] = getURL(files[i])"
            >
              <v-icon
                slot="append"
                color="red"
                @click="
                  delete docURLs[i - 1]((inputsArray[i - 1] = false))(
                    filesCounter - 1 < 1
                      ? (filesCounter = 1)
                      : (filesCounter -= 1)
                  )
                "
              >mdi-minus</v-icon>
            </v-file-input>
          </v-card-text>
          <v-card-actions v-if="document.status === 3">
            <v-btn
              v-if="documentCreationMessage.type !== 'success'"
              class="my-2"
              color="success"
              :disabled="invalid"
              @click="validate()"
            >
              {{ $t('actions.save') }}
              <v-icon right dark>mdi-cloud-upload</v-icon>
            </v-btn>
          </v-card-actions>
        </validation-provider>
      </validation-observer>
    </v-card>
  </v-container>
</template>

<script>
import { isNil } from 'lodash'
import { mapActions, mapMutations, mapState } from 'vuex'
import { storage } from 'firebase'
import ShowFile from '@/components/ShowFile'

export default {
  name: 'DocumentDetail',
  components: { ShowFile },
  props: {
    document: Object,
  },
  data() {
    return {
      docURLs: [],
      fieldModel: [],
      files: [],
      filesCounter: 1,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setDocumentCreationMessage({})
      this.populateRemoteFiles(this.documentFiles)
    })
  },
  methods: {
    ...mapActions('documents', [
      'triggerAddDocumentAction',
      'createUserDocument',
      'setDocumentForReview',
    ]),
    ...mapMutations('documents', [
      'setDocumentCreationMessage',
      'setDocumentNameToCreate',
    ]),

    async createLocalDocument(document) {
      if (isNil(document) || isNil(this.files)) {
        this.valid = false
        return {}
      }
      document = { ...document, status: 1 }
      const createdDocument = await this.createUserDocument(document)
      return createdDocument
    },

    async markForReview() {
      const data = { id: this.document.id }
      this.setDocumentCreationMessage({
        type: 'info',
        message: 'Validando documento',
      })
      await this.setDocumentForReview(data)
      // TODO change the local state to reflect the new status of this document 202108.08-12.09
    },
    populateRemoteFiles(files) {
      if (isNil(files)) return null
      return files.map(async (file) => {
        this.docURLs.push(await this.getDownloadURL(file))
      })
    },

    async getDownloadURL(docRef) {
      const storageRef = storage().ref(docRef)
      const url = await storageRef.getDownloadURL()
      return url
    },

    getURL(file) {
      if (isNil(file) || typeof file !== 'object') return null
      return URL.createObjectURL(file)
    },

    async validate() {
      if (!this.valid && this.invalid) return null
      this.setDocumentCreationMessage({
        type: 'warning',
        message: 'Creando documento',
      })
      const createdDocument = await this.createLocalDocument({
        name: this.document.name,
        status: 1,
        upload: this.files,
      })
        .then(() => {
          this.setDocumentCreationMessage({
            type: 'success',
            message: 'Documento creado',
          })
          this.markForReview()
          this.document.status = 1
        })
        .then(() => {
          this.setDocumentCreationMessage({})
        })
      this.$emit('document-created', createdDocument)
      return true
    },
  },
  computed: {
    ...mapState('documents', [
      'documents',
      'documentNameToCreate',
      'documentCreationPending',
      'documentCreationMessage',
    ]),
    documentFiles() {
      return Object.values(this.document.files)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.document-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
