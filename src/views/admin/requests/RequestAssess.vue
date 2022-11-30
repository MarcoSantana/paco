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
      <v-row>
        <v-col cols="2">
          <avatar :username="user.displayName" :src="user.photoURL" />
        </v-col>
        <v-col cols="10" class="text-h5 text-center pt-5">
          <v-expansion-panels inset>
            <v-expansion-panel>
              <v-expansion-panel-header class="text-h5 text-jsutify">
                <p>{{ user.displayName | capitalize }}</p>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <p class="text--muted">{{ user.email }}</p>
                <v-card class="pa-0 ma-0">
                  <v-card-title>Último mensaje</v-card-title>
                  <v-card-text class="text-justify">
                    <v-list class="ma-0 pa-0">
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>Mensaje:</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ currentEventMessage.message }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>Fecha de envío:</v-list-item-title>
                          <v-list-item-subtitle>
                            {{
                              new Date(
                                currentEventMessage.updateTimestamp
                              ).toLocaleDateString('es-MX', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>
                          <p>
                            <v-list-item-title>
                              Estado de la solicitud:
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              <p
                                :class="statusColor(currentEventMessage.status)"
                              >
                                {{
                                  $t(`requests.${currentEventMessage.status}`)
                                    | capitalize
                                }}
                              </p>
                            </v-list-item-subtitle>
                          </p>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                    <v-alert
                      v-if="localMessage"
                      v-model="localMessageShow"
                      dense
                      dismissible
                      outlined
                      text
                      :type="localMessage.color"
                      :color="localMessage.color"
                    >
                      {{ $t(`messages.${localMessage.text}`) }}
                    </v-alert>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      outlined
                      block
                      color="info"
                      @click="resendLastMessage"
                    >
                      <v-icon small class="pa-1">mdi-send</v-icon>
                      Reenviar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <hr />
          <v-alert dense outlined text :type="statusColor(requestStatus)">
            {{ $t(`requests.${requestStatus}`) | capitalize }}
          </v-alert>
        </v-col>
      </v-row>
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
                <v-list-item-content>
                  <v-list-item-title>
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
                <v-list-item-content>
                  <v-list-item-title>
                    <delete-dialog
                      :request="{ requestId: user.status.id, userId: user.id }"
                    />
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </v-card-actions>
    <v-divider />
    <v-card-text>
      <v-row v-if="documents" dense>
        <v-col v-for="document in documents" :key="document.id" :md="3" :lg="4">
          <v-alert
            v-if="document.name"
            border="top"
            colored-border
            class="text-capitalize"
            :type="`${documentStatus(document).color}`"
          >
            {{ documentStatus(document).string }}
          </v-alert>
          <show-document
            v-if="document"
            :id="document.id"
            :document="document"
            :title="true"
          />
        </v-col>
        <v-divider />
      </v-row>
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
import { cloneDeep, isNil } from 'lodash'
import { mapState, mapActions } from 'vuex'
import { callUpdateDocumentStatus } from '@/firebase/functions'
import capitalize from '@/filters/capitalize'
import intlDate from '@/filters/intlDate'
import Avatar from 'vue-avatar'
import Dialogs from '@/components/admin/requests'
import ShowDocument from '@/components/admin/ShowDocument.vue'

export default {
  name: 'RequestAssess',
  filters: { capitalize, intlDate },
  components: {
    ...Dialogs,
    Avatar,
    ShowDocument,
  },
  props: {
    userData: { type: Object, required: true },
    requestId: { type: String, required: true },
  },
  data: () => ({
    fab: false,
    documentRejectReasonDialog: false,
    documentRejectReason: '',
    loading: null,
    localMessage: null,
    localMessageShow: false,
  }), // data
  asyncComputed: {
    documents() {
      const files = Object.keys(this.userData.documents).filter(key => {
          return this.userData.documents[key].files.length > 0
      })
      return { ...cloneDeep(this.user.documents), files }
    }, // end documents
  },
  computed: {
    ...mapState('admin', ['currentEvent', 'currentUser', 'currentEventMessage']),
    user() {
      return cloneDeep(this.userData)
    },
    request() {
      return this.user.satus
    }, // request
    requestStatus() {
      return this.user.status.status ? this.user.status.status : 'incomplete'
    },
  },
  async mounted() {
    this.loading = true
    await this.getUserEventMessage({
      userId: this.currentUser.id,
      eventId: this.currentEvent.id
    })
      .then(() => this.loading = false)
  }, // end of computed
  methods: {
    ...mapActions('admin', ['getUserEventMessage', 'sendMail']),
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

    documentStatus(document) {
      if(!document.name) { return {}}
      if (!document) {
        document = {
          color: 'cyan lighten-1',
          exists: false,
          status: 5,
          string: this.$t(`document.statusKey.new`),
          isRejected: false,
          isEditable: true,
        }
      }
      return {
        color: this.$t(`document.statusColor.${document.status}`),
        exists: isNil(document),
        status: document.status,
        string: this.$t(`document.statusKey.${document.status}`),
        isRejected: () => {
          return document.status === 'rejected'
        },
        isEditable: () => {
          return document.status !== 'accepted'
        },
      }
    }, // documentStatus
    getStatus(statusKey) {
      const status = {
        accepted: { color: "#4CAF50", text: "'aceptada'" },
        pending: { color: "#CDDC39", text: "'pendiente'" },
        rejected: { color: "#FF5722", text: "'rechazada'" },
      };
      return status[statusKey];
    }, // getStatus
    async resendLastMessage() {
      const { currentEventMessage, currentUser } = this
      this.localMessageShow = false
      /** @type {import('@/typedefs').MailTemplate} */
      const template = {
        name: 'eventStatusChange',
        data: {
          message: currentEventMessage.message,
          status: this.getStatus(currentEventMessage.status).text,
          color: this.getStatus(currentEventMessage.status).color,
        }
      } // template

      /** @type {import('@/typedefs').Mail} */
      const mail = {
        to: currentUser.email,
        cc: 'marco.santana@gmail.com',
        template
      }

      /** @type {import('@/typedefs').Message} */
      this.localMessage = await this.sendMail({ ...mail })
      this.localMessageShow = true
      return this.localMessage
    }, // resendLastMessage

    statusColor(status) {
      const colors = {
        pending: 'warning',
        rejected: 'error',
        accepted: 'success',
        incomplete: 'info'
      }
      return colors[status]
    }, // statusColor
  }, // end of methods
}
</script>

<style scoped>
.v-speed-dial {
  position: absolute;
}

.v-btn--floating {
  position: relative;
}
</style>
