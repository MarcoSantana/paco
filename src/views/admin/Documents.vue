<script>
import { mapState, mapActions } from 'vuex'
import { callUpdateDocumentStatus } from '@/firebase/functions'
// import { callCreateUserListSheet } from '@/firebase/functions'

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
  },
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
        { text: this.$t('document.id'), value: 'id', sortable: false },
        { text: 'Nombre', value: 'userName', sortable: true },
        { text: 'Tipo de documento', value: 'name', sortable: true },
        { text: 'Estado', value: 'status', sortable: true },
        { text: 'Creado', value: 'data.updateTimestamp', sortable: true },
        { text: 'Última modificación', value: 'data.createTimestamp' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      documentDeleteDialog: false,
      documentStatusDialog: false,
      documentUpdateMessage: '',
      currentDocument: {},
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
    // FIXME
  },
  methods: {
    ...mapActions('admin', ['getAllDocuments', 'deleteUserDocument', 'triggerSoftDeleteUserDocument']),
    dispatchAllDocuments() {
      this.$store.dispatch('admin/getAllDocuments', null, { root: true })
    },
    quickViewDocument(identifier) {
      console.log('identifier: ', identifier)
    },
    deleteDocument(item) {
      console.log('item', item)
    },
    async acceptDocument(document) {
      this.documentUpdateMessage = 'Cambiando el estado del documento'
      await callUpdateDocumentStatus(document.id, 4).then(result => {
        console.log('result :>> ', result)
        this.documentUpdateMessage = result.data.message
      })
      this.documentUpdateMessage = null
    },
    paginateDocumentsForward() {
      this.paginationStart += this.limit
      const payload = { constraints: this.constraints }
      payload.startAt = this.documents ? this.lastDocument.id : null
      payload.startAfter = null
      payload.limit = this.limit ? Number(this.limit) : 10
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
      if (s === this.currentSort) {
        this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc'
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
    <v-card v-if="documents">
      <v-data-table :headers="documentHeaders" :items="documents" :search="documentsSearch" dense>
        <template v-slot:top>
          <v-toolbar flat>
            <v-card-title
              >Buscar en documentos <v-spacer />
              <v-spacer></v-spacer>
              <v-text-field v-model="documentsSearch" class="mx-2" append-icon="mdi-magnify"></v-text-field
            ></v-card-title>
            <v-divider class="mx-4" inset vertical></v-divider>
          </v-toolbar>
          <v-dialog v-model="documentStatusDialog" max-width="500px">
            <v-card>
              <v-card-title class="text-h5 justify-center mb-2 primary lighten-2">
                <span>{{ $t('actions.changeStatus') | capitalize }}</span>
              </v-card-title>
              <v-card-text>
                <v-btn @click="acceptDocument(currentDocument)">
                  {{ $t('actions.accept') | capitalize }}
                  <i class="mdi mdi-check"></i>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="documentDeleteDialog" max-width="500px">
            <v-card>
              <v-card-title class="text-h5 justify-center mb-2 warning lighten-2">
                {{ $t('message.confirm') | capitalize }}
              </v-card-title>
              <v-card-text>
                <v-alert outlined type="warning" prominent border="left">
                  {{ $t('message.cannotUndo') | capitalize }}
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
                    <v-list-item-title> {{ $t('document.status') | capitalize }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('document.statusKey')[currentDocument.status] | capitalize }}
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
                <v-btn outlined color="primary darken-1" text @click="documentDeleteDialog = false">{{
                  $t('actions.cancel')
                }}</v-btn>
                <v-btn
                  :disabled="!documentDeleteAccept"
                  outlined
                  color="error darken-1"
                  text
                  @click="deleteDocument(currentDocument.id)"
                  >{{ $t('actions.accept') }}</v-btn
                >
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
          <span>{{ item.data.createTimestamp.toDate() | removeTime }}</span>
        </template>
        <template v-slot:item.data.updateTimestamp="{ item }">
          <span>{{ item.data.updateTimestamp.toDate() | removeTime }}</span>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="paginateDocumentForward">
            {{ $t('actions.reload') }}
          </v-btn>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn class="mr-2" x-small @click="documentStatusDialog = true">
            <span class="md"> {{ $t('actions.changeStatus') }}</span>
          </v-btn>
          <v-btn
            class="mr-2"
            x-small
            @click="
              documentDeleteDialog = true
              currentDocument = item
            "
          >
            <v-icon color="error" light>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
@import '@/theme/style.scss';
@import '@/theme/variables.scss';

.documents-table {
  tr:nth-child(odd) {
    background-color: $light-accent;
    &:hover {
      background-color: lighten($light-accent, 15%);
    }
  }
  tr:nth-child(even) {
    background-color: $light-accent-1;
    &:hover {
      background-color: lighten($light-accent, 15%);
    }
  }
} // table
</style>
