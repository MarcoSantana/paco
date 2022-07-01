<template>
  <v-sheet v-if="events">
    <v-app-bar
      color="primary"
      dark
      flat
      appearant
      clipped-left
      clipped-right
      clipped-top
      clipped-bottom
      tile
      height="60%"
    >
      <v-select
        v-model="selectedEvent"
        :items="events"
        :label="`${$t('event.event')}`"
        class="mr-2 mt-2"
        dense
        item-text="name"
        item-value="id"
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-fullscreen</v-icon>
      </v-btn>
    </v-app-bar>
    <RequestsPeriodChart
      v-if="selectedEvent"
      :event="event"
    ></RequestsPeriodChart>
  </v-sheet>
</template>

<script>
import EventsDB from '@/firebase/events-db'
import { isNil } from 'lodash'
import RequestsPeriodChart from './RequestsPeriodChart.vue'

export default {
  name: 'RequestsPerPeriod',
  components: {
    RequestsPeriodChart,
  },

  data() {
    return {
      events: [],
      selectedEvent: null,
    }
  },
  asyncComputed: {
    async event() {
      if (isNil(this.selectedEvent)) return null
      const localEvent = await this.getEvent(this.selectedEvent)
      const users = await this.getEventUsers(this.selectedEvent)
      return {
        ...localEvent,
        users,
      }
    },
  },
  computed: {},

  watch: {
    events(val) {
      if (!isNil(val)) this.selectedEvent = val.id
    },
  },

  async mounted() {
    this.events = await this.listEvents()
    this.$nextTick(() => {
      this.selectedEvent = this.events[0].id
      console.log('selectedEvent', this.selectedEvent)
    })
  },

  methods: {
    async getEventUsers(eventId) {
      const eventsDB = new EventsDB()
      const result = await eventsDB.getUsers(eventId)
      return result
    },
    async getEvent(eventId) {
      const eventsDB = new EventsDB()
      const result = await eventsDB.read(eventId)
      return result
    },
    async listEvents() {
      const eventDB = new EventsDB()
      const events = await eventDB.readAllAsAdmin()
      return events.sort((a, b) => {
        return a.activeOn > b.activeOn ? 1 : -1
      })
    },
  }, // methods
}
</script>

<style></style>
