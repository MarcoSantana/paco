<template>
  <v-dialog v-model="showDialog" max-width="100%">
    <v-card>
      <v-card-title class="text-h5 white--text justify-center mb-2 primary">
        {{ $t('preview') | capitalize }}
      </v-card-title>
      <v-card-text>
        <v-lazy v-model="showDialog">
          <document-view :document="document"></document-view>
        </v-lazy>
      </v-card-text>
      <v-card-actions>
        <v-btn outlined color="error" @click="$emit('close')">
          <i class="mdi mdi-close"></i>
          {{ $t('actions.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DocumentView from '@/views/admin/DocumentView.vue'

export default {
  components: { DocumentView },
  props: {
    document: { type: Object },
    showDialog: { type: Boolean, default: true },
  },
  data() {
    return {}
  },
}
</script>
