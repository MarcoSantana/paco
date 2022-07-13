<template>
  <v-dialog v-model="documentAcceptDialog" max-width="400px">
    <v-card>
      <v-card-title
        class="text-h5 white--text justify-center mb-2 text-center info"
      >
        Aceptar documento
      </v-card-title>
      <v-alert
        v-if="documentAcceptMessage && documentAcceptMessage.type"
        :type="documentAcceptMessage.type"
        max-width="400px"
      >
        <v-card>
          <v-card-title
            class="text-h5 white--text justify-center mb-2 document-accept-dialog"
            style="white-space: pre-wrap; word-break: keep-all;"
            :class="documentAcceptMessage.type"
          >
            {{ documentAcceptMessage.message }}
          </v-card-title>
        </v-card>
      </v-alert>
      <v-card-text class="text-center">
        {{ startCase($t('document.types')[document.name]) }}
      </v-card-text>
      <v-card-actions class="text-center">
        <v-btn
          outlined
          color="error"
          text
          @click="
            setDocumentAcceptMessage(null)
            $emit('close')
          "
        >
          <i class="mdi mdi-close"></i>
          {{ $t('actions.close') }}
        </v-btn>
        <v-spacer />
        <v-btn
          :disabled="
            documentAcceptMessage &&
              (documentAcceptMessage.type === 'success' ||
                documentAcceptMessage.type === 'error')
          "
          outlined
          color="success"
          text
          :loading="localLoading"
          @click="accept"
        >
          <i class="mdi mdi-check"></i>
          {{ $t('actions.accept') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { startCase, camelCase } from 'lodash'
import { mapState, mapActions, mapMutations } from 'vuex'
import DocumentsDB from '@/firebase/documents-db'

export default {
  name: 'DocumentAcceptDialog',
  props: {
    document: { type: Object, required: true },
    user: { type: Object, required: false },
    show: { type: Boolean, default: false },
  },
  data() {
    return {
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
    ...mapState('documents', ['currentDocument', 'documentAcceptMessage']),
    documentAcceptDialog() {
      return this.show
    }, // end of documentAcceptDialog
  }, // end of computed
  methods: {
    ...mapActions('documents', ['acceptDocument']),
    ...mapMutations('documents', ['setDocumentAcceptMessage']),
    async accept() {
      this.localLoading = true
      await this.acceptDocument({
        documentId: this.localDocument.id,
      })
        .then(res => res)
        .finally(() => {
          this.localLoading = false
        })
    },
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
document-accept-dialog {
  white-space: pre-wrap;
  word-break: keep-all; /*this stops the word breaking*/
}
</style>
