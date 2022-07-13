<template>
  <v-dialog v-model="documentRejectReasonDialog" max-width="400px">
    <v-card>
      <v-card-title class="text-h5 white--text justify-center mb-2 warning">
        Razón de rechazo
      </v-card-title>
      <v-dialog
        v-if="documentRejectionMessage"
        :type="documentRejectionMessage.type"
        max-width="400px"
      >
        <v-card>
          <v-card-title
            class="text-h5 white--text justify-center mb-2"
            :class="documentRejectionMessage.type"
          >
            {{ documentRejectionMessage }}
          </v-card-title>
        </v-card>
      </v-dialog>
      <v-card-text>
        <v-textarea
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
            $emit('close')
          "
        >
          <i class="mdi mdi-cancel"></i>
          {{ $t('actions.cancel') }}
        </v-btn>
        <v-btn
          v-show="documentRejectReason"
          outlined
          color="primary"
          text
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
import { mapState, mapActions } from 'vuex'
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
    async reject() {
      console.clear()
      console.log('changeDocumentStatus')
      console.log('localDocument.id', this.localDocument.id)
      console.log('documentRejectReason', this.documentRejectReason)
      const reponse = await this.rejectDocument({
        documentId: this.localDocument.id,
        message: this.documentRejectReason,
      })
      console.log('response', reponse)
      console.log('this.currentDocument', this.currentDocument)
      /* this.$emit('close') */
      // in the parent compoment show a toast message
    },
  }, // end of methods
}
</script>

<style></style>
