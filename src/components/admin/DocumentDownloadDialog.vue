<template>
  <v-dialog v-model="show" fullscreen>
    <v-card color="white">
      <v-toolbar color="primary" class="text--center" dark>
        <v-toolbar-title>
          {{ $t('actions.download') }}
          {{ $t(`document.types.${document.name}`) }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="error lighten-2" outlined @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-lazy
        v-model="show"
        :options="{
          threshold: 0.5,
        }"
        min-height="100%"
        transition="fade-transition"
      >
        <v-row>
          <v-col v-for="url in urls" :key="url" cols="6">
            <v-row>
              <v-col cols="10">
                <show-file :url="url"></show-file>
              </v-col>
              <v-col cols="2">
                <pre>{{ document }}</pre>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-lazy>
    </v-card>
  </v-dialog>
</template>

<script>
import ShowFile from '@/components/ShowFile'

export default {
  components: {
    ShowFile,
  }, // components
  props: {
    document: { type: Object, required: true },
    show: { type: Boolean, default: false },
    urls: { type: Array, required: true },
  }, // props
  computed: {}, // computed
  asyncComputed: {}, // asyncComputed
}
</script>

<style></style>
