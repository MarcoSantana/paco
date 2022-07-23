<template>
  <v-sheet v-if="event" class="container">
    <div class="row">
      <div class="text-h5 text-center col-md-12 mb-3">
        Solicitudes {{ pending ? 'pendientes' : '' }} para {{ event.name }}
      </div>
    </div>
    <v-card max-width="500" class="mx-auto">
      <v-toolbar
        :color="`primary  ${pending ? 'warning' : ''} lighten-2`"
        :dark="!pending"
      >
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
        <v-toolbar-title v-if="users">
          Inbox
          <span v-if="pending" color="warning">
            {{ pendingUsers.length }}
          </span>
        </v-toolbar-title>
        <!--
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
          -->
      </v-toolbar>
      <v-list v-if="event">
        <user-event-details
          v-for="user in event.users"
          :key="user.userId"
          :user-id="user.userId"
          :event-id="event.id"
        ></user-event-details>
      </v-list>
    </v-card>
  </v-sheet>
</template>
<script>
import { isNil, orderBy } from 'lodash'
import EventsDB from '@/firebase/events-db'
import { mapState, mapGetters } from 'vuex'
import UserEventDetails from '@/views/admin/requests/UserEventDetails'

export default {
  name: 'UserRequestView',
  components: {
    UserEventDetails,
  },
  data() {
    return {
      request: {},
      loading: true,
      id: this.$route.params.id,
      pending: this.$route.params.pending,
    }
  }, // end of data
  asyncComputed: {
    async event() {
      const localEvent = this.events.find(event => event.id === this.id)
      const users = await this.getEventUsers(this.id).then(arr => {
        arr = orderBy(arr, ['createTimestamp'])
        return this.pending
          ? arr.filter(user => user.status === 'pending')
          : arr
      })
      if (!isNil(localEvent)) {
        return {
          ...localEvent,
          users,
        }
      }
      return null
    },
    async users() {
      if (isNil(this.id)) return null
      return this.getEventUsers(this.id)
    },
  },
  computed: {
    ...mapState('events', ['events']),
    pendingUsers() {
      if (isNil(this.users)) return null
      return this.event.users.filter(user => user.status === 'pending')
    },
  },
  mounted() {
    // this.getEventById(this.id)
  },
  methods: {
    ...mapGetters('events', ['getEventById']),
    async getEventUsers(eventId) {
      const eventsDB = new EventsDB()
      const result = await eventsDB.getUsers(eventId)
      return result
    },
  },
}
</script>
