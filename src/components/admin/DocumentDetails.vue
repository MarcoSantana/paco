<template>
  <div>
    <div class="row">
      <span cla.ss="actions">
        <div class="btn" @click="showData = !showData">
          <i v-if="!showData" class="mdi mdi-chevron-down"></i>
          <i v-if="showData" class="mdi mdi-chevron-up"></i>
        </div>
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
      <span class="status" :class="status == 1 ? 'pending' : ''">{{ status == 1 ? 'Por revisar' : 'Revisado' }} </span>
      <span class="delete">
        <div class="delete-btn" @click="$emit('deleteDocument', document.id)">
          <i v-if="!isDocumentDeletionPending(document.id)" class="mdi mdi-trash-can-outline"></i>
          {{ isDocumentDeletionPending(document.id) ? 'borrado en proceso' : '' }}
        </div>
      </span>
      <span class="accept">
        <div class="accept-btn" @click="acceptDocument">
          <!-- <i v-if="!isDocumentDeletionPending(document.id)" class="mdi mdi-trash-can-outline"></i>
          {{ isDocumentDeletionPending(document.id) ? 'borrado en proceso' : '' }} -->
          <i class="mdi mdi-check"></i>
        </div>
      </span>
    </div>
    <div v-show="showData" class="document-detail">
      <component :is="components[document.name]" :document="document"></component>
    </div>
  </div>
  <!-- row -->
</template>

<script>
import { DateTime } from 'luxon'
import { mapState, mapActions, mapGetters } from 'vuex'
import CertificationRequest from '@/components/admin/CertificationRequest'
import * as components from '@/components/admin/componentsList.json'
import { callUpdateDocumentStatus } from '@/firebase/functions'

console.log('components :>> ', components.default['Solicitud de certificación'])

export default {
  components: { CertificationRequest },
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
  },
  props: { document: Object },
  data() {
    return {
      showData: false,
      components: components.default,
      status: this.document.status,
    }
  },
  computed: {
    ...mapGetters('admin', ['isDocumentDeletionPending']),
    ...mapState('admin', ['documents']),
    ...mapState('app', ['networkOnLine']),
  },
  methods: {
    ...mapActions('admin', ['deleteUserDocuments']),
    async acceptDocument() {
      callUpdateDocumentStatus(this.document.id, 2)
      this.status = 2
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
  @extend .delete-btn;
  background-color: transparent;
  color: $main;
  border: none;
  :hover {
    background-color: $main;
    color: $light-accent;
    opacity: 0.7;
    cursor: pointer;
  }
}
.delete-btn {
  border: none;
}
.accept-btn {
  color: $vue-color;
  :hover {
    background-color: $vue-color;
    color: whitesmoke;
    border-color: lighten($vue-color, 30%);
    border-radius: 5px;
  }
}
.pending {
  color: lighten($danger-color, 10%);
}
</style>
