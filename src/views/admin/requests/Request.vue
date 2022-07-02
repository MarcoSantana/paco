<template>
  <v-sheet class="container" v-if="event">
    <div class="row">
      <div class="text-h5 text-center col-md-12 mb-3">
        Solicitudes para {{ event.name }}
      </div>
    </div>
    <v-card max-width="500" class="mx-auto">
      <v-toolbar color="primary lighten-2" dark>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title v-if="users">
          Inbox
          {{ pendingUsers.length }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <!--
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
          -->
      </v-toolbar>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title">
          <v-list-item-icon>
            <v-icon v-if="item.icon" color="pink">
              mdi-star
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>

          <v-list-item-avatar>
            <v-img :src="item.avatar"></v-img>
          </v-list-item-avatar>
        </v-list-item>
      </v-list>
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
import { isNil } from 'lodash'
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
    }
  }, // end of data
  asyncComputed: {
    async event() {
      const localEvent = this.events.find(event => event.id === this.id)
      const users = await this.getEventUsers(this.id).then(arr =>
        arr.filter(user => user.status === 'pending')
      )
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
