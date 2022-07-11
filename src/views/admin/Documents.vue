<script>
import { mapState, mapActions } from 'vuex'
import {
  callUpdateDocumentStatus,
  callCreateUserListSheet,
} from '@/firebase/functions'
import DocumentPreview from './DocumentPreview.vue'

export default {
  filters: {
    capitalize: value => {
      if (!value) return ''
      return value
        .split(' ')
        .map(word => {
          return (
            word
              .toLocaleLowerCase()
              .charAt(0)
              .toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
          )
        })
        .join(' ')
    },
    removeTime: value => {
      if (!value) return ''
      return value.toLocaleString().split(' ')[0]
    },
    zeroPadDate: value => {
      return !value ? null : value.replace(/(^\d{1})\/(\d{1})/i, '0$1/0$2')
    },
  },
  components: { DocumentPreview },
  data() {
    return {
      showData: false,
      paginationStart: 1,
      limit: 800,
      constraints: null,
      // Sorting
      currentSort: 'userName',
      currentSortDirection: 'asc',
      documentsSearch: null,
      documentHeaders: [
        {
          text: this.$t('name'),
          value: 'userName',
          sortable: true,
          class: 'text-capitalize',
        },
        {
          text: this.$t('documentType'),
          value: 'name',
          sortable: true,
          class: 'text-capitalize',
        },
        {
          text: this.$t('status'),
          value: 'status',
          sortable: true,
          class: 'text-capitalize',
        },
        {
          text: this.$t('created'),
          value: 'data.updateTimestamp',
          sortable: true,
          class: 'text-capitalize',
        },
        {
          text: this.$t('lastModified'),
          value: 'data.createTimestamp',
          sortable: true,
          filterable: true,
          class: 'text-capitalize',
        },
        {
          text: this.$t('functions'),
          value: 'actions',
          sortable: false,
          class: 'text-capitalize',
        },
      ],
      documentDeleteDialog: false,
      documentStatusDialog: false,
      documentPreviewDialog: false,
      documentUpdateMessage: '',
      currentDocument: {},
      documentRejectReason: '',
      documentRejectReasonDialog: false,
      documentDeleteAccept: false,
    }
  },
  computed: {
    ...mapState('admin', ['documents']),
    ...mapState('app', ['networkOnLine']),
    firstDocument() {
      return this.documents[0]
    },
    lastDocument() {
      return this.documents[this.documents.length - 1]
    },
  },
  mounted() {
    this.paginateDocumentsForward()
  },
  methods: {
    ...mapActions('admin', [
      'getAllDocuments',
      'deleteUserDocument',
      'triggerSoftDeleteUserDocument',
    ]),
    dispatchAllDocuments() {
      this.$store.dispatch('admin/getAllDocuments', null, { root: true })
    },
    closePreviewDialog() {
      this.documentPreviewDialog = false
    },
    quickViewDocument(identifier) {
      console.log('identifier: ', identifier)
    },
    deleteDocument(item) {
      console.log('item', item)
    },
    async changeDocumentStatus(document, status, messages) {
      if (Object.values(document).length === 0 || !status) return
      this.documentUpdateMessage = {}
      this.documentUpdateMessage = {
        type: 'warning',
        messages: 'Cambiando el estado del documento',
      }
      // TODO: Update the state specifically for this document on successful transaction
      // TODO: Trigger the actions and mutations related with document update
      await callUpdateDocumentStatus(document, status, messages).then(
        result => {
          this.documentUpdateMessage = result.data
        }
      )
    },
    async createUsersList() {
      await callCreateUserListSheet()
    },
    paginateDocumentsForward() {
      this.paginationStart += this.limit
      const payload = { constraints: this.constraints }
      payload.startAt = this.documents ? this.lastDocument.id : null
      payload.startAfter = null
      payload.limit = this.limit ? Number(this.limit) : 10
      this.$store.dispatch('admin/getAllDocuments', payload, { root: true })
    },
    reloadAllDocuments() {
      const payload = { constraints: this.constraints }
      this.$store.dispatch('admin/getAllDocuments', payload, { root: true })
    },

    paginateDocumentsBackwards() {
      this.paginationStart -= this.limit
      const payload = { constraints: this.constraints }
      payload.endAt = this.documents ? this.firstDocument.id : null
      payload.startAt = null
      payload.limit = this.limit ? Number(this.limit) : 10
      this.$store.dispatch('admin/getAllDocuments', payload, { root: true })
    },
    sort(s) {
      // WIP
      // TODO: Remove as it is unused thanks to vuetify datatable
      if (s === this.currentSort) {
        this.currentSortDirection =
          this.currentSortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.$refs[this.currentSort].classList.remove('selected')
      }
      const payload = { constraints: this.constraints }
      payload.limit = this.limit ? +this.limit : 10
      payload.orderBy = [[s, this.currentSortDirection]]
      this.$store.dispatch('admin/getAllDocuments', payload, { root: true })
      this.$refs[s].classList.add('selected')
      this.currentSort = s
    },
  }, // methods
}
</script>
<template>
  <div style="width: 100%">
    <div>
      <h2>Documentos</h2>
    </div>
    <v-card>
      <v-card-text class="pa-2">
        <!--<v-btn class="ma-2" small outlined color="success" @click="createUsersList">
Crear lista de usuarios para emma
        </v-btn>-->
      </v-card-text>
    </v-card>
    <v-card v-if="documents">
      <v-data-table
        :headers="documentHeaders"
        :items="documents"
        :search="documentsSearch"
        :items-per-page="50"
        dense
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-card-title>
              Buscar en documentos
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="documentsSearch"
                class="mx-2"
                append-icon="mdi-magnify"
              ></v-text-field>
            </v-card-title>
            <v-divider class="mx-4" inset vertical></v-divider>
          </v-toolbar>
          <v-dialog v-model="documentStatusDialog" max-width="500px">
            <v-card>
              <v-card-title
                class="text-h5 justify-center mb-2 primary lighten-2"
              >
                <span class="white--text">
                  {{ $t('actions.changeStatus') | capitalize }}
                </span>
              </v-card-title>
              <v-alert
                v-if="documentUpdateMessage !== ''"
                class="ma-5"
                outlined
                :type="documentUpdateMessage.type"
              >
                {{ documentUpdateMessage.message }}
              </v-alert>
              <v-card-text>
                <div>Documento: {{ currentDocument.name }}</div>
                <div>
                  Creado:
                  {{
                    currentDocument.createTimestamp | removeTime | zeroPadDate
                  }}
                </div>
              </v-card-text>
              <v-card-text class="text-center">
                <v-btn
                  text
                  ripple
                  color="error"
                  @click="
                    documentUpdateMessage = ''
                    documentStatusDialog = false
                  "
                >
                  <i class="mdi mdi-cancel"></i>
                  {{ $t('actions.close') | capitalize }}
                </v-btn>
                <v-btn
                  v-if="Object.keys(documentUpdateMessage).length === 0"
                  text
                  ripple
                  color="primary"
                  :disabled="currentDocument.status == 4"
                  @click="
                    changeDocumentStatus(
                      currentDocument.id,
                      4,
                      'Documento aprobado'
                    )
                  "
                >
                  <i class="mdi mdi-check"></i>
                  {{ $t('actions.accept') | capitalize }}
                </v-btn>
                <v-btn
                  v-if="Object.keys(documentUpdateMessage).length === 0"
                  text
                  ripple
                  color="warning"
                  @click="documentRejectReasonDialog = true"
                >
                  <i class="mdi mdi-check"></i>
                  {{ $t('actions.reject') | capitalize }}
                </v-btn>
              </v-card-text>
            </v-card>
            <v-dialog v-model="documentRejectReasonDialog" max-width="400px">
              <v-card>
                <v-card-title
                  class="text-h5 white--text justify-center mb-2 warning"
                >
                  Razón de rechazo
                </v-card-title>
                <v-card-text>
                  <v-textarea
                    v-model="documentRejectReason"
                    counter="320"
                    outlined
                    background-color="amber lighten-4"
                    color="orange orange-darken-4"
                    label="Describa la razón del rechazo"
                    hint="Describa en 320 caracteres o menos la razón de rechazo"
                    required
                    hide-details="auto"
                  ></v-textarea>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    outlined
                    color="error"
                    text
                    @click="
                      documentRejectReasonDialog = false
                      documentRejectReason = ''
                    "
                  >
                    <i class="mdi mdi-cancel"></i>
                    {{ $t('actions.cancel') }}
                  </v-btn>
                  <v-btn
                    v-show="documentRejectReason"
                    outlined
                    color="primary"
                    text
                    @click="
                      changeDocumentStatus(
                        currentDocument.id,
                        3,
                        documentRejectReason
                      )
                    "
                  >
                    <i class="mdi mdi-send"></i>
                    {{ $t('actions.send') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-dialog>
          <v-dialog v-model="documentDeleteDialog" max-width="500px">
            <v-card>
              <v-card-title
                class="text-h5 justify-center mb-2 warning lighten-2"
              >
                {{ $t('messages.confirm') | capitalize }}
              </v-card-title>
              <v-card-text>
                <v-alert outlined type="warning" prominent border="left">
                  {{ $t('messages.cannotUndo') | capitalize }}
                </v-alert>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t('file') | capitalize }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ currentDocument.name }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t('user') | capitalize }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ currentDocument.userName }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t('document.status') | capitalize }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{
                        $t('document.statusKey')[currentDocument.status]
                          | capitalize
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card-text>
              <v-card-actions>
                <v-switch
                  v-model="documentDeleteAccept"
                  class="ma-2"
                  :label="$t('actions.delete') | capitalize"
                  color="error"
                  :value="false"
                  hide-details
                ></v-switch>
                <v-spacer></v-spacer>
                <v-btn
                  outlined
                  color="primary darken-1"
                  text
                  @click="documentDeleteDialog = false"
                >
                  {{ $t('actions.cancel') }}
                </v-btn>
                <v-btn
                  :disabled="!documentDeleteAccept"
                  outlined
                  color="error darken-1"
                  text
                  @click="deleteDocument(currentDocument.id)"
                >
                  {{ $t('actions.accept') }}
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.status="{ item }">
          {{ $t('document.statusKey')[item.status] | capitalize }}
        </template>
        <template v-slot:item.userName="{ item }">
          <span>{{ item.userName | capitalize }}</span>
        </template>
        <template v-slot:item.data.createTimestamp="{ item }">
          <span>
            {{ item.data.createTimestamp.toDate() | removeTime | zeroPadDate }}
          </span>
        </template>
        <template v-slot:item.data.updateTimestamp="{ item }">
          <span>
            {{ item.data.updateTimestamp.toDate() | removeTime | zeroPadDate }}
          </span>
        </template>
        <template v-slot:no-data>
          <v-btn outlined color="primary" @click="reloadAllDocuments">
            {{ $t('actions.reload') }}
          </v-btn>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn-toggle dense tile group>
            <v-hover v-slot="{ hover }">
              <v-btn
                :color="hover ? 'deep-orange darken-1 lighten-3' : ''"
                x-small
                plain
                @click="
                  currentDocument = item
                  documentPreviewDialog = true
                "
              >
                <v-icon light>mdi-eye</v-icon>
              </v-btn>
            </v-hover>
            <v-hover v-slot="{ hover }">
              <v-btn
                :color="hover ? 'info' : ''"
                x-small
                plain
                @click="
                  documentStatusDialog = true
                  currentDocument = item
                "
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </v-hover>
            <v-hover v-slot="{ hover }">
              <v-btn
                :color="hover ? 'error' : ''"
                x-small
                plain
                @click="
                  documentDeleteDialog = true
                  currentDocument = item
                "
              >
                <v-icon light>mdi-delete</v-icon>
              </v-btn>
            </v-hover>
          </v-btn-toggle>
        </template>
      </v-data-table>
      <document-preview
        :document="currentDocument"
        :show-dialog="documentPreviewDialog"
        @close="closePreviewDialog"
      />
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
@import '@/theme/style.scss';
@import '@/theme/variables.scss';
</style>
