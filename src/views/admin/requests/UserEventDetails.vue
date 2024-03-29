<template>
  <v-sheet>
    <v-list-item
      v-if="user"
      @click="
        triggerSetCurrentUser(user)
        $router.push({ name: 'requestAssess', params: { userData: user } })
      "
    >
      <!--
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-list-item-icon>
            <v-icon
              v-if="user.incomplete"
              v-bind="attrs"
              class="pt-1 pl-1"
              color="pink"
              small
              v-on="on"
            >
              mdi-heart-broken
            </v-icon>
          </v-list-item-icon>
        </template>
        <span>{{ $t('messages.missing.datas') }}</span>
      </v-tooltip>
-->
      <v-list-item-content>
        <v-list-item-title>
          <v-badge dot :color="statusColor(requestStatus)">
            {{ user.displayName | capitalize }}
          </v-badge>
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ user.email }}
          <v-spacer></v-spacer>
          {{ user.status.updateTimestamp | intlDate }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-badge avatar bordered overlap color="white">
        <template v-if="user.incomplete" v-slot:badge>
          <v-avatar>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" color="pink" small v-on="on">
                  mdi-heart-broken
                </v-icon>
              </template>
            </v-tooltip>
          </v-avatar>
        </template>
        <v-list-item-avatar>
          <v-avatar size="40">
            <v-img v-if="user.photoURL" :src="user.photoURL"></v-img>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-if="!user.photoURL"
                  v-bind="attrs"
                  color="grey"
                  v-on="on"
                >
                  mdi-image-off
                </v-icon>
              </template>
              <span>{{ $t('messages.missing.photo') }}</span>
            </v-tooltip>
          </v-avatar>
        </v-list-item-avatar>
      </v-badge>
    </v-list-item>
  </v-sheet>
</template>

<script>
import { isNil } from 'lodash'
import UserEventsDB from '@/firebase/user-events-db'
import { mapState, mapActions } from 'vuex'
import UsersDB from '@/firebase/users-db'
import capitalize from '@/filters/capitalize'
import intlDate from '@/filters/intlDate'

export default {
  name: 'UserEventDetails',
  filters: {
    capitalize,
    intlDate,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: true,
    },
  }, // end of props

  computed: {
    ...mapState('admin', ['currentUser']),
    localEventId() {
      if (isNil(this.eventId)) return null
      return this.eventId
    },
    requestStatus() {
      return this.user.status.status ? this.user.status.status : 'incomplete'
    },
  },
  mounted() {}, // end of mounted
  methods: {
    ...mapActions('admin', ['triggerSetCurrentUser']),

    statusColor(status) {
      const colors = {
        pending: 'warning',
        rejected: 'error',
        accepted: 'success',
        incomplete: 'info',
      }
      return colors[status]
    }, // statusColor
  },
  asyncComputed: {
    async user() {
      if (isNil(this.userId)) return null
      const userEventsDB = new UserEventsDB(this.userId)
      const usersDB = new UsersDB()
      try {
        const userEvent = await userEventsDB.userEvent(this.localEventId)
        const user = await usersDB.read(this.userId)
        console.log('userEvent: ', userEvent)
        return {
          ...user,
          documents: { ...userEvent.documents },
          status: userEvent,
        }
      } catch (e) {
        // TODO create toast with home link
        // TODO log error in db
        console.log('Error fetching user-event', e)
        console.log(userEventsDB)
      }
      return null
    },
  },
}
</script>

<style></style>
