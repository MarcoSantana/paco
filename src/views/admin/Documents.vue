<script>
import { mapState, mapActions } from 'vuex'
// import { callCreateUserListSheet } from '@/firebase/functions'

export default {
  data() {
    return {
      showData: false,
      paginationStart: 1,
      limit: 100,
      constraints: null,
      // Sorting
      currentSort: 'userName',
      currentSortDirection: 'asc',
      documentsSearch: null,
      documentHeaders: [
        { text: 'identificador', value: 'id' },
        { text: 'Nombre', value: 'userName' },
        { text: 'Tipo de documento', value: 'name' },
        { text: 'Estado', value: 'status' },
        { text: 'última modificación', value: 'data.createTimestamp' },
      ],
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
      } else {
        this.$refs[this.currentSort].classList.remove('selected')
      }
      const payload = { constraints: this.constraints }
      payload.limit = this.limit ? +this.limit : 10
      payload.orderBy = [[s, this.currentSortDirection]]
      this.$store.dispatch('admin/getAllDocuments', payload, { root: true })
      // console.log('th', this.$refs[s])
      // console.log('th class', this.$refs[s].classList)
      // this.$refs[s].style['background-color'] = 'red'
      this.$refs[s].classList.add('selected')
      this.currentSort = s
    },
  }, // methods
}
</script>
<template>
  <div style="width: 100%">
    <div>
      <h2>Documentos</h2>
    </div>
    <v-card v-if="documents"
      ><v-card-title
        >Buscar en documentos <v-spacer />
        <v-text-field v-model="documentsSearch" append-icon="mdi-magnify"></v-text-field
      ></v-card-title>
      <v-data-table :headers="documentHeaders" :items="documents" :search="documentsSearch"></v-data-table>
    </v-card>
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
  width: 100%;
  td {
    margin-right: 0.35rem;
    padding: 0.35rem;
  }
  th {
    padding: 0.4rem;
  }
  th small {
    visibility: hidden;
    font-size: 0.35rem;
  }
  .selected {
    background-color: $light-accent;
    font-size: 1.2rem;
    small {
      visibility: visible;
    }
  }
  // .selected small {
  //   visibility: visible;
  // }
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
} // table
</style>
