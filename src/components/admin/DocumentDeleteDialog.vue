<template>
  <v-dialog v-model="documentDeleteDialog" persistent max-width="400px">
    <v-card>
      <v-card-title
        class="text-h5 white--text justify-center mb-2 text-center error"
      >
        Borrar documento
      </v-card-title>
      <v-alert
        v-if="documentDeleteMessage && documentDeleteMessage.type"
        :type="documentDeleteMessage.type"
        max-width="400px"
      >
        <v-card>
          <v-card-title
            class="text-h5 white--text justify-center mb-2 document-delete-dialog"
            style="white-space: pre-wrap; word-break: keep-all;"
            :class="documentDeleteMessage.type"
          >
            {{ documentDeleteMessage.message }}
          </v-card-title>
        </v-card>
      </v-alert>
      <v-card-text class="text-center">
        {{ startCase($t('document.types')[document.name]) }}
        <v-textarea
          v-if="!documentRejectionMessage || !documentRejectionMessage.type"
          v-model="documentDeleteReason"
          counter="320"
          outlined
          background-color="error lighten-4"
          color="red red-darken-4"
          label="Describa la razón de la eliminación"
          hint="Describa en 320 caracteres o menos la razón de la eliminación"
          required
          hide-details="auto"
        ></v-textarea>
      </v-card-text>
      <v-card-actions class="text-center">
        <v-btn outlined color="error" text @click="reset">
          <i class="mdi mdi-close"></i>
          {{ $t('actions.close') }}
        </v-btn>
        <v-spacer />
        <v-switch v-model="allow" :label="`${$t('actions.delete')}?`" />
        <v-spacer />
        <v-btn
          v-show="allow"
          :disabled="
            documentDeleteMessage &&
              (documentDeleteMessage.type === 'success' ||
                documentDeleteMessage.type === 'error')
          "
          outlined
          color="success"
          text
          :loading="localLoading"
          @click="triggerDelete"
        >
          <i class="mdi mdi-delete"></i>
          {{ $t('actions.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { startCase, camelCase, reduce } from 'lodash'
import { mapState, mapActions, mapMutations } from 'vuex'
import DocumentsDB from '@/firebase/documents-db'
import UserEventsDB from '@/firebase/user-events-db'

export default {
  name: 'DocumentDeleteDialog',
  props: {
    document: { type: Object, required: true },
    user: { type: Object, required: false },
    show: { type: Boolean, default: false },
  },
  data() {
    return {
      allow: false,
      documentDeleteReason: '',
      localLoading: false,
    }
  }, // end of data
  asyncComputed: {
    localDocument() {
      const documentsDB = new DocumentsDB()
      return documentsDB
        .getByUserDocumentId(this.document.id)
        .then(response => response[0])
    }, // end of currentDocument
  }, // end of asyncComputed
  computed: {
    ...mapState('documents', ['currentDocument', 'documentDeleteMessage']),
    ...mapState('admin', ['currentEvent', 'currentUser']),
    documentDeleteDialog() {
      return this.show
    }, // end of documentDeleteDialog
  }, // end of computed
  mounted() {
    this.documentDeleteMessage = null
  },
  methods: {
    ...mapActions('documents', ['deleteDocument']),
    ...mapMutations('documents', ['setDocumentDeleteMessage']),
    reset() {
      this.allow = false
      this.setDocumentDeleteMessage({})
      this.documentDeleteReason = null
      this.documentDeleteMessage = {}
      this.$emit('close')
    }, // end of reset
    async triggerDelete() {
      this.localLoading = true
      this.setDocumentDeleteMessage({
        type: 'info',
        message: 'Borrando documento...',
      })
      const userEventsDB = new UserEventsDB(this.currentUser.id)
      const documents = await userEventsDB
        .documents(this.currentEvent.id)
        .then(res => res)
      const reducedDocuments = reduce(
        documents,
        (acc, document) => {
          this.setDocumentDeleteMessage({
            type: 'warning',
            message: `Filtrando documento ${startCase(document.name)}...`,
          })
          if (document.name !== this.document.name) {
            return { ...acc, [document.name]: document }
          }
          return acc
        },
        {}
      )
      const final = { ...this.currentEvent, documents: reducedDocuments }

      setTimeout(
        () =>
          (this.documentDeleteMessage = {
            type: 'warning',
            message: `Guardando cambios... \n Esta acción no puede deshacerse.`,
          }),
        500
      )
      userEventsDB
        .update(final)
        .then(
          async () =>
            this.deleteDocument({
              documentId: this.localDocument.id,
            }).then(res => res)
          // here put some extra cool message
        )
        .finally(() => {
          setTimeout(
            () =>
              (this.documentDeleteMessage = {
                type: 'success',
                message: `Documento borrado con éxito.`,
              }),
            500
          )
          this.localLoading = false
          this.documentDeleteMessage = {}
          this.$emit('deleted')
        })
    }, // end of triggerDelete
    camelCase(str) {
      return camelCase(str)
    }, // end of camelCase
    startCase(str) {
      return startCase(str)
    }, // end of startCase
  }, // end of methods
}
</script>

<style>
document-delete-dialog {
  white-space: pre-wrap;
  word-break: keep-all; /*this stops the word breaking*/
}
</style>
