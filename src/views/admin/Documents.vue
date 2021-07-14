<template>
  <div>
    <div>
      <h2>
        Documentos
      </h2>
    </div>
    <div>
      <ul v-for="document in documents" :key="document.id">
        <li>
          <document-details :document="document" @deleteDocument="deleteUserDocument"></document-details>
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
    }
  },
  computed: {
    ...mapState('admin', ['documents']),
    ...mapState('app', ['networkOnLine']),
  },
  mounted() {
    this.dispatchAllDocuments()
  },
  methods: {
    ...mapActions('admin', ['getAllDocuments', 'deleteUserDocument']),
    dispatchAllDocuments() {
      this.$store.dispatch('admin/getAllDocuments', null, { root: true })
    },
  },
}
</script>

<style></style>
