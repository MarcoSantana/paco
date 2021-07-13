<template>
  <div>
    <div class="box">
      <ul>
        <li>UserID: {{ document.id }} change me to the full name (do this as denormalized data)</li>
        <li>createTimestam: {{ document.createTimestamp | intlDate }} (filter me with luxon)</li>
        <!-- <li>createTimestam: {{ document.createTimestamp }} (filter me with luxon)</li> -->
        <li>Document name: {{ document.name }}</li>
        <li>Status: {{ document.status == 1 ? 'Por revisar' : 'Revisado' }} (add me a color icon)</li>
      </ul>
      <div style="color: red;">
        <button class="button" @click="showData = !showData">Detalles</button>
      </div>
      <div v-show="showData" class="document-detail">{{ document.data }}</div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  filters: {
    intlDate(date) {
      return DateTime.fromJSDate(new Date(date))
        .setLocale('es')
        .toLocaleString(DateTime.DATETIME_FULL)
    },
  },
  props: { document: Object },
  data() {
    return {
      showData: false,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/style.scss';
@import '@/theme/variables.scss';

.document-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
ul {
  list-style-type: none;
  li:nth-child(odd) {
    background-color: $light-accent;
  }
  li:nth-child(even) {
    background-color: $light-accent-1;
  }
}

.button {
  @extend .button;
  font-size: 0.8rem;
}
</style>
