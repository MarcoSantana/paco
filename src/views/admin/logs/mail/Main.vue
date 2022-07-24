<template>
  <v-container>
    <v-card-title>
      Registros de correo electrónico
      <v-spacer></v-spacer>
    </v-card-title>
    <v-sheet>
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
        }"
        :headers="headers"
        :items-per-page="5"
        :items="mails"
        :loading="loading"
        :search="search"
        class="elevation-1"
        dense
        item-key="delivery.info.messageId"
        loading-text="Cargando... Espere por favor"
        show-expand
        single-expand
      >
        <template v-slot:top>
          <v-toolbar flat></v-toolbar>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <pre>{{ item }}</pre>
          </td>
        </template>
        <template v-slot:item.delivery.state="{ item }">
          <v-chip :color="getColor(item.delivery.state)" dark></v-chip>
        </template>
      </v-data-table>
    </v-sheet>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      expanded: [],
      singleExpand: false,
      loading: false,
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
          text: 'Mensaje',
          value: 'message.html',
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
      mails: [
        {
          id:
            '<e6ba43a7-88e6-5f72-299f-738011b919b1@documentos.certificacionmedica.mx>',
          cc: 'marco.santana@gmail.com',
          message: {
            html:
              'El documento: Solicitud de certificacion ha cambiado de estado.  Por favor ingrese a la aplicación PAD para verificarlo. <div></div>',
            subject: 'Documento Solicitud de certificacion cambio de estado',
          },
          delivery: {
            attempts: 1,
            endTime: '8 de agosto de 2021, 20:39:13 UTC-5',
            error: null,
            info: {
              accepted: ['marco.santanta@gmail.com', 'mijas_89@hotmail.com'],
              messageId:
                '<e6ba43a7-88e6-5f72-299f-738011b919b1@documentos.certificacionmedica.mx>',
            },
            state: 'SUCCESS',
          },
        },
        {
          cc: 'daneliafitnes@gmail.com',
          message: {
            html:
              'El documento: Solicitud de certificacion ha cambiado de estado.  Por favor ingrese a la aplicación PAD para verificarlo. <div></div>',
            subject: 'Documento Solicitud de certificacion cambio de estado',
          },
          delivery: {
            attempts: 1,
            endTime: '9 de agosto de 2021, 20:39:13 UTC-5',
            error: null,
            info: {
              accepted: ['daneliafitnes@gmail.com', 'mijas_89@hotmail.com'],
              messageId:
                '<e6ba42a7-88e6-5f72-299f-738011b919b1@documentos.certificacionmedica.mx>',
            },
            state: 'ERROR',
          },
        },
      ], // mails
    }
  },
  methods: {
    getColor(state) {
      return state.toLowerCase()
    }, // getColor
  }, // methods
}
</script>

<style></style>
