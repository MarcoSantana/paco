<template>
  <v-container>
    <v-card v-if="file && file.type" class="mx-auto mt-5" max-width="80%">
      <v-card-text>
        <v-img v-if="file.type === 'image/jpeg' || file.type === 'image/png'" :src="url"></v-img>
      </v-card-text>
      <div v-if="file.type === 'application/pdf'" class="justify-center mb-6">
        <v-card-text>
          <pdf
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
          <v-progress-linear v-if="loadedRatio < 1" color="accent" height="10" :value="loadedRatio * 100" striped />
          <v-slider
            v-model="page"
            step="1"
            min="1"
            :max="numPages"
            thumb-label="always"
            :thumb-size="20"
            ticks="always"
            tick-size="4"
          >
            <template v-slot:append>
              <v-icon large color="accent" @click="page + 1 > numPages ? (page = numPages) : (page += 1)"
                >mdi-plus</v-icon
              >
            </template>

            <template v-slot:prepend>
              <v-icon large color="accent" @click="page - 1 < 1 ? (page = 1) : (page -= 1)">mdi-minus</v-icon>
            </template>
          </v-slider>
        </v-card-actions>
      </div>
      <v-snackbar v-model="snackbar" timeout="2000">{{ snackbarMessage }}</v-snackbar>
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
    err: null,
    show: true,
    dialog: false,
    snackbarMessage: null,
    snackbar: false,
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
      this.snackbar = true
      this.snackbarMessage = err
    },
    async getFile(url) {
      this.loading = true
      try {
        // TODO check for 403 status and manage error
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            this.file = blob
            this.loading = false
          })
      } catch (err) {
        // <!--TODO: add snakbar-->
        this.error(err)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.file {
  width: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
