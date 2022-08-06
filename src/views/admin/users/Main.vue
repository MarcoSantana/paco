<template>
  <v-sheet>
    <v-snackbar :timeout="globalMessageSnackbar.timeout" v-model="globalMessageSnackbar.show" absolute left shaped top>
      {{ globalMessageSnackbar.text }}
    </v-snackbar>
    <ul v-if="users">
      <li v-for="user in users" :key="user.id">
        {{ user.displayName }}
      </li>
    </ul>
  </v-sheet>
</template>
<script>
import { mapActions, mapState } from 'vuex'



export default {

  name: 'AdmminUsersView',
  data() {
    return {
      // queryConstraints: [["lastName", "==", "Santana"]],
      queryConstraints: null,
      limit: 100,
      snackbar: {},
    }
  }, // data
  mounted() {
    this.triggerGetUsers()
  }, // mounted
  computed: {
    ...mapState('admin', ['globalMessage', 'users']),
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
      // qO.constraints = [["active", "==", "true"]]
      return qO
    }
  }, // computed
  methods: {
    ...mapActions('admin', ['getUsers']),

    /**
    * @typedef QueryObject
    * @property {number} limit
    * @property {Array<Array<String>> | null} constraints
    */

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
    },
    triggerGetUsers() {
      console.log('queryConstraints', this.query)
      this.getUsers(this.query)
    }, // triggerGetUsers
  }
}
</script>
