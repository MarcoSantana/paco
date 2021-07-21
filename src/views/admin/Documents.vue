<template>
  <div>
    <div>
      <h2>Documentos</h2>
    </div>
    <div>
      <ul>
        <li v-for="document in documents" :key="document.id">
          <document-details
            :ref="document.id"
            :document="document"
            @deleteDocument="deleteUserDocument"
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
