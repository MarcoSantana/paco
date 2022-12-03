<script>
export default {
  data: () => ({
    links: [
      {
        name: 'Solicitud de examen 2023',
        url: '/downloads/SolicitudCertificacion2023.pdf',
        description: 'Descargar documento PDF',
      },
    ],
  }),
}
</script>
<template>
  <v-container>
    <v-list dense>
      <v-list-item
        v-for="link in links"
        :key="link.name"
        link
        :href="link.url"
        target="_blank"
      >
        <v-list-item-content>
          {{ link.name }}
          <v-list-item-title>
            <span class="subtitle">{{ link.description }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>
