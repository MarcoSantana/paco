<template
  ><v-container>
    <v-card v-if="file && file.type" class="mx-auto mt-5" max-width="80%">
      <v-img v-if="file.type === 'image/jpeg'" :src="url"></v-img>
      <div v-if="file.type === 'application/pdf'">
        <pdf :src="url"></pdf>
      </div>
    </v-card>
    <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>
  </v-container>
</template>
<script>
import pdf from 'vue-pdf'

export default {
  components: { pdf },
  props: { url: { type: String, required: true } },

  data: () => ({
    file: null,
    loading: true,
  }),
  created() {
    this.getFile(this.url)
  },

  methods: {
    async getFile(url) {
      this.loading = true
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          console.log('blob', blob)
          this.file = blob
          this.loading = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.file {
  width: 100%;
}
</style>
