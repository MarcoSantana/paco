<template>
  <div class="page-wrapper">
    <document-detail
      v-if="currentDocument"
      :document="currentDocument"
    ></document-detail>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DocumentDetail from '@/components/DocumentDetails'

export default {
  components: { DocumentDetail },
  props: {
    id: String,
  },
  computed: {
    ...mapGetters('documents', ['getDocumentById']),
    currentDocument() {
      return this.getDocumentById(this.id)
    },
  },
}
</script>
