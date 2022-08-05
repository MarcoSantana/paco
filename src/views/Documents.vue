<template>
  <v-container>
    <h1 class="document-page-title">Página de Documentos</h1>
    <v-card max-width="800">
      <v-card-title>Estamos en mantenimiento</v-card-title>
      <v-card-text>
        Esta característica se encuentra en mantenimiento.
        <p>Para administrar los documentos relacionados con alguna solicitud,
        por favor
        <br/>
        <span class="font-weight-black text-h6">diríjase a la
        sección de <v-btn class="ma-2 font-weight-black text-h6" color="info" to="request"
        outlined> "Solicitar examen"</v-btn></span></p>
    <v-img src="/img/IT_Support_Two_Color.svg" alt="" />
      </v-card-text>
    </v-card>
    <document-list v-if="!maintenance" class="document-list"></document-list>
    <!-- <v-sheet><add-document v-if="networkOnLine"></add-document></v-sheet> -->
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import DocumentList from '@/components/DocumentList'
// import AddDocument from '@/components/AddDocument'

export default {
  // components: { DocumentList, AddDocument },
  components: { DocumentList },
  computed: mapState('app', ['networkOnLine']),
   data: () => ({
     maintenance: true,
   })
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.document-page-title {
  text-align: center;
  margin-bottom: 60px;
}

.document-list {
  margin: 20px 0;
}
</style>
