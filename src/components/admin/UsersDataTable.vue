<template>
  <v-sheet>
    <v-snackbar
      v-model="globalMessageSnackbar.show"
      :timeout="globalMessageSnackbar.timeout"
      absolute
      left
      shaped
      top
    >
      {{ globalMessageSnackbar.text }}
    </v-snackbar>
    <v-card class="mx-5 mt-3" max-with="800px">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        dense
      ></v-data-table>
      <v-btn color="info" @click="triggerGetUsers">Recargar</v-btn>
    </v-card>
    <v-col class="d-flex" cols="12" sm="6">
      <v-select
        v-model="orderBy"
        :items="orderCryteria"
        filled
        label="Creterrio de búsqueda"
        @change="triggerGetUsers"
      ></v-select>
    </v-col>
  </v-sheet>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'AdmminUsersView',
  data() {
    return {
      // queryConstraints: [["lastName", "==", "Santana"]],
      queryConstraints: null,
      orderBy: 'license',
      headers: [
        { text: 'cédula', value: 'license', filtereable: true },
        { text: 'appellido p.', value: 'lastname1', filtereable: true },
        { text: 'apellido m', value: 'lastname2', filtereable: true },
        { text: 'nombres ', value: 'name', filtereable: true },
        { text: 'Nombre público', value: 'displayname', filtereable: false },
        { text: 'correo electrónico', value: 'email', filtereable: true },
        { text: 'teléfono', value: 'phonenumber', filtereable: true },
        { text: 'datos incompletos', value: 'incomplete', filtereable: true },
        { text: 'activo', value: 'active', filtereable: true },
      ],
      search: '',
      snackbar: {},
      startAt: null,
      endAt: null,
      orderCryteria: [
        'active',
        'displayname',
        'email',
        'incomplete',
        'lastname1',
        'lastname2',
        'license',
        'name',
        'phonenumber',
      ],
    }
  }, // data
  computed: {
    ...mapState('admin', ['globalMessage', 'users']),
    globalMessageSnackbar() {
      return {
        show: true,
        text: this.globalMessage.message,
        timeout: 500,
        color: this.globalMessage.type,
      }
    }, // globalMessageSnackbar
  }, // computed

  beforeMount() {
    this.initUsers()
  },
  mounted() {
    if (this.users.length === 0) {
      this.triggerGetUsers()
    }
  },

  methods: {
    ...mapActions('admin', ['getUsers', 'initUsers']),
    ...mapMutations('admin', ['setUsers']),

    triggerGetUsers() {
      this.getUsers(this.query)
    }, // triggerGetUsers
  },
}
</script>
