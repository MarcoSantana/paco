<template>
  <v-sheet class="ma-3">
    <div class="text-h3">Listado de solicitudes</div>
    <ul>
      <h3>TODO</h3>
      <li><strike>Sort this elements by active and creation date</strike></li>
      <li>Add info button</li>
    </ul>
    <v-row>
      <v-col v-for="event in localEvents" :key="event.id" cols="sm">
        <event-card icon="mdi-information-outline" :event="event">
          <template #header></template>
        </event-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
// Language: javascript
// Path: src/views/admin/requests/Requests.vue

import { isNil, cloneDeep } from 'lodash'
import { mapActions, mapState } from 'vuex'
import EventCard from '@/components/admin/requests/EventCard'

export default {
  name: 'Requests',
  components: {
    EventCard,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('events', ['events']),
    localEvents() {
      const events = cloneDeep(this.events)
      return events.sort((a, b) => {
        if (a.active && !b.active) {
          return -1
        }
        if (!a.active && b.active) return 1

        return a.created_at > b.created_at ? -1 : 1
      })
    },
  },
  mounted() {
    //
    console.log('Requests mounted')
    console.log(this.events)
    if (isNil(this.events)) {
      this.getAllEvents()
    }
  },
  methods: {
    ...mapActions('events', ['getAllEvents']),
  },
}
</script>
<style scoped>
.title {
  white-space: pre-wrap;
  word-break: keep-all;
}
</style>
