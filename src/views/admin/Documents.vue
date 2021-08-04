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
      <ul>
        <li v-for="document in documents" :key="document.id">
          <document-details
            :ref="document.id"
            :document="document"
            @deleteDocument="triggerSoftDeleteUserDocument"
            @acceptDocument="acceptDocument"
          ></document-details>
        </li>
      </ul>
    </div>
  </div>
</template>

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
      /*
        var first = db.collection("cities")
                .orderBy("population")
                .limit(25);

        return first.get().then((documentSnapshots) => {
          // Get the last visible document
          var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
          console.log("last", lastVisible);

          // Construct a new query starting at this document,
          // get the next 25 cities.
          var next = db.collection("cities")
                  .orderBy("population")
                  .startAfter(lastVisible)
                  .limit(25);
        });
      */
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
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/style.scss';
@import '@/theme/variables.scss';

ul {
  list-style-type: none;
  li {
    font-size: 1.3rem;
    font-weight: 400;
    border-radius: 5px;
    padding: 0;
    padding-top: 0.3rem;
    padding-bottom: 0;
  }
  li:nth-child(odd) {
    background-color: $light-accent;
  }
  li:nth-child(even) {
    background-color: $light-accent-1;
  }
}
</style>
