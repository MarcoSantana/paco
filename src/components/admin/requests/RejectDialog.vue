<template>
  <v-sheet>
    <v-dialog v-model="dialog" width="500">
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

      <v-card>
        <v-card-title
          class="text-h5 text--secondary white-text justify-center mb-2 warning"
        >
          Razón de rechazo
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="reason"
            counter="320"
            outlined
            background-color="amber lighten-4"
            color="orange orange-darken-4"
            label="Describa la razón del rechazo"
            hint="Describa en 320 caracteres ó menos la razón de rechazo"
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
          <v-btn :disabled="reason" outlined color="primary" text>
            <i class="mdi mdi-send"></i>
            {{ $t('actions.send') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>
<script src="./RejectDialog.js" />
