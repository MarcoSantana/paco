<template>
  <v-container>
    <v-card-title>
      Registros de correo electrónico
      <v-spacer></v-spacer>
    </v-card-title>
    <v-overlay
      id="loading-ovelay"
      data-test="registration-loading-overlay"
      :value="loading"
      opacity="0.8"
      color="secondary lighten-5"
    >
      <v-progress-circular
        color="secondary"
        rotate="180"
        indeterminate
        size="200"
        width="10"
      >
        <v-progress-circular
          size="160"
          color="editable"
          width="10"
          indeterminate
          rotate="90"
        >
          <v-progress-circular
            color="primary"
            rotate="270"
            indeterminate
            size="128"
            width="10"
          >
            <div class="text-capitalize font-weight-medium">
              {{ $t('messages.processing') }}
            </div>
          </v-progress-circular>
        </v-progress-circular>
      </v-progress-circular>
    </v-overlay>
    <v-sheet v-if="localMails">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        :expanded.sync="expanded"
        :footer-props="{
          showFirstLastPage: true,
          'items-per-page-text': 'Registros por página',
          'items-per-page-all-text': 'Todos',
          'items-per-page-options': [20, 25, 50, 100, 200, 250, 1000, -1],
        }"
        :headers="headers"
        :items-per-page="5"
        :items="localMails"
        :search="search"
        class="elevation-1"
        dense
        item-key="delivery.info.messageId"
        :loading="loading"
        loading-text="Cargando... Espere por favor"
        show-expand
        single-expand
      >
        <template v-slot:top>
          <v-toolbar flat></v-toolbar>
        </template>

        <template v-slot:no-data>
          <v-btn outlined color="primary" @click="reloadAllMails">
            {{ $t('actions.reload') }}
          </v-btn>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <v-card
              max-width="70%"
              class="pa-5 "
              color="grey lighten-2"
              v-html="item.message.html"
            ></v-card>
            <pre>{{ item }}</pre>
          </td>
        </template>
        <template v-slot:item.delivery.endTime="{ item }">
          {{ intlDate(item.delivery.endTime.toDate()) }}
        </template>
        <template v-slot:item.delivery.state="{ item }">
          <v-chip :color="getColor(item.delivery.state)" dark></v-chip>
        </template>
      </v-data-table>
    </v-sheet>
  </v-container>
</template>
<script>
import { DateTime } from 'luxon'
import MailsDB from '@/firebase/mails-db'

export default {
  data() {
    return {
      loading: true,
      localMails: null,
      expanded: [],
      singleExpand: false,
      search: '',
      headers: [
        {
          text: 'Remitente',
          align: 'start',
          sortable: true,
          filtereable: true,
          value: 'cc',
        },
        {
          text: 'Asunto',
          value: 'message.subject',
          sortable: false,
          filtereable: false,
        },
        {
          text: 'Fecha de entrega',
          sortable: true,
          value: 'delivery.endTime',
          filtereable: false,
        },
        {
          text: 'Estado',
          sortable: true,
          filtereable: true,
          value: 'delivery.state',
        },
      ],
    }
  },
  computed: {}, // computed
  async mounted() {
    await this.getLocalMails().then(() => (this.loading = false))
    // const mailsDb = new MailsDB()
    // this.localMails = await mailsDb.readAll()
  }, // mounted
  methods: {
    getColor(state) {
      return state.toLowerCase()
    }, // getColor
    intlDate(date) {
      return (
        DateTime.fromJSDate(date)
          .setLocale('es')
          // .toLocaleString(DateTime.DATETIME_FULL)
          .toLocaleString()
      )
    }, // intlDate
    async reloadAllMails() {
      await this.getAllMails().then(() => console.log('mails', this.mails))
    }, // reloadAllMails
    async getLocalMails() {
      const mailsDb = new MailsDB()
      this.localMails = await mailsDb.readAll()
      return true
    }, // getLocalMails
  }, // methods
}
</script>

<style></style>
