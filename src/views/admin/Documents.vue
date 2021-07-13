<template>
  <div>
    <div>
      <h2>
        Documents
      </h2>
      Remember that this is a view we need to create a list component and a element component taht recives the data via
      props <br />
      Style each 'li' with alternating colors <br />
      Remove 'decorations'
    </div>
    <div>
      <ul v-for="document in documents" :key="document.id">
        <li>
          <document-details :document="document"></document-details>
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
    ...mapActions('admin', ['getAllDocuments']),
    dispatchAllDocuments() {
      this.$store.dispatch('admin/getAllDocuments', null, { root: true })
    },
  },
}
</script>

<style></style>
