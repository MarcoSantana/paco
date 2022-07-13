<template>
  <v-dialog v-model="documentRejectReasonDialog" max-width="400px">
    <v-card>
      <v-card-title class="text-h5 white--text justify-center mb-2 warning">
        Rechazar documento
      </v-card-title>
      <v-alert
        v-if="documentRejectionMessage && documentRejectionMessage.type"
        :type="documentRejectionMessage.type"
        max-width="400px"
      >
        <v-card>
          <v-card-title
            class="text-h5 white--text justify-center mb-2 document-reject-dialog"
            style="white-space: pre-wrap; word-break: keep-all;"
            :class="documentRejectionMessage.type"
          >
            {{ documentRejectionMessage.message }}
          </v-card-title>
        </v-card>
      </v-alert>
      <v-card-text>
        <v-textarea
          v-if="!documentRejectionMessage || !documentRejectionMessage.type"
          v-model="documentRejectReason"
          counter="320"
          outlined
          background-color="amber lighten-4"
          color="orange orange-darken-4"
          label="Describa la razón del rechazo"
          hint="Describa en 320 caracteres o menos la razón de rechazo"
          required
          hide-details="auto"
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn
          outlined
          color="error"
          text
          @click="
            documentRejectReason = ''
            setDocumentRejectionMessage(null)
            $emit('close')
          "
        >
          <i class="mdi mdi-close"></i>
          {{ $t('actions.close') }}
        </v-btn>
        <v-btn
          v-show="documentRejectReason"
          outlined
          color="primary"
          text
          :loading="localLoading"
          @click="reject"
        >
          <i class="mdi mdi-send"></i>
          {{ $t('actions.send') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import DocumentsDB from '@/firebase/documents-db'

export default {
  name: 'DocumentRejectDialog',
  props: {
    document: { type: Object, required: true },
    show: { type: Boolean, default: false },
  },
  data() {
    return {
      documentRejectReason: '',
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
    ...mapState('documents', ['currentDocument', 'documentRejectionMessage']),
    documentRejectReasonDialog() {
      return this.show
    }, // end of documentRejectReasonDialog
  }, // end of computed
  methods: {
    ...mapActions('documents', ['rejectDocument']),
    ...mapMutations('documents', ['setDocumentRejectionMessage']),
    async reject() {
      this.localLoading = true
      await this.rejectDocument({
        documentId: this.localDocument.id,
        message: this.documentRejectReason,
      })
        .then(res => res)
        .finally(() => {
          this.localLoading = false
          this.documentRejectReason = ''
          /* this.setDocumentRejectionMessage(null) */
          /* this.$emit('close') */
        })
    },
  }, // end of methods
}
</script>

<style>
document-reject-dialog {
  white-space: pre-wrap;
  word-break: keep-all; /*this stops the word breaking*/
}
</style>
