<template>
  <div class="document-item">
    <router-link class="document-link" :to="{ name: 'document', params: { id: data.id } }">
      <div class="documentName">{{ data.name }}</div>
      <div>
        {{ data.createTimestamp | intlDate }}
        <small>hace {{ data.createTimestamp | ago }} días</small>
      </div>
      <div>{{ data.status | docStatus }}</div>
    </router-link>
  </div>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  filters: {
    docStatus(value) {
      if (!value) return ''
      switch (value) {
        case 1:
          value = 'Por revisar'
          break
        case 2:
          value = 'En revisión'
          break
        default:
          break
      }
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
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
  props: {
    data: Object,
    index: Number,
    isDocumentDeletionPending: Boolean,
    disableActions: Boolean,
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.document-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .document-link {
    border-style: dotted;
    border-width: 1px;
    border-color: $light-accent;
    small {
      color: gray;
    }
  }

  .delete-btn {
    cursor: pointer;
    padding: 5px 10px;
    border: 1px solid;
    display: inline-block;
    border-radius: 3px;
    margin-left: 10px;
    color: $danger-color;
    border-color: $danger-color;
  }
}
</style>
