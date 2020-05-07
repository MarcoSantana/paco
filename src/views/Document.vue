<template>
  <div class="page-wrapper">
    <document-detail v-if="currentDocument" :document="currentDocument"></document-detail>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DocumentDetail from '@/components/DocumentDetail'

export default {
  components: { DocumentDetail },
  props: {
    id: String,
  },
  computed: {
    ...mapGetters('document', ['getDocumentById']),
    currentDocument() {
      return this.getDocumentById(this.id)
    },
  },
}
</script>
