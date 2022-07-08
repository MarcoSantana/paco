<template>
  <v-sheet>
    <v-dialog
      v-model="dialog"
      close-delay="500"
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
          <v-icon class="mr-3">mdi-cancel</v-icon>
          <v-spacer />
          Rechazar
        </v-btn>
      </template>
      <!-- end activator -->

      <v-card>
        <v-card-title
          class="text-h5 text--secondary text--white justify-center mb-2 warning"
        >
          <v-col cols="12" class="text-center">
            Razón de rechazo
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
          <v-card-text>
            <v-textarea
              v-model="reason"
              counter="320"
              outlined
              background-color="amber lighten-4"
              color="orange orange-darken-4"
              label="Describa la razón del rechazo"
              required
              hide-details="auto"
            ></v-textarea>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn outlined color="error" text @click="reset()">
              <i class="mdi mdi-cancel"></i>
              {{ $t('actions.cancel') }}
            </v-btn>
            <v-spacer />
            <v-btn
              :disabled="reason.length < 1"
              outlined
              color="primary"
              text
              @click="changeStatus"
            >
              <i class="mdi mdi-send"></i>
              {{ $t('actions.send') }}
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
<script src="./RejectDialog.js" />
