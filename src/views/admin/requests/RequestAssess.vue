<template>
  <v-card v-if="user">
    <v-card-actions class="pa-3">
      <v-btn
        class="mt-1"
        color="primary"
        text
        :to="`/admin/requests/${userData.status.id}`"
      >
        <v-icon>mdi-arrow-left</v-icon>
        {{ $t('actions.back') }}
      </v-btn>
      <v-spacer />
      <template>
        <div class="text-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on: onMenu, attrs: attrsMenu }">
              <v-tooltip top color="primary">
                <template v-slot:activator="{ on: onTooltip }">
                  <v-btn
                    text
                    icon
                    v-bind="attrsMenu"
                    v-on="{ ...onMenu, ...onTooltip }"
                  >
                    <v-icon x-large>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <span>Acciones de la solicitud</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-check</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    Aprobar
                    <accept-dialog
                      :request="{ requestId: user.status.id, userId: user.id }"
                    />
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <reject-dialog
                      :request="{ requestId: user.status.id, userId: user.id }"
                    />
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Borrar</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </v-card-actions>
    <v-card-title>
      <v-row>
        <v-col cols="2">
          <v-img v-if="user.photoURL" :src="user.photoURL" />
          <!-- todo add random generated bg color to avatar  -->
          <v-img
            v-else
            max-width="100px"
            width="100px"
            :src="
              `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user.displayName}`
            "
          ></v-img>
        </v-col>
      </v-row>
      <span class="text-h3">{{ user.displayName | capitalize }}</span>
      <v-spacer />
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-list v-if="documents" dense>
        <v-list-item v-for="document in documents" :key="document.id">
          <v-list-item-content>
            <show-document
              v-if="document && document.files && document.files.length"
              :id="document.id"
              :document="document"
              :title="true"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" text :to="`/admin/requests/${userData.status.id}`">
        <v-icon>mdi-arrow-left</v-icon>
        {{ $t('actions.back') }}
      </v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script lang="js">
import { cloneDeep } from 'lodash'
import { callUpdateDocumentStatus } from '@/firebase/functions'
import capitalize from '@/filters/capitalize'
import ShowDocument from '@/components/admin/ShowDocument.vue'
import RejectDialog from '@/components/admin/requests/RejectDialog.vue'
import AcceptDialog from '@/components/admin/requests/AcceptDialog.vue'

export default {
  name: 'RequestAssess',
  filters: { capitalize },
  components: {
    AcceptDialog,
    RejectDialog,
    ShowDocument,
  },
  props: {
    userData: { type: Object, required: true },
  },
  data: () => ({ fab: false, documentRejectReasonDialog: false, documentRejectReason: '' }),
  asyncComputed: {
    documents() {
      const files = Object.keys(this.userData.documents).map(key => {
        return this.userData.documents[key].files
      })
      return { ...cloneDeep(this.user.documents), files }
    }, // end documents
  },
  computed: {
    user() {
      return cloneDeep(this.userData)
    },
  },
  mounted() {}, // end of computed
  methods: {
    clicked(e) {
      console.log('Click', e.target)
      this.documentRejectReasonDialog = true
      console.log(this.documentRejectReasonDialog)
    },

    async changeDocumentStatus(document, status, messages) {
      if (Object.values(document).length === 0 || !status) return
      this.documentUpdateMessage = {}
      this.documentUpdateMessage = { type: 'warning', messages: 'Cambiando el estado del documento' }
      // TODO: Update the state specifically for this document on successful transaction
      // TODO: Trigger the actions and mutations related with document update
      await callUpdateDocumentStatus(document, status, messages).then(result => {
        this.documentUpdateMessage = result.data
      })
    }, // changeDocumentStatus
  }, // end of methods
}
</script>

<style>
.v-speed-dial {
  position: absolute;
}
.v-btn--floating {
  position: relative;
}
</style>
