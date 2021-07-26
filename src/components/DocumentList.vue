<template>
  <div>
    <p v-if="documents === null" class="infos-label">Cargando...</p>
    <p v-if="documents && !documents.length" class="infos-label">Aún no tiene documentos</p>
    <document-item
      v-for="(document, index) in documents"
      :key="document.id"
      class="box"
      :index="index"
      :is-document-deletion-pending="isDocumentDeletionPending(document.id)"
      :disable-actions="!networkOnLine"
      :data="document"
      @deleteDocument="deleteUserDocument"
    ></document-item>
  </div>
</template>

<script>
import DocumentItem from '@/components/DocumentItem'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: { DocumentItem },
  computed: {
    ...mapGetters('documents', ['isDocumentDeletionPending']),
    ...mapState('documents', ['documents']),
    ...mapState('app', ['networkOnLine']),
  },
  methods: mapActions('documents', ['deleteUserDocument']),
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.infos-label {
  text-align: center;
}

.document-row {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 10px auto;
  justify-content: space-between;
}
</style>
