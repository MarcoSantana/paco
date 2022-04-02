<template>
  <v-container class="ma-5">
    <v-row class="ma-5">
      <v-col cols="2" offset="1" class="text-center">
        <v-img alt="logo-bento" width="250px" src="@/assets/img/logo_cmmu.png" />
      </v-col>
      <v-col cols="4" offset="1">
        <h1 class="home-page-title">{{ appTitle }}</h1>
        <h2 class="home-page-title">{{ clientName }}</h2>
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
