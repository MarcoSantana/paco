<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" align="center" justify="center">
        <v-img alt="logo-bento" width="250px" src="@/assets/img/logo_cmmu.png" />
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12">
        <h1 class="text-h4 font-weight-thin mb-4">
          {{ appTitle }}
        </h1>
        <h4 class="subheading">
          {{ clientName }}
        </h4>
      </v-col>
    </v-row>
    <v-row v-if="!isUserLoggedIn" class="ma-3">
      <v-col cols="6">
        <v-row align="center" justify="center">
          <v-btn outlined color="success" to="login">
            Ya tengo cuenta
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row align="center" justify="center">
          <v-btn outlined color="error" to="/signup">
            No tengo cuenta
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-card v-if="isUserAdmin && isUserLoggedIn" width="80%">
      <form>
        <v-text-field
          id="admin-email"
          ref="adminEmail"
          type="email"
          hint="Debe ser un correo de un usuario existente"
          placeholder="Correo para otorgar permisos de administrador"
          required
        />
        <v-btn outlined color="info" @click.prevent="addRole">Hacer administrador</v-btn>
      </form>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { callAddAdminRole } from '@/firebase/functions'

export default {
  head() {
    return {
      title: {
        inner: 'Home',
      },
      meta: [
        {
          name: 'description',
          content: `${this.appTitle} home page`,
          id: 'desc',
        },
      ],
    }
  },
  computed: {
    ...mapState('app', ['appTitle', 'clientName']),
    ...mapState('authentication', ['user']),
    ...mapGetters('authentication', ['isUserLoggedIn', 'isUserAdmin']),
  },
  methods: {
    async addRole() {
      const ref = this.$refs.adminEmail
      await callAddAdminRole(ref.value)
    },
  },
}
</script>

<style lang="scss" scoped></style>
