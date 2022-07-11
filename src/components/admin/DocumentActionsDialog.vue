<template>
  <v-dialog v-model="show" max-width="400px">
    <v-card>
      <v-card-title class="text-h5 white--text justify-center mb-2 warning">
        Razón de rechazo Document {{ document }}
      </v-card-title>
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
            documentRejectReasonDialog = false
            documentRejectReason = ''
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
          @click="
            changeDocumentStatus(currentDocument.id, 3, documentRejectReason)
          "
        >
          <i class="mdi mdi-send"></i>
          {{ $t('actions.send') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { cloneDeep } from 'lodash'

export default {
  name: 'DocumentActionsDialog',
  props: {
    document: { type: Object, required: true },
    show: { type: Boolean, default: false },
  },
  data() {
    return {
      documentRejectReason: '',
      documentRejectReasonDialog: false,
    }
  }, // end of data
  computed: {
    localDocument() {
      return cloneDeep(this.document)
    },
  }, // end of computed
  methods: {
    changeDocumentStatus(id, status, reason) {
      console.log('id, status, reason: ', id, status, reason)
      this.documentRejectReasonDialog = false
      this.documentRejectReason = ''
    },
  }, // end of methods
}
</script>

<style></style>
