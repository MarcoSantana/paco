<template>
  <v-sheet v-if="!loading"
    class="container">
    <span class="headline text-center">
      {{ capitalize($t(`document.types.${document.name}`)) }}
    </span>
    <v-card v-if="info.length > 0">
      <v-card-title>
        <div v-for="item in info" :key="item[0]">
          <div v-for="(val, key) in item" :key="key">
            {{key}}: {{val}}
          </div>
        </div>
      </v-card-title>
      <v-menu offset-y>
        <template v-slot:activator="{ on: onMenu }">
          <v-tooltip top
            color="primary">
            <template v-slot:activator="{ on: onTooltip, attrs: attrsTooltip }">
              <v-btn text
                icon
                v-bind="attrsTooltip"
                v-on="{ ...onMenu, ...onTooltip }">
                <v-icon x-large>mdi-dots-horizontal</v-icon>
              </v-btn>
              <v-spacer />
            </template>
            <span>{{ $t('document.actions.of') | capitalize }}</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item>
            <document-download :document="document"
              :user="currentUser"
              :urls="urls">
              <template slot="activator">
                <v-icon class="mr-2">mdi-cloud-download</v-icon>
                <span class="ml-3 text-capitalize">
                  {{ $t('actions.download') }}
                </span>
              </template>
            </document-download>
          </v-list-item>

          <v-list-item link
            @click="documentAcceptDialog">
            <v-list-item-icon>
              <v-icon>mdi-check</v-icon>
            </v-list-item-icon>
            {{ $t('document.actions.accept') | capitalize }}
          </v-list-item>
          <v-list-item ref="actionReject"
            link
            @click="documentRejectDialog">
            <v-list-item-icon>
              <v-icon>mdi-cancel</v-icon>
            </v-list-item-icon>
            {{ $t('document.actions.reject') | capitalize }}
          </v-list-item>
          <v-list-item link
            @click="documentDeleteDialog">
            <v-list-item-icon>
              <v-icon>mdi-delete</v-icon>
            </v-list-item-icon>
            {{ $t('document.actions.delete') | capitalize }}
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card>
    <v-card v-for="url in urls"
      :key="url"
      min-width="500px"
      max-width="90%">
      <v-card-title v-if="title">
        <v-tooltip top
          color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text
              icon
              v-bind="attrs"
              v-on="on"
              @click="toggleFullscreen">
              <v-icon v-if="!fullscreen">mdi-fullscreen</v-icon>
              <v-icon v-else>mdi-fullscreen-exit</v-icon>
            </v-btn>
            <v-spacer />
          </template>
          <span>Pantalla completa</span>
        </v-tooltip>
        <v-spacer />
        <v-spacer />
        <v-menu offset-y>
          <template v-slot:activator="{ on: onMenu }">
            <v-tooltip top
              color="primary">
              <template v-slot:activator="{ on: onTooltip, attrs: attrsTooltip }">
                <v-btn text
                  icon
                  v-bind="attrsTooltip"
                  v-on="{ ...onMenu, ...onTooltip }">
                  <v-icon x-large>mdi-dots-horizontal</v-icon>
                </v-btn>
                <v-spacer />
              </template>
              <span>{{ $t('document.actions.of') | capitalize }}</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item>
              <document-download :document="document"
                :user="currentUser"
                :urls="urls">
                <template slot="activator">
                  <v-icon class="mr-2">mdi-cloud-download</v-icon>
                  <span class="ml-3 text-capitalize">
                    {{ $t('actions.download') }}
                  </span>
                </template>
              </document-download>
            </v-list-item>

            <v-list-item link
              @click="documentAcceptDialog">
              <v-list-item-icon>
                <v-icon>mdi-check</v-icon>
              </v-list-item-icon>
              {{ $t('document.actions.accept') | capitalize }}
            </v-list-item>
            <v-list-item ref="actionReject"
              link
              @click="documentRejectDialog">
              <v-list-item-icon>
                <v-icon>mdi-cancel</v-icon>
              </v-list-item-icon>
              {{ $t('document.actions.reject') | capitalize }}
            </v-list-item>
            <v-list-item link
              @click="documentDeleteDialog">
              <v-list-item-icon>
                <v-icon>mdi-delete</v-icon>
              </v-list-item-icon>
              {{ $t('document.actions.delete') | capitalize }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>
      <show-file class="container"
        :url="url" />
      <v-divider />
      <!-- fullscreen -->
      <v-dialog v-model="fullscreen"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        @keydown.esc="fullscreen = false">
        <v-lazy v-model="fullscreen"
          :options="{
            threshold: 0.5,
          }"
          min-height="100%"
          transition="fade-transition">
          <v-sheet>
            <v-tooltip top
              color="primary">
              <template v-slot:activator="{ on, attrs }">
                <v-btn text
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="toggleFullscreen">
                  <v-icon v-if="!fullscreen"
                    x-large>mdi-fullscreen
                  </v-icon>
                  <v-icon v-else
                    class="ma-3"
                    x-large>mdi-close
                  </v-icon>
                </v-btn>
                <v-spacer />
              </template>
              <span v-if="!fullscreen">Pantalla completa</span>
              <span v-else>Salir de pantalla completa</span>
            </v-tooltip>
            <show-file :url="url"
              class="container"
              @toggleFullscreen="toggleFullscreen" />
          </v-sheet>
        </v-lazy>
      </v-dialog>
      <!-- /fullscreen -->
    </v-card>
    <document-reject-dialog :document="document"
      :show="showDocumentRejectDialog"
      @close="toggleDocumentRejectDialog" />
    <document-accept-dialog :document="document"
      :show="showDocumentAcceptDialog"
      @close="toggleDocumentAcceptDialog" />
    <document-delete-dialog :document="document"
      :show="showDocumentDeleteDialog"
      @close="toggleDocumentDeleteDialog"
      @deleted="deleted" />
    <document-download :document="document"
      :show="showDocumentDownloadDialog"
      :urls="urls"
      :user="currentUser"
      @close="toggleDocumentDownloadDialog"
      @download="downloaded">
    </document-download>
  </v-sheet>
</template>

<script lang="js">
import { cloneDeep, capitalize } from 'lodash'
import { storage } from 'firebase'
import { mapState, mapMutations } from 'vuex'
import ShowFile from '@/components/ShowFile'
// TODO refactor to load dynamically
import DocumentRejectDialog from '@/components/admin/DocumentRejectDialog'
import DocumentAcceptDialog from '@/components/admin/DocumentAcceptDialog'
import DocumentDeleteDialog from '@/components/admin/DocumentDeleteDialog'
import DocumentDownload from '@/components/admin/DocumentDownload'

export default {
  name: 'ShowDocument',
  components: {
    DocumentAcceptDialog,
    DocumentDeleteDialog,
    DocumentDownload,
    DocumentRejectDialog,
    ShowFile,
  },
  filters: {
    capitalize: (value) => capitalize(value),
  },
  props: {
    // TODO Add a proper type def 202211.29-12.35
    document: { type: Object, required: true },
    title: { type: Boolean, default: false },
  },
  data() {
    return {
      downloadable: true,
      fullscreen: false,
      hide: false,
      loading: false,
      showDocumentRejectDialog: false,
      showDocumentAcceptDialog: false,
      showDocumentDeleteDialog: false,
      showDocumentDownloadDialog: false,
    }
  },
  computed: {
    ...mapState('admin', ['currentUser']),
    info() {
      const {info} = this.document
      return Object.keys(info)
        .map((item) => ({[`${this.$t(`document.types.${item}`)}`]: info[item]}))
    }
  },
  mounted() {
    console.log('ShowDocument props', this.$props)
    this.$nextTick(() => {
      this.getUrls()
    })
  },
  methods: {
    ...mapMutations('documents', ['setDocumentDeleteMessage']),
    deleted() {
      this.setDocumentDeleteMessage(null)
      setTimeout(() => this.hide = true, 2000);
    }, // end deleted
    downloaded() {
      this.setDocumentDownloadMessage(null)
    }, // downloaded
    showMessage(message) {
      console.log('showMessage', message);
    }, // showMessage
    async getUrls() {
      this.loading = true
      const urls = []
      const document = cloneDeep(this.document)
      const { files } = document || []
      console.log('files', files)
      if (files) {
        files.forEach(async file => {
          const storageRef = storage().ref(file)
          const url = await storageRef.getDownloadURL()
          urls.push(url)
        })
      }
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
    documentDeleteDialog() {
      this.showDocumentDeleteDialog = true
    },
    documentDownloadDialog() {
      this.showDocumentDownloadDialog = true
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

    toggleDocumentDeleteDialog() {
      this.showDocumentDeleteDialog = !this.showDocumentDeleteDialog
    }, // end toggleDocumentDeleteDialog

    toggleDocumentDownloadDialog() {
      this.showDocumentDownloadDialog = !this.showDocumentDownloadDialog
    }, // end toggleDocumentDeleteDialog
  }, // methods
  asyncComputed: {
    urls() {
      return this.getUrls().then(urls => {
        return urls
      })
    },
  }, // computed
}
</script>
