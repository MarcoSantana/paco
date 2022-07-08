<template>
  <v-sheet>
    <v-dialog
      v-model="dialog"
      close-delay="1000"
      overlay-color="primary"
      persistent
      width="500"
    >
      <template v-slot:activator="{ on: onTemplate, attrs: attrsTemplate }">
        <v-btn
          block
          class="pa-0 text--secondary text-capitalize"
          text
          v-bind="attrsTemplate"
          v-on="onTemplate"
        >
          <v-icon class="mr-3">mdi-check</v-icon>
          <v-spacer />
          Aceptar
        </v-btn>
      </template>
      <!-- end activator -->
      <v-card>
        <v-card-title
          class="text-h5 text--secondary text--white justify-center mb-2 success"
        >
          <v-col cols="12" class="text-center">
            Aceptar solicitud
          </v-col>
        </v-card-title>
        <v-alert
          v-if="toast && toast.message"
          class="ma-5"
          outlined
          :type="toast.type"
        >
          {{ toast.message }}
        </v-alert>
        <span v-if="!toast.message">
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn outlined color="error" text @click="reset()">
              <i class="mdi mdi-cancel"></i>
              {{ $t('actions.cancel') }}
            </v-btn>
            <v-spacer />
            <v-btn outlined color="success" text @click="changeStatus">
              <i class="mdi mdi-check"></i>
              {{ $t('actions.accept') }}
            </v-btn>
          </v-card-actions>
        </span>
        <span v-else>
          <v-card-actions>
            <v-btn block :color="toast.type" @click="reset">
              {{ $t('actions.close') }}
            </v-btn>
          </v-card-actions>
        </span>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
import { callUpdateRequestStatus } from '@/firebase/functions'
import { isNil } from 'lodash'

export default {
  props: {
    request: { type: Object, required: true },
  },
  data: () => ({
    dialog: false,
    reason: '',
    toast: { message: '', type: 'info', show: false, timeout: 2000 },
    result: null,
  }), // end data
  methods: {
    reset() {
      this.dialog = false
      this.reason = ''
      this.toast.message = ''
      this.toast.show = false
      this.toast.type = 'info'
    },
    async changeStatus() {
      const { request } = this
      if (isNil(request) || isNil(request.requestId) || isNil(request.userId)) {
        this.toast.type = 'error'
        this.toast.message = 'Error al procesar solicitud, intente más tarde'
        this.toast.show = true
        return
      }
      this.toast.message = ''
      this.toast = {
        type: 'warning',
        message: 'Cambiando el estado de la solicitud',
        show: true,
      }
      // payload
      const payload = {
        message: this.reason,
        requestId: request.requestId,
        userId: request.userId,
        status: 'accepted',
      }
      await callUpdateRequestStatus(payload).then(result => {
        this.toast = result.data
        return result.data
      })
    },
    // TODO emmit changeStatus
  }, // end methods
}
</script>

<style></style>
