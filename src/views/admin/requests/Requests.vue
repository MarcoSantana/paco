<template>
  <v-sheet class="ma-3">
    <div class="text-h3">Listado de solicitudes</div>
    <ul>
      <h3>TODO</h3>
      <li>
        Add CRUD buttons with slider config using dialog this is also a
        component which manages internally the events
      </li>
      <li>Sort this elements by active and creation date</li>
      <li>Add info button</li>
      <li>Fetch all event/requests from db</li>
      <li>Show active requests</li>
      <li>Create an admin state</li>
    </ul>
    <v-row>
      <v-col v-for="event in events" :key="event.id" cols="4">
        <event-card icon="mdi-information-outline" :event="event">
          <template #header>
            <span>
              <v-icon>mdi-information-outline</v-icon>
              <span>{{ event.name }}</span>
            </span>
          </template>
        </event-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
// Language: javascript
// Path: src/views/admin/requests/Requests.vue
import { isNil } from 'lodash'
import { mapActions, mapState } from 'vuex'
import EventCard from '@/components/admin/requests/EventCard'

export default {
  name: 'Requests',
  components: {
    EventCard,
  },
  data() {
    return {
      //
      myHeader: 'My header',
      body: 'Some text',
      username: 'John Doe',
      likes: 0,
    }
  },
  computed: {
    ...mapState('events', ['events']),

    /* ...mapGetters('events', ['getAllEvents']), */
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
