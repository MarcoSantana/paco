<template>
  <div>
    <div v-if="message" class="row">{{ message }}</div>
    <div v-if="!message" class="row">
      <span class="actions">
        <div>
          <router-link
            :id="document.id"
            class="btn"
            :to="{ name: 'document-view', params: { id: document.id, document: document } }"
          >
            Abrir documento
          </router-link>
        </div>
        <!-- <div class="btn" @click="showData = !showData">
          <i v-if="!showData" class="mdi mdi-chevron-down"></i>
          <i v-if="showData" class="mdi mdi-chevron-up"></i>
        </div> -->
      </span>
      <!-- actions -->
      <span class="userName">
        {{ document.userName }}
      </span>
      <span class="documentName"> {{ document.name }}</span>
      <span class="info">
        {{ document.createTimestamp | intlDate }}
        <small>hace {{ document.createTimestamp | ago }} días</small>
      </span>
      <span class="status" :class="status == 1 ? 'pending' : ''">{{ status | docStatus }} </span>
      <!-- <span class="delete">
        <div class="delete-btn" @click="$emit('deleteDocument', document.id)">
          <i v-if="!isDocumentDeletionPending(document.id)" class="mdi mdi-trash-can-outline"></i>
          {{ isDocumentDeletionPending(document.id) ? 'borrado en proceso' : '' }}
        </div>
      </span> -->
      <span class="accept">
        <div :id="`accept-${document.id}`" class="accept-btn" @click="acceptDocument">
          <i class="mdi mdi-check"></i>
        </div>
      </span>
      <span class="review">
        <div class="review-btn" @click="reviewDocument">
          <i class="mdi mdi-file-find"></i>
        </div>
      </span>
      <span class="reject">
        <div class="reject-btn" @click="showRejectionModal">
          <i class="mdi mdi-file-cancel"></i>
        </div>
      </span>
    </div>
    <!-- <div v-show="showData" class="document-detail">
      <component :is="components[document.name]" :document="document"></component>
    </div> -->
    <modal :name="`rejectModal${document.id}`" :width="'80%'" :height="'auto'" :resizable="true" :scrollable="true">
      <input ref="rejectionReason" v-model="rejectionReason" placeholder="Detalle el motivo de rechazo" type="text" />
      <button v-if="rejectionReason != null" class="btn delete-btn" @click="rejectDocument">
        Rechazar documento
      </button>
    </modal>
  </div>
  <!-- row -->
</template>

<script>
import { DateTime } from 'luxon'
import { mapState, mapActions, mapGetters } from 'vuex'
// import CertificationRequest from '@/components/admin/CertificationRequest'
import * as components from '@/components/admin/componentsList.json'
import { callUpdateDocumentStatus } from '@/firebase/functions'

console.log('components :>> ', components.default['Solicitud de certificación'])

export default {
  filters: {
    intlDate(date) {
      return (
        DateTime.fromJSDate(new Date(date))
          .setLocale('es')
          // .toLocaleString(DateTime.DATETIME_FULL)
          .toLocaleString()
      )
    },
    ago(date) {
      const newValueParsed = DateTime.fromJSDate(new Date(date))
      const now = DateTime.now()
      return Math.round(now.diff(newValueParsed, ['days']).days)
    },
    docStatus(value) {
      if (!value) return ''
      switch (value) {
        case 1:
          value = 'Por revisar'
          break
        case 2:
          value = 'En revisión'
          break
        case 3:
          value = 'Rechazado'
          break
        case 4:
          value = 'Aceptado'
          break
        default:
          break
      }
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
  },
  // components: { CertificationRequest },
  props: { document: Object },
  data() {
    return {
      showData: false,
      components: components.default,
      status: this.document.status,
      message: null,
      rejectionReason: null,
    }
  },
  computed: {
    ...mapGetters('admin', ['isDocumentDeletionPending']),
    ...mapState('admin', ['documents']),
    ...mapState('app', ['networkOnLine']),
  },
  mounted() {},
  methods: {
    ...mapActions('admin', ['deleteUserDocuments']),
    async acceptDocument() {
      this.message = 'Cambiando el estado del documento'
      await callUpdateDocumentStatus(this.document.id, 4).then(result => {
        console.log('result :>> ', result)
        this.message = result.data.message
      })
      this.status = 4
      this.message = null
    },

    showRejectionModal() {
      console.log('rejectionMOdalrejectionMOdal')
      console.log(`rejectModal${this.document.id}`)
      this.$modal.show(`rejectModal${this.document.id}`)
    },
    async rejectDocument() {
      this.message = 'Cambiando el estado del documento'
      await callUpdateDocumentStatus(this.document.id, 3, this.rejectionReason)
        .then(result => {
          this.message = result.data.message
        })
        .then(() => {
          this.status = 3
          this.message = null
          this.$modal.hide(`rejectModal${this.document.id}`)
        })
    },

    async reviewDocument() {
      this.message = 'Cambiando el estado del documento'
      await callUpdateDocumentStatus(this.document.id, 2).then(result => {
        this.message = result.data.message
      })
      this.status = 2
      this.message = null
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/style.scss';
@import '@/theme/variables.scss';

.row {
  display: flex;
  span {
    // width: 100%;
    margin: 0 0.5rem 0.5rem 0;
    padding-top: 0.25rem;
  }
  .actions {
    flex: 1;
  }
  .userName {
    flex: 2;
  }
  .documentName {
    flex: 2;
  }
}
small {
  color: grey;
}
.btn {
  @extend .button;
  background-color: $main;
  color: $light-accent;
  font-size: 1rem;
  padding: 0.35rem;
  border-radius: 5px;
  // background-color: transparent;
  border: none;
  :hover {
    background-color: $main;
    color: whitesmoke;
    opacity: 0.7;
    cursor: pointer;
    // border-radius: 2px;
    // border-style: dotted;
  }
}
.delete-btn {
  @extend .btn;
  $color: $danger-color;
  :hover {
    background-color: $color;
    border-color: lighten($color, 30%);
  }
}
.accept-btn {
  @extend .btn;
  $color: $vue-color;
  color: $color;
  :hover {
    background-color: $color;
    border-color: lighten($color, 30%);
  }
}

.review-btn {
  @extend .btn;
  $color: $warning-color;
  color: $color;
  :hover {
    background-color: $color;
    border-color: lighten($color, 30%);
  }
}

.reject-btn {
  @extend .btn;
  $color: $danger-color;
  color: $color;
  :hover {
    background-color: $color;
    border-color: lighten($color, 30%);
  }
}
.pending {
  $color: $danger-color;
  color: $color;
  :hover {
    color: lighten($danger-color, 10%);
    border-color: lighten($color, 30%);
  }
}
</style>
