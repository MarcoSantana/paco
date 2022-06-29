<template>
  <div class="page-wrapper">
    <h1 class="request-page-title">Solicitudes</h1>
    <v-list two-line>
<template v-for="event in events">
        <v-list-item :key="event.name" class="box active">
          <router-link :to="{ name: 'eventView', params: { id: event.id } }">
            <v-list-item-content>
              <v-list-item-title v-text="event.name" />
              <v-list-item-subtitle v-text="event.description" />
            </v-list-item-content>
          </router-link>
        </v-list-item>

      </template>
  <!-- temp -->
      <template v-for="event in events">
        <v-list-item v-if="event.active" :key="event.name" class="box active">
          <router-link :to="{ name: 'eventView', params: { id: event.id } }">
            <v-list-item-content>
              <v-list-item-title v-text="event.name" />
              <v-list-item-subtitle v-text="event.description" />
            </v-list-item-content>
          </router-link>
        </v-list-item>
        <v-list-item
          v-else
          :key="`disabled-${event.name}`"
          class="box inactive"
        >
          <a>
            <v-list-item-content>
              <v-list-item-title v-text="event.name" />
              <v-list-item-subtitle>
                Evento inactivo
              </v-list-item-subtitle>
            </v-list-item-content>
          </a>
        </v-list-item>
      </template>
      <div v-if="!events" class="box">
        <h1 class="request-page-title">
          No hay eventos disponibles por ahora
          <img src="/img/Question_Two_Color.svg" alt="" />
        </h1>
      </div>
    </v-list>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
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

.active {
  background-color: $light-accent-1;
}

.inactive {
  background-color: $danger-color-light;
}
</style>
