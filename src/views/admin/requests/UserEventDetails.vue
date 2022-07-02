<template>
  <v-sheet>
    <v-list-item>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-list-item-icon>
            <v-icon
              v-if="user.incomplete"
              v-bind="attrs"
              v-on="on"
              class="pt-1 pl-1"
              color="pink"
              small
            >
              mdi-heart-broken
            </v-icon>
          </v-list-item-icon>
        </template>
        <span>{{ $t('messages.missing.datas') }}</span>
      </v-tooltip>

      <v-list-item-content>
        <v-list-item-title>
          {{ user.displayName | capitalize }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ user.email }}
          <v-spacer></v-spacer>
          {{ user.status.updateTimestamp | intlDate }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar>
        <v-img v-if="user.photoURL" :src="user.photoURL"></v-img>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-if="!user.photoURL" v-bind="attrs" v-on="on" color="grey">
              mdi-image-off
            </v-icon>
          </template>
          <span>{{ $t('messages.missing.photo') }}</span>
        </v-tooltip>
      </v-list-item-avatar>
    </v-list-item>
  </v-sheet>
</template>

<script>
import { isNil } from 'lodash'
import UserEventsDB from '@/firebase/user-events-db'
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
    localEventId() {
      if (isNil(this.eventId)) return null
      return this.eventId
    },
  },
  mounted() {
    console.clear()
    console.log('UserEventDetails mounted')
  }, // end of mounted
  asyncComputed: {
    async user() {
      if (isNil(this.userId)) return null
      const userEventsDB = new UserEventsDB(this.userId)
      const usersDB = new UsersDB()
      try {
        const userEvent = await userEventsDB.userEvent(this.localEventId)
        const user = await usersDB.read(this.userId)
        console.log('user', user)
        console.log('userEvent', userEvent)
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
