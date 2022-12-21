<template>
  <v-sheet>
    <v-snackbar
      v-model="globalMessageSnackbar.show"
      :timeout="globalMessageSnackbar.timeout"
      absolute
      center
      color="globalMessageSnackbar.type"
      top
    >
      {{ globalMessageSnackbar.text }}
    </v-snackbar>
    <!-- Add multiple selected users actions like delete or send some message (not delete, bc. it is too grave)-->
    <v-card class="mx-5 mt-3" max-with="800px">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        >
          <template v-if="search !== null" v-slot:append>
            <v-btn color="error" icon @click="search = null">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-card-title>
      <v-data-table
        v-model="selectedUsers"
        :headers="headers"
        :items="users"
        :search="search"
        multi-sort
        show-select
        dense
      >
        <template v-slot:top>
          <v-dialog
            v-model="userDialog.show"
            :fullscreen="userDialog.fullscreen"
            max-width="500px"
            persistent
          >
            <v-card>
              <v-toolbar flat color="primary" dark>
                <v-toolbar-title class="font-weight-light">
                  <v-card-title v-if="userDialog.user">
                    <span class="text-h5">
                      {{ userDialog.user.displayName }}
                    </span>
                  </v-card-title>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="error" icon small @click="showDialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <component
                :is="comp"
                v-if="comp"
                :key="userDialog.user.id"
                :user="userDialog.user"
              ></component>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.createTimestamp="{ item }">
          {{
            item.createTimestamp
              ? new Date(item.createTimestamp).toLocaleDateString()
              : $t(`${'errors.missingData'}`)
          }}
        </template>
        <template v-slot:no-results>
          No encontramos resultados. Puede recargar e intentar de nuevo, ó usar
          la búsqueda especializada.
          <div>
            <v-btn color="primary" @click="triggerGetUsers">Recargar</v-btn>
          </div>
          <v-select
            v-model="select"
            :items="criteria"
            hint="Buscar por"
            item-text="text"
            item-value="value"
            label="Criterio de búsqueda"
            persistent-hint
            return-object
            single-line
          ></v-select>
          <v-text-field
            v-model="specialSearch"
            :disabled="!select"
            :label="select.text ? select.text : 'Elija un criterio de búsqueda'"
            :type="select.type"
            append-icon="mdi-magnify"
            hint="Búsqueda especializada"
            required
          >
            <template v-slot:append>
              <v-btn
                v-if="specialSearch"
                large
                text
                color="primary"
                @click="triggerDbSearch"
              >
                <v-icon left>mdi-target</v-icon>
                Buscar {{ select.text }}
              </v-btn>
            </template>
          </v-text-field>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="showUser(item)">mdi-eye</v-icon>
          <v-icon small class="mr-2" @click="editUser(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteUser(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:no-data>
          Parece que no hay datos cargados.
          <v-btn color="primary" @click="triggerGetUsers">Recargar</v-btn>
        </template>
        <!-- /no-data -->
      </v-data-table>
    </v-card>
  </v-sheet>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'AdmminUsersView',
  data() {
    return {
      componentName: '',
      criteria: [
        { value: 'active', text: 'activo', type: 'boolean' },
        { value: 'email', text: 'correo electrónico', type: 'email' },
        { value: 'incomplete', text: 'datos incompletos', type: 'boolean' },
        { value: 'lastname1', text: 'primer apellido', type: 'name' },
        { value: 'lastname2', text: 'segundo apellido', type: 'name' },
        { value: 'displayName', text: 'nombre completo' },
        { value: 'license', text: 'cédula profesional', type: 'string' },
        { value: 'name', text: 'nombres' },
        { value: 'phonenumber', text: 'número de teléfono', type: 'tel' },
      ], // criteria
      endAt: null,
      fullscreen: false,
      headers: [
        {
          text: 'Cédula (licenciatura)',
          value: 'license',
          filtereable: true,
          sortable: true,
        },
        {
          text: 'Apellido p.',
          value: 'lastname1',
          filtereable: true,
          sortable: true,
        },
        {
          text: 'Apellido m.',
          value: 'lastname2',
          filtereable: true,
          sortable: true,
        },
        { text: 'Nombres ', value: 'name', filtereable: true, sortable: true },
        {
          text: 'Nombre completo',
          value: 'displayName',
          filtereable: true,
          sortable: true,
        },
        {
          text: 'Fecha de inscripción',
          value: 'createTimestamp',
          filtereable: false,
          sortable: true,
        },
        {
          text: 'correo electrónico',
          value: 'email',
          filtereable: true,
          sortable: false,
        },
        { text: 'Acciones', value: 'actions', sortable: false },
      ], // headers
      orderBy: 'license',
      queryConstraints: null,
      /** @type {?string} */
      search: null,
      selectedUsers: [],
      /** @type {boolean} */
      showDialog: false,
      snackbar: {},
      specialSearch: null,
      startAt: null,
      select: {},
    }
  }, // data
  computed: {
    ...mapState('admin', ['globalMessage', 'users']),
    comp() {
      if (!this.componentName) return
      return () => import(`./dialogs/${this.componentName}.vue`)
    },
    globalMessageSnackbar() {
      return {
        show: this.globalMessage.message,
        text: this.globalMessage.message,
        timeout: 500,
        color: this.globalMessage.type,
      }
    }, // globalMessageSnackbar
    /** Data needed to display an action dialog
     * @returns {Object} UserDialog
     * @returns {string} UserDialog.is
     * @returns {boolean} UserDialog.show
     * @returns {Object} UserDialog.user
     */
    userDialog() {
      return {
        /** @type {boolean} is */
        is: this.componentName ? this.componentName : 'UserShow',
        /** @type {boolean} */
        fullscreen: this.fullscreen,
        /** @type {string} show */
        show: this.showDialog,
        /** @type {Object} show */
        user: this.selectedUsers[0],
      }
    }, // userDialog
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
    ...mapActions('admin', ['getUsers', 'initUsers', 'searchUser']),
    ...mapMutations('admin', ['setUsers', 'setCurrentUser']),

    showUser(item) {
      if (!item) return
      this.componentName = 'UserShow'
      this.fullscreen = false
      this.selectedUsers[0] = item
      this.setCurrentUser(item)
      this.showDialog = true
    }, // showUser

    editUser(item) {
      if (!item) return
      this.componentName = 'UserEdit'
      this.fullscreen = true
      this.selectedUsers[0] = item
      this.setCurrentUser(item)
      this.showDialog = true
    }, // editUser

    deleteUser(item) {
      if (!item) return
      this.componentName = 'UserDelete'
      this.fullscreen = false
      this.selectedUsers[0] = item
      this.setCurrentUser(item)
      this.showDialog = true
    }, // editUser

    triggerDbSearch() {
      console.log('SpecialSearch', this.specialSearch)
      this.search = this.specialSearch
      const constraints = [[this.select.value, '==', this.specialSearch]]
      console.log('constraints', constraints)
      this.searchUser(constraints)
    }, // triggerDbSearch

    triggerGetUsers() {
      this.getUsers(this.query)
    }, // triggerGetUsers

    /** Factory
     * @param {Object} userDialog
     * @param {string} userDialog.is - The component to be loaded
     * @param {boolean} show
     * @param {Object} user - The user to be edited
     */
  },
}
</script>
