<template>
  <v-container>
    <v-dialog v-model="infoDialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab color="info" dark v-bind="attrs" v-on="on">
          <v-icon>mdi-help-circle</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 primary lighten-2 white--text">
          ¿Por qué veo esta pantalla?
        </v-card-title>

        <v-card-text class="pt-2">
          <p>Para poder almacenar sus datos adecuadamente, necesitamos tenerlos todos y de forma correcta.</p>
          <p>
            Los datos obligatorios están marcados con una estrella
            <v-icon>mdi-star</v-icon>
          </p>

          <p>
            Puede cambiar los datos de este formulario y una vez que esté completo puede dar click en el botón de
            "Guardar cambios"
          </p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="infoDialog = false">
            Entiendo
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script src="./infoDialog.comp.js"></script>
