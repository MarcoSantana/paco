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
      <v-col cols="4">
        <info-card color="info" :editable="true" info="">
          <template #title>
            {{ body }}
          </template>
          <template #description></template>
        </info-card>
      </v-col>
      <v-col cols="4">
        <info-card title="Foo" color="warning" icon="home">
          <template slot="title"></template>
        </info-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
// Language: javascript
// Path: src/views/admin/requests/Requests.vue
import { mapActions, mapGetters, mapState } from 'vuex'
import InfoCard from '@/components/admin/requests/InfoCard'

export default {
  name: 'Requests',
  components: {
    InfoCard,
  },
  data() {
    return {
      //
      body: 'Some text',
      username: 'John Doe',
      likes: 0,
    }
  },
  computed: {
    ...mapState({
      //
    }),
    ...mapGetters({
      //
    }),
  },
  methods: {
    ...mapActions({
      //
    }),
    ...mapGetters({
      //
    }),
  },
}
</script>
<style scoped>
.title {
  white-space: pre-wrap;
  word-break: keep-all;
}
</style>
