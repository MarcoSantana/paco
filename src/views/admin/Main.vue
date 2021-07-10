<template>
  <div class="box">
    <h2>Funciones de administración</h2>
    <users />
    <h3><span style="color: red">TODO</span> documents to be checked</h3>
    <div>
      Documents
      {{ documents }}
    </div>
    <h3><span style="color: red">TODO</span> Certification requests to be checked</h3>
    <h3><span style="color: red">TODO</span> CRUD for catalogs (such as hospitals, colleges)</h3>
  </div>
</template>

<script>
import Users from '@/components/admin/Users.vue'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'AdminMain',
  components: { Users },
  computed: {
    ...mapGetters('documents', ['isDocumentDeletionPending']),
    ...mapState('documents', ['documents']),
    ...mapState('app', ['networkOnLine']),
  },
  mounted() {
    this.dispatchAllDocuments()
  },
  methods: {
    ...mapActions('documents', ['getAllDocuments']),
    dispatchAllDocuments() {
      this.$store.dispatch('documents/getAllDocuments', null, { root: true })
    },
  },
}
</script>

<style></style>
