<template>
  <div class="page-wrapper">
    <h1 class="document-page-title">Página de Documentos</h1>
    <document-list class="document-list"></document-list>
    <!-- <add-document v-if="networkOnLine"></add-document> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DocumentList from '@/components/DocumentList'
// import AddDocument from '@/components/AddDocument'

export default {
  // components: { DocumentList, AddDocument },
  components: { DocumentList },
  computed: mapState('app', ['networkOnLine']),
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
