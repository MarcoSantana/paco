<template>
  <v-container>
    Event>>>> {{ getEventById(id) }}
    <div>User event {{ getUserEvent(id) }}</div>
    <!--TODO: Check if the user has this event document registered, and create it or access it-->
    <add-request></add-request>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import AddRequest from '@/components/AddRequest.vue'

export default {
  components: { AddRequest },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters('events', ['getEventById', 'getUserEvent']),
    ...mapState('events', ['userEvents', 'currentEvent']),
  },
  mounted() {
    // this.$store.dis
    /* this.setUserEvent(this.id) */
    // TODO add loading state
    this.getUserEvents()
  },
  methods: { ...mapActions('events', ['setUserEvent', 'getUserEvents']) },
}
</script>

<style></style>
