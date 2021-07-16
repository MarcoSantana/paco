<template>
  <div class="box">
    <h2>Funciones de administración</h2>
    <!-- <users /> -->
    <div>
      <documents />
    </div>
    <!-- <h3><span style="color: red">TODO</span> Certification requests to be checked</h3>
    <h3><span style="color: red">TODO</span> CRUD for catalogs (such as hospitals, colleges)</h3> -->
  </div>
</template>

<script>
// import Users from '@/components/admin/Users.vue'
import Documents from '@/views/admin/Documents.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'AdminMain',
  // components: { Users, Documents },
  components: { Documents },
  computed: {
    ...mapGetters('documents', ['isDocumentDeletionPending']),
    /* ...mapState('admin', ['documents']), */
    ...mapState('app', ['networkOnLine']),
  },
  mounted() {
    /* this.dispatchAllDocuments() */
  },
  methods: {
    /* ...mapActions('admin', ['getAllDocuments']), */
    /* dispatchAllDocuments() { */
    /*   this.$store.dispatch('admin/getAllDocuments', null, { root: true }) */
    /* }, */
  },
}
</script>

<style></style>
