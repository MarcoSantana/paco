<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="4">
        <v-card class="d-flex flex-column" color="green lighten-4" max-width="400" height="400">
          <v-card-title>
            <v-icon large left>
              mdi-account-group
            </v-icon>
            <span class="text-h6 font-weight-light">Usuarios registrados</span>
          </v-card-title>

          <v-card-text class="text-h5 font-weight-bold">
            <BarChart />
          </v-card-text>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-list-item class="grow" to="/users">
              <v-list-item-content>
                <v-list-item-title>Ver detalle</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card class="d-flex flex-column" max-width="400" height="400">
          <v-card-title>
            <v-icon large left>
              mdi-account-alert
            </v-icon>
            <span class="text-h6 font-weight-light">Estado de usuarios</span>
          </v-card-title>

          <v-card-text class="text-h5 font-weight-bold"></v-card-text>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-list-item class="grow" to="/users">
              <v-list-item-content>
                <v-list-item-title>Ver detalle</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="d-flex flex-column" max-width="400" height="400">
          <v-card-title>
            <v-icon large left>
              mdi-file-multiple
            </v-icon>
            <span class="text-h6 font-weight-light">Estado de documentos</span>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-card-text class="text-h5 font-weight-bold" style="height: 200;">
            <p class="text-h1 text-center">34</p>
            <p class="caption text-center">Por revisar</p>
          </v-card-text>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-list-item class="grow" to="/users">
              <v-list-item-content>
                <v-list-item-title>Ver detalle</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import BarChart from './BarChart.vue'

export default {
  components: { BarChart },
  data() {
    return {}
  },
}
</script>
