<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="6">
        <v-card class="d-flex flex-column" max-width="100%" height="400">
          <v-card-title>
            <v-icon large left>
              mdi-account-group
            </v-icon>
            <span class="text-h6 font-weight-light">Usuarios registrados</span>
          </v-card-title>
          <v-card-text class="text-h5 font-weight-bold">
            <RequestsPeriod
              :requests="requests"
              :period="period"
            ></RequestsPeriod>
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

      <v-col cols="6"><requests /></v-col>
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
        <registered-users></registered-users>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
// import BarChart from './BarChart.vue'
import RequestsPeriod from './RequestsPeriod.vue'
import RegisteredUsers from './RegisteredUsers.vue'
import Requests from './Requests.vue'

export default {
  components: {
    RequestsPeriod,
    RegisteredUsers,
    Requests,
  },
  data() {
    return {}
  },
}
</script>
