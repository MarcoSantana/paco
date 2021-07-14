<template>
  <div>
    <div class="box" :class="document.status == 1 ? 'pending' : ''">
      <ul>
        <li>UserID: {{ document.userId }} change me to the full name (do this as denormalized data)</li>
        <li>
          Creado: {{ document.createTimestamp | intlDate }}
          <small>hace {{ document.createTimestamp | ago }} días</small>
        </li>
        <li>{{ document.name }}</li>
        <li :class="document.status == 1 ? 'pending' : ''">
          Estado: {{ document.status == 1 ? 'Por revisar' : 'Revisado' }}
        </li>
      </ul>
      <div>
        <button class="button" @click="showData = !showData">Detalles</button>
        <div class="delete-btn" @click="$emit('deleteDocument', document.id)">
          {{ isDocumentDeletionPending(document.id) ? 'delete in progress...' : 'delete' }}
        </div>
      </div>
      <div v-show="showData" class="document-detail">{{ document.data }}</div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  filters: {
    intlDate(date) {
      return DateTime.fromJSDate(new Date(date))
        .setLocale('es')
        .toLocaleString(DateTime.DATETIME_FULL)
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
    }
  },
  computed: {
    ...mapGetters('admin', ['isDocumentDeletionPending']),
    ...mapState('admin', ['documents']),
    ...mapState('app', ['networkOnLine']),
  },
  methods: {
    ...mapActions('admin', ['deleteUserDocuments']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/style.scss';
@import '@/theme/variables.scss';

ul {
  list-style-type: none;
  li {
    font-size: 1.2rem;
    font-weight: 400;
    border-radius: 5px;
    padding: 0.35rem;
  }
  li:nth-child(odd) {
    background-color: $light-accent;
  }
  li:nth-child(even) {
    background-color: $light-accent-1;
  }
}
small {
  color: grey;
}
.button {
  @extend .button;
  margin-top: 0.75rem;
  font-size: 0.8rem;

  :hover {
    background-color: $light-accent;
    color: $main;
    opacity: 0.8;
    cursor: pointer;
  }
}

.pending {
  background-color: lighten($danger-color, 30%);
}
</style>
