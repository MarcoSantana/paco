<template>
  <div class="page-wrapper">
    <h1 class="request-page-title">Solicitud de certificación</h1>
    <h2>
      TODO Here we must check if there is an active request event (aviable certification exams) and if the user already
      started the process 202111.25-18.46
    </h2>
    <h2>TODO List aviable exams 202111.25-18.47</h2>
    <div v-if="events">
      <h2>TODO Use this list to add a request to that event 202111.25-21.32</h2>
      <ul v-for="event in events" :key="event.id">
        <li v-if="event.active">Event {{ event.name }}</li>
      </ul>
    </div>
    <add-request v-if="false"></add-request>
  </div>
</template>

<script>
import AddRequest from '@/components/AddRequest.vue'
import { mapState } from 'vuex'

export default {
  components: { AddRequest },
  computed: {
    ...mapState('events', ['events']),
  },
  mounted() {
    this.$store.dispatch('events/getAllEvents', null, { root: true })
  },
}
</script>
<style lang="scss" scoped>
@import '@/theme/variables.scss';

.request-page-title {
  text-align: center;
  margin-bottom: 60px;
}
</style>
