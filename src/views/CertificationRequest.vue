<template>
  <div class="page-wrapper">
    <h1 class="request-page-title">Solicitudes</h1>
    <v-list two-line>
      <template v-for="event in events">
        <v-list-item v-if="event.active" :key="event.name">
          <router-link :to="{ name: 'eventView', params: { id: event.id } }">
            <v-list-item-content>
              <v-list-item-title v-text="event.name" />
              <v-list-item-subtitle v-text="event.description" />
            </v-list-item-content>
          </router-link>
        </v-list-item>
      </template>
    </v-list>
    <add-request v-if="false"></add-request>
  </div>
</template>

<script>
import AddRequest from '@/components/AddRequest.vue'
import { mapState, mapActions } from 'vuex'

export default {
  components: { AddRequest },
  computed: {
    ...mapState('events', ['events', 'userEvents']),
  },
  mounted() {
    // TODO add a loading state
    this.$store.dispatch('events/getAllEvents', null, { root: true })
    this.getUserEvents()
    // TODO finish loading
  },
  methods: {
    ...mapActions('events', ['getUserEvents']),
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
