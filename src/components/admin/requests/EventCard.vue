<template>
  <v-sheet
    class="d-flex flex-column"
    :color="`${color} lighten-3`"
    max-width="400"
  >
    <v-snackbar v-model="snackbar" centered :color="eventUpdateMessage.type">
      {{ eventUpdateMessage.message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="yellow" text v-bind="attrs" @click="snackbar = false">
          {{ $t('actions.close') }}
        </v-btn>
      </template>
    </v-snackbar>

    <v-card-title>
      <span
        class="font-weight-light info-card-title"
        style="white-space:pre-wrap; word-break:keep-all;"
      >
        <slot name="header">
          <v-icon v-show="icon" left>mdi-information</v-icon>
          {{ localEvent.name ? localEvent.name : 'Evento sin titulo' }}
        </slot>
      </span>
    </v-card-title>
    <v-list class="px-3" :color="`${color} lighten-4`" dense>
      <v-list-item>
        <!-- TODO Link to see all related requests 202206.20-16.45 -->
        <v-btn
          x-small
          plain
          :to="{ name: 'adminRequest', params: { id: localEvent.id } }"
        >
          <v-icon left>mdi-eye</v-icon>
          Ver solicitudes
        </v-btn>
      </v-list-item>
      <slot name="description">
        <span>
          <v-form :disabled="!edit">
            <!-- name -->
            <v-text-field
              :value="localEvent.name"
              :label="$t('event.name')"
              hint="Nombre del evento"
              @input="localEvent.name = $event"
            ></v-text-field>
            <!-- /name -->
            <!-- description -->
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('description') }}</v-list-item-title>
                <v-textarea
                  :label="$t('description')"
                  class="mt-3"
                  :disabled="!edit"
                  dense
                  outlined
                  :value="localEvent.description"
                  @input="localEvent.description = $event"
                ></v-textarea>
              </v-list-item-content>
            </v-list-item>
            <!-- /description -->
            <!-- date -->
            <v-list-item>
              <v-list-item-icon>
                <v-dialog
                  v-model="dateDialog"
                  overlay-color="primary"
                  width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :disabled="!edit"
                      plain
                      x-small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon v-bind="attrs" v-on="on">mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title
                      color="primary lighten-2"
                      style="white-space:pre-wrap; word-break:keep-all;"
                      class="font-weight-light info-card-title text-center"
                    >
                      <v-icon left>mdi-calendar</v-icon>
                      Fecha de inicio
                    </v-card-title>
                    <v-date-picker
                      v-model="localEvent.date"
                      :label="$t('date')"
                      :disabled="!edit"
                      color="secondary"
                      dense
                      event-color="primary"
                      header-color="primary lighten-2"
                      outlined
                      :value="localEvent.date"
                      :show-current="true"
                      @input="localEvent.date(form.date)"
                    ></v-date-picker>
                  </v-card>
                </v-dialog>
              </v-list-item-icon>
              <v-list-item-title class="text-capitalize">
                {{ $t('date') }}
                {{ localEvent.date }}
              </v-list-item-title>
            </v-list-item>
            <!-- /date -->

            <!-- period -->
            <v-list-item>
              <v-list-item-icon>
                <v-dialog
                  v-model="periodDialog"
                  overlay-color="primary"
                  width="auto"
                  :value="event.period"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :disabled="!edit"
                      plain
                      x-small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title
                      color="primary lighten-2"
                      style="white-space:pre-wrap; word-break:keep-all;"
                      class="font-weight-light info-card-title text-center"
                    >
                      <v-icon left>mdi-calendar</v-icon>
                      Periodo de tiempo activo
                    </v-card-title>
                    <v-date-picker
                      v-model="localEvent.period"
                      :label="$t('date')"
                      :disabled="!edit"
                      color="secondary"
                      dense
                      event-color="primary"
                      header-color="primary lighten-2"
                      outlined
                      range
                      :value="localEvent.period"
                      :show-current="true"
                      @input="localEvent.period = $event"
                    ></v-date-picker>
                  </v-card>
                </v-dialog>
              </v-list-item-icon>
              <v-list-item-title class="text-capitalize">
                {{ $t('period') }}
                {{ localEvent.periodString }}
              </v-list-item-title>
            </v-list-item>
            <!-- /period -->
            <!-- userLimit -->
            <v-list-item>
              <v-row>
                <v-col cols="1" class="text-capitalize pr-1">
                  <v-list-item-icon class="pr-2">
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                </v-col>
                <v-col cols="10" class="text-capitalize">
                  <v-text-field
                    :disabled="!edit"
                    class="ma-3"
                    :label="$t('event.userLimit')"
                    type="number"
                    :value="localEvent.userLimit"
                    @input="localEvent.userLimit = $event"
                  />
                </v-col>
              </v-row>
            </v-list-item>
            <!-- /userLimit -->
          </v-form>
        </span>
      </slot>
    </v-list>

    <v-spacer></v-spacer>
    <v-card-actions>
      <v-switch
        v-model="edit"
        :value="true"
        color="error"
        :label="$t('actions.edit')"
      ></v-switch>
      <v-spacer />
      <span v-show="edit">
        <v-btn color="success" @click="save">{{ $t('actions.save') }}</v-btn>
        <v-btn color="warning">{{ $t('actions.clear') }}</v-btn>
      </span>
    </v-card-actions>
  </v-sheet>
</template>
<script>
import { isNil } from 'lodash'
import { mapState, mapActions, mapMutations } from 'vuex'

const eventFactory = event => {
  // TODO move this to models directory and import it from there 202206.20-15.02
  const formatDate = date => {
    if (isNil(date)) date = new Date()
    return new Date(date).toISOString().split('T')[0]
  }
  const newEvent = {
    ...event,
    description: event.description,
    date: formatDate(event.date),
    activateOn: formatDate(event.activateOn),
    deactivateOn: formatDate(event.deactivateOn),
  }

  return {
    ...newEvent,
    period: [newEvent.activateOn, newEvent.deactivateOn],
    periodString: `${newEvent.activateOn} - ${newEvent.deactivateOn}`,
  }
}

export default {
  name: 'EventCard',
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      error: null,
      edit: false,
      icon: 'mdi-info-outline',
      dateDialog: false,
      localEvent: eventFactory(this.event),
      periodDialog: false,
      snackbar: false,
    }
  },
  computed: {
    color() {
      return this.event.active ? 'success' : 'warning'
    },
    ...mapState('events', ['currentEvent', 'eventUpdateMessage']),
  },
  watch: {
    event(val) {
      if (isNil(val)) {
        this.error = 'El evento es requerido'
      }
    },
  },
  mounted() {
    console.log('EventCard mounted')
    console.log('localEvent', this.localEvent)
  },
  methods: {
    input(event) {
      console.log(event)
    },
    ...mapActions('events', ['updateEvent']),
    ...mapMutations('events', ['setCurrentEvent']),
    save() {
      console.log('save', this.localEvent)
      this.snackbar = true
      this.updateEvent(this.localEvent)
      this.setCurrentEvent(this.localEvent)
      this.edit = false
      setTimeout(() => {
        this.snackbar = false
      }, 2000)
    },
  },
}
</script>
