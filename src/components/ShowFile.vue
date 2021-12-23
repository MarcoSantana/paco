<template>
  <v-container>
    <v-card v-if="file && file.type" class="mx-auto mt-5" max-width="80%">
      <v-card-text>
        <v-img v-if="file.type === 'image/jpeg'" :src="url"></v-img>
      </v-card-text>
      <div v-if="file.type === 'application/pdf'" class="justify-center mb-6">
        <v-card-text>
          <pdf
            v-if="file.type === 'application/pdf'"
            ref="myPdf"
            :src="url"
            :page="page"
            @progress="loadedRatio = $event"
            @error="error"
            @num-pages="numPages = $event"
            @link-clicked="page = $event"
          />
        </v-card-text>
        <hr />
        <v-card-actions>
          <v-progress-linear v-if="loadedRatio < 1" color="light-blue" height="10" :value="loadedRatio * 100" striped />
          <v-slider
            v-model="page"
            step="1"
            min="1"
            :max="numPages"
            append-icon="mdi-skip-next"
            prepend-icon="mdi-skip-previous"
            thumb-label="always"
            :thumb-size="20"
            ticks="always"
            tick-size="4"
            @click:append="page += 1"
            @click:prepend="page -= 1"
          />
        </v-card-actions>
      </div>
    </v-card>
    <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>
  </v-container>
</template>
<script>
import pdf from 'vue-pdf'

export default {
  components: { pdf },
  filters: {},
  props: { url: { type: String, required: true } },
  data: () => ({
    file: null,
    loading: true,
    // test
    show: true,
    currentPage: 0,
    pageCount: 0,
    rotate: 0,
    page: 1,
    numPages: 0,
    loadedRatio: 0,
  }),
  created() {
    this.getFile(this.url)
  },

  methods: {
    error(err) {
      alert(`Error${err}`)
    },
    async getFile(url) {
      this.loading = true
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
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
