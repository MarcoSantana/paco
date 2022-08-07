<template>
  <v-sheet>
    <v-snackbar :timeout="globalMessageSnackbar.timeout" v-model="globalMessageSnackbar.show" absolute left shaped top>
      {{ globalMessageSnackbar.text }}
    </v-snackbar>
    <div>First record {{ firstRecord }}</div>
    <div>last record {{ lastRecord }}</div>
    <v-btn color="info" @click="next">
      Next {{ limit }}
    </v-btn>
    <v-card max-with="800px">
      <v-card-title>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="users" :search="search" dense></v-data-table>
    </v-card>
    <v-col class="d-flex" cols="12" sm="6">
      <v-select :items="orderCryteria" v-model="orderBy" @change="triggerGetUsers" filled label="Creterrio de búsqueda">
      </v-select>
    </v-col>
  </v-sheet>
</template>
<script>
import { cloneDeep, orderBy } from 'lodash'
import { mapActions, mapMutations, mapState } from 'vuex'
/** 
active true
displayName "ERIKA JAZMIN GARCIA HERNANDEZ"
email "hasumin_57@hotmail.com"
incomplete true
lastname1 "GARCIA"
lastname2 "HERNANDEZ"
license "10552395"
name "ERIKA JAZMIN"
phoneNumber "9613095919" 
*/

export default {

  name: 'AdmminUsersView',
  data() {
    return {
      // queryConstraints: [["lastName", "==", "Santana"]],
      queryConstraints: null,
      limit: 10,
      orderBy: 'license',
      headers: [
        { text: "cédula", value: "license", filtereable: true },
        { text: "appellido p.", value: "lastname1", filtereable: true },
        { text: "apellido m", value: "lastname2", filtereable: true },
        { text: "nombres ", value: "name", filtereable: true },
        { text: "Nombre público", value: "displayname", filtereable: false },
        { text: "correo electrónico", value: "email", filtereable: true },
        { text: "teléfono", value: "phonenumber", filtereable: true },
        { text: "datos incompletos", value: "incomplete", filtereable: true },
        { text: "activo", value: "active", filtereable: true },
      ],
      search: '',
      snackbar: {},
      startAt: null,
      endAt: null,
      orderCryteria: [
        "active",
        "displayname",
        "email",
        "incomplete",
        "lastname1",
        "lastname2",
        "license",
        "name",
        "phonenumber",
      ]
    }
  }, // data
  beforeMount() {
    // this.initUsers()
  }, // beforeCreate
  mounted() {
    this.initUsers()
    if (!this.users)
      this.triggerGetUsers()
  }, // mounted
  computed: {
    ...mapState('admin', ['globalMessage', 'users']),
    firstRecord() {
      return this.users.length > 0 ? this.users[0][this.orderBy] : null
    },
    lastRecord() {
      return this.users.length > 0 ? this.users[this.users.length - 1][this.orderBy] : null
    },
    globalMessageSnackbar() {
      return {
        show: true,
        text: this.globalMessage.message,
        color: this.globalMessage.type
      }
    }, // globalMessageSnackbar
    query() {
      /** @type QueryObject */
      const qO = this.queryFactory()
      qO.limit = this.limit
      qO.orderBy = [[this.orderBy, 'asc']]
      qO.startAt = this.startAt
      qO.endAt = this.endAt
      // qO.constraints = [["active", "==", "true"]]
      return qO
    }
  }, // computed
  methods: {
    ...mapActions('admin', ['getUsers', 'initUsers']),
    ...mapMutations('admin', ['setUsers']),

    /**
    * @typedef QueryObject
    * @property {number} limit
    * @property {Array<Array<String>> | null} constraints
    */

    next() {
      this.startAt = this.lastRecord
      this.triggerGetUsers()
    },

    /** Creates a QueryObject
     *  @name QueryFactory
     *  @function
     *  @returns {QueryObject}
    */
    queryFactory: () => {
      return {
        /** @type {number} */
        limit: 10,
        /** @type {Array<Array<String>> | null} */
        constraints: null,
      }
    }, // queryFactory

    sortUsers() {
      /** @type {Array<Object>} */
      const users = orderBy(cloneDeep(this.users), [this.orderBy], ["asc"])
      this.setUsers(users)
    }, // reorderUsers

    triggerGetUsers() {
      this.getUsers(this.query)
      this.sortUsers()
      localStorage.setItem('users', JSON.stringify(this.users))
    }, // triggerGetUsers
  }
}
</script>
