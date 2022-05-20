<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12">
        <h1 class="text-h4 font-weight-thin mb-4">{{ appTitle }}</h1>
        <h4 class="subheading">{{ clientName }}</h4>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" align="center" justify="center">
        <v-img alt="logo-bento" width="250px" src="@/assets/img/logo_cmmu.png" />
      </v-col>
    </v-row>
    <v-row v-if="!isUserLoggedIn" class="ma-3">
      <v-col cols="6">
        <v-row align="center" justify="center">
          <v-btn block color="primary" tile ripple icon to="/login">
            <v-icon>mdi-login</v-icon>Ingresar
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row align="center" justify="center">
          <v-btn color="primary" block tile ripple icon to="/signup">
            <v-icon>mdi-account-plus</v-icon>Crear cuenta
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-tooltip v-if="!isUserLoggedIn" bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="mx-2"
          fab
          dark
          small
          absolute
          fixed
          right
          color="info"
          href="http://cmmu.org.mx/web/aviso-de-privacidad/"
          target="_blank"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon dark>mdi-information</v-icon>
        </v-btn>
      </template>
      <span>Aviso de confidencialidad</span>
    </v-tooltip>

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
        inner: 'Inicio',
      },
      meta: [
        {
          name: 'Página inicial',
          content: `${this.appTitle}, página de inicio`,
          id: 'desc',
        },
      ],
    }
  },
  computed: {
    ...mapState('app', ['appTitle', 'clientName']),
    ...mapState('authentication', ['user', 'userClaims']),
    ...mapGetters('authentication', ['isUserLoggedIn', 'isUserAdmin', 'isUserIncomplete', 'getUserClaims']),
  },
  watch: {},
  mounted() {},
  methods: {
    async addRole() {
      const ref = this.$refs.adminEmail
      await callAddAdminRole(ref.value)
    },
  },
}
</script>

<style lang="scss" scoped></style>
