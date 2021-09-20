<script>
import { mapState, mapActions } from 'vuex'
import DocumentDetails from '@/components/admin/DocumentDetails'

export default {
  components: { DocumentDetails },
  data() {
    return {
      showData: false,
      paginationStart: 1,
      limit: 10,
      constraints: null,
      // Sorting
      currentSort: 'userName',
      currentSortDirection: 'asc',
    }
  },
  computed: {
    ...mapState('admin', ['documents']),
    ...mapState('app', ['networkOnLine']),
    firstDocument() {
      return this.documents[0]
    },
    lastDocument() {
      return this.documents[this.documents.length - 1]
    },
  },
  mounted() {
    this.paginateDocumentsForward()
    // FIXME
  },
  methods: {
    ...mapActions('admin', ['getAllDocuments', 'deleteUserDocument', 'triggerSoftDeleteUserDocument']),
    dispatchAllDocuments() {
      this.$store.dispatch('admin/getAllDocuments', null, { root: true })
    },
    paginateDocumentsForward() {
      this.paginationStart += this.limit
      const payload = { constraints: this.constraints }
      payload.startAt = this.documents ? this.lastDocument.id : null
      payload.startAfter = null
      payload.limit = this.limit ? Number(this.limit) : 10
      this.$store.dispatch('admin/getAllDocuments', payload, { root: true })
    },

    paginateDocumentsBackwards() {
      this.paginationStart -= this.limit
      const payload = { constraints: this.constraints }
      payload.endAt = this.documents ? this.firstDocument.id : null
      payload.startAt = null
      payload.limit = this.limit ? Number(this.limit) : 10
      this.$store.dispatch('admin/getAllDocuments', payload, { root: true })
    },
    sort(s) {
      // WIP
      if (s === this.currentSort) {
        this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc'
      }
      const payload = { constraints: this.constraints }
      payload.limit = this.limit ? +this.limit : 10
      payload.orderBy = [[s, this.currentSortDirection]]
      console.log(payload.orderBy)
      this.$store.dispatch('admin/getAllDocuments', payload, { root: true })
      this.currentSort = s
    },
  },
}
</script>
<template>
  <div>
    <div>
      <h2>Documentos</h2>
    </div>
    <div>
      <div class="button" @click="paginateDocumentsForward()">
        Siguiente
      </div>
      <div class="button" @click="paginateDocumentsBackwards()">
        Atrás
      </div>
      <table>
        <thead>
          <th>Mostrar</th>
          <th @click="sort('userName')">Nombre</th>
          <th @click="sort('name')">Documento</th>
          <th @click="sort('createTimestamp')">Fecha de creación</th>
          <th @click="sort('status')">Estado</th>
          <th>Aceptar</th>
          <th>Por revisar</th>
          <th>Rechazar</th>
        </thead>
        <document-details
          v-for="document in documents"
          :key="document.id"
          :ref="document.id"
          :document="document"
          @deleteDocument="triggerSoftDeleteUserDocument"
        ></document-details>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/theme/style.scss';
@import '@/theme/variables.scss';

table {
  margin-top: 0.35rem;
  border: 1px solid $main;
  border-spacing: 0px;
  border-radius: 0.5rem;
  padding: 0.35rem;
  td {
    margin-right: 0.35rem;
    padding: 0.35rem;
  }
  tr:nth-child(odd) {
    background-color: $light-accent;
    &:hover {
      background-color: lighten($light-accent, 15%);
    }
  }
  tr:nth-child(even) {
    background-color: $light-accent-1;
    &:hover {
      background-color: lighten($light-accent, 15%);
    }
  }
}
</style>
