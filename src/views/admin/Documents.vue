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
          <div class="box">
            <ul>
              <li>UserID: {{ document.id }} change me to the full name (do this as denormalized data)</li>
              <li>createTimestam: {{ document.createTimestamp }} (filter me with luxon)</li>
              <li>Document name: {{ document.name }}</li>
              <li>Status: {{ document.status }} (add me a color icon)</li>
            </ul>
            <div style="color: red;">
              <button @click="showData = !showData">>></button>TODO add a certification request display component
            </div>
            <div v-show="showData">{{ document.data }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
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
