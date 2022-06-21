<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1>Me be the single request view</h1>
        <ul>
          <h4>TODO</h4>
          <li>Get all users registered to this event</li>
          <li>Add to locales/es/.js the properties of a regular event</li>
          <li>Create a dialog to display all related info of the</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'SingleRequestView',
  data() {
    return {
      request: {},
      loading: true,
      id: this.$route.params.id,
    }
  },
  computed: {
    ...mapState('events', ['events']),
    event: {
      get() {
        return this.getEventById()(this.id)
      },
      // set(value) {
      //   this.events[this.id] = value
      // },
    },
  },
  mounted() {
    // this.getEventById(this.id)
  },
  methods: {
    ...mapGetters('events', ['getEventById']),
  },
}
</script>
