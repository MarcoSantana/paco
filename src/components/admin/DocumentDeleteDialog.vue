<template>
  <v-dialog v-model="documentDeleteDialog" max-width="400px">
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
      </v-card-text>
      <v-card-actions class="text-center">
        <v-btn
          outlined
          color="error"
          text
          @click="
            setDocumentDeleteMessage(null)
            $emit('close')
          "
        >
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
          <i class="mdi mdi-check"></i>
          {{ $t('actions.delete') }}
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
  name: 'DocumentDeleteDialog',
  props: {
    document: { type: Object, required: true },
    user: { type: Object, required: false },
    show: { type: Boolean, default: false },
  },
  data() {
    return {
      localLoading: false,
      allow: false,
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
    documentDeleteDialog() {
      return this.show
    }, // end of documentDeleteDialog
  }, // end of computed
  methods: {
    ...mapActions('documents', ['deleteDocument']),
    ...mapMutations('documents', ['setDocumentDeleteMessage']),
    async triggerDelete() {
      this.localLoading = true
      await this.deleteDocument({
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
document-delete-dialog {
  white-space: pre-wrap;
  word-break: keep-all; /*this stops the word breaking*/
}
</style>
