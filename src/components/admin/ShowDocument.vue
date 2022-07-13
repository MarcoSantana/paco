<template>
  <v-sheet v-if="!loading && urls && urls.length > 0" class="container">
    <v-card v-for="url in urls" :key="url" min-width="500px" max-width="90%">
      <v-card-title v-if="title">
        <v-tooltip top color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text icon v-bind="attrs" v-on="on" @click="toggleFullscreen">
              <v-icon v-if="!fullscreen">mdi-fullscreen</v-icon>
              <v-icon v-else>mdi-fullscreen-exit</v-icon>
            </v-btn>
            <v-spacer />
          </template>
          <span>Pantalla completa</span>
        </v-tooltip>
        <v-spacer />
        <span class="headline text-center">
          {{ capitalize($t(`document.types.${document.name}`)) }}
        </span>
        <v-spacer />
        <v-menu offset-y>
          <template v-slot:activator="{ on: onMenu }">
            <v-tooltip top color="primary">
              <template
                v-slot:activator="{ on: onTooltip, attrs: attrsTooltip }"
              >
                <v-btn
                  text
                  icon
                  v-bind="attrsTooltip"
                  v-on="{ ...onMenu, ...onTooltip }"
                >
                  <v-icon x-large>mdi-dots-horizontal</v-icon>
                </v-btn>
                <v-spacer />
              </template>
              <span>{{ $t('document.actions.of') | capitalize }}</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item ref="actionDownload" name="actionDownload" link>
              <v-list-item-icon>
                <v-icon>mdi-cloud-download</v-icon>
              </v-list-item-icon>
              {{ $t('document.actions.download') | capitalize }}
            </v-list-item>
            <v-list-item link @click="documentAcceptDialog">
              <v-list-item-icon>
                <v-icon>mdi-check</v-icon>
              </v-list-item-icon>
              {{ $t('document.actions.accept') | capitalize }}
            </v-list-item>
            <v-list-item ref="actionReject" link @click="documentRejectDialog">
              <v-list-item-icon>
                <v-icon>mdi-cancel</v-icon>
              </v-list-item-icon>
              {{ $t('document.actions.reject') | capitalize }}
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-delete</v-icon>
              </v-list-item-icon>
              {{ $t('document.actions.delete') | capitalize }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>
      <show-file class="container" :url="url" />
      <v-divider />
      <v-dialog
        v-model="fullscreen"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        @keydown.esc="fullscreen = false"
      >
        <v-lazy
          v-model="fullscreen"
          :options="{
            threshold: 0.5,
          }"
          min-height="100%"
          transition="fade-transition"
        >
          <v-sheet>
            <v-tooltip top color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  text
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="toggleFullscreen"
                >
                  <v-icon v-if="!fullscreen" x-large>mdi-fullscreen</v-icon>
                  <v-icon v-else class="ma-3" x-large>mdi-close</v-icon>
                </v-btn>
                <v-spacer />
              </template>
              <span v-if="!fullscreen">Pantalla completa</span>
              <span v-else>Salir de pantalla completa</span>
            </v-tooltip>
            <show-file
              class="container"
              :url="url"
              @toggleFullscreen="toggleFullscreen"
            />
          </v-sheet>
        </v-lazy>
      </v-dialog>
    </v-card>
    <document-reject-dialog
      :document="document"
      :show="showDocumentRejectDialog"
      @close="toggleDocumentRejectDialog"
    />
    <document-accept-dialog
      :document="document"
      :show="showDocumentAcceptDialog"
      @close="toggleDocumentAcceptDialog"
    />
  </v-sheet>
</template>

<script lang="js">
import { cloneDeep, capitalize } from 'lodash'
import { storage } from 'firebase'
import ShowFile from '@/components/ShowFile'
import DocumentRejectDialog from '@/components/admin/DocumentRejectDialog'
import DocumentAcceptDialog from '@/components/admin/DocumentAcceptDialog'

export default {
  name: 'ShowDocument',
  components: { ShowFile, DocumentRejectDialog, DocumentAcceptDialog },
  filters: {
    capitalize: (value) => capitalize(value),
  },
  props: {
    document: { type: Object, required: true },
    title: { type: Boolean, default: false },
  },
  data() {
    return {
      fullscreen: false,
      loading: false,
      showDocumentRejectDialog: false,
      showDocumentAcceptDialog: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getUrls()
    })
  },
  methods: {
    async getUrls() {
      this.loading = true
      const urls = []
      const document = cloneDeep(this.document)
      const { files } = document
      console.log('files', files)
      files.forEach(async file => {
        const storageRef = storage().ref(file)
        const url = await storageRef.getDownloadURL()
        urls.push(url)
      })
      this.loading = false
      return urls
    },
    capitalize(str) {
      return capitalize(str)
    },
    documentRejectDialog() {
      this.showDocumentRejectDialog = true
    },
    documentAcceptDialog() {
      this.showDocumentAcceptDialog = true
    },
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen
    },
    toggleDocumentRejectDialog() {
    this.showDocumentRejectDialog = !this.showDocumentRejectDialog
    }, // end toggleDocumentRejectDialog

    toggleDocumentAcceptDialog() {
    this.showDocumentAcceptDialog = !this.showDocumentAcceptDialog
    }, // end toggleDocumentRejectDialog
  },
  asyncComputed: {
    urls() {
      return this.getUrls().then(urls => {
        return urls
      })
    },
  }, // computed
}
</script>
