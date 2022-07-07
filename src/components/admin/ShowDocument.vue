<template>
  <v-sheet v-if="!loading && urls && urls.length > 0" class="container">
    <v-card v-for="url in urls" :key="url" min-width="500px" max-width="90%">
      <v-card-title v-if="title">
        <span class="headline">{{ capitalize($t(`document.types.${document.name}`)) }}</span>
        <v-spacer />
        <v-card-actions>
          <v-tooltip top color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-btn text icon v-bind="attrs" v-on="on">
                <v-icon x-large>mdi-dots-horizontal</v-icon>
              </v-btn>
              <v-spacer />
            </template>
            <span>Acciones del documento</span>
          </v-tooltip>
        </v-card-actions>
      </v-card-title>
      <show-file class="container" :url="url" />
    </v-card>
  </v-sheet>
</template>

<script lang="js">
import { cloneDeep, capitalize } from 'lodash'
import { storage } from 'firebase'
import ShowFile from '@/components/ShowFile'

export default {
  components: { ShowFile },
  props: {
    document: { type: Object, required: true },
    title: { type: Boolean, default: false },
  },
  data() {
    return {
      loading: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getUrls()
    })
  },
  methods: {
    async getUrls() {
      this.loading = true
      const urls = []
      const document = cloneDeep(this.document)
      const { files } = document
      console.log('files', files)
      files.forEach(async file => {
        const storageRef = storage().ref(file)
        const url = await storageRef.getDownloadURL()
        urls.push(url)
      })
      this.loading = false
      return urls
    },
    capitalize(str) {
      return capitalize(str)
    },
  },
  asyncComputed: {
    urls() {
      return this.getUrls().then(urls => {
        return urls
      })
    },
  }, // computed
}
</script>
