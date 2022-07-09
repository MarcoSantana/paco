<template>
  <v-container>
    <v-card v-if="file && file.type" class="mx-auto mt-5" max-width="80%">
      <v-card-actions></v-card-actions>
      <div v-if="file.type === 'image/jpeg' || file.type === 'image/png'">
        <v-img :src="url" />
      </div>
      <div v-if="file.type === 'application/pdf'" class="justify-center mb-6">
        <v-card-text>
          <v-card-actions>
            <v-progress-linear
              v-if="loadedRatio < 1"
              color="accent"
              height="10"
              :value="loadedRatio * 100"
              striped
            />
            <v-slider
              v-if="numPages > 1"
              v-model="page"
              label="Página"
              step="1"
              min="1"
              :max="numPages"
              thumb-label="always"
              :thumb-size="20"
              ticks="always"
              tick-size="4"
            >
              <template v-slot:append>
                <v-icon
                  class="mt-1"
                  small
                  color="accent"
                  @click="page + 1 > numPages ? (page = numPages) : (page += 1)"
                >
                  mdi-chevron-right
                </v-icon>
              </template>

              <template v-slot:prepend>
                <v-icon
                  class="mt-1"
                  small
                  color="accent"
                  @click="page - 1 < 1 ? (page = 1) : (page -= 1)"
                >
                  mdi-chevron-left
                </v-icon>
              </template>
            </v-slider>
            <v-spacer v-if="numPages > 1" />
            <v-slider
              v-model="rotate"
              step="90"
              min="0"
              :max="270"
              thumb-label="always"
              :thumb-size="20"
              ticks="always"
              tick-size="4"
              color="orange"
              label="Rotación"
            ></v-slider>
          </v-card-actions>
          <pdf
            ref="myPdf"
            :src="url"
            :page="page"
            :rotate="rotate"
            @progress="loadedRatio = $event"
            @error="error"
            @num-pages="numPages = $event"
            @link-clicked="page = $event"
          />
        </v-card-text>
        <hr />
      </div>
      <v-snackbar v-model="snackbar" timeout="2000">
        {{ snackbarMessage }}
      </v-snackbar>
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
    currentPage: 0,
    dialog: false,
    err: null,
    file: null,
    fullscreen: false,
    loadedRatio: 0,
    loading: true,
    numPages: 0,
    page: 1,
    pageCount: 0,
    rotate: 0,
    show: true,
    snackbar: false,
    snackbarMessage: null,
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
    }, // getFile
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
