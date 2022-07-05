<template>
  <v-sheet v-if="!loading && urls && urls.length > 0" class="container">
    <v-card max-width="90%" min-width="500px" v-for="url in urls" :key="url">
      <show-file class="container" :url="url" />
    </v-card>
  </v-sheet>
</template>

<script>
import { cloneDeep } from 'lodash'
import { storage } from 'firebase'
import ShowFile from '@/components/ShowFile'

export default {
  components: { ShowFile },
  props: {
    document: { type: Object, required: true },
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
      files.forEach(async (file) => {
        const storageRef = storage().ref(file)
        const url = await storageRef.getDownloadURL()
        urls.push(url)
      })
      this.loading = false
      return urls
    },
  },
  asyncComputed: {
    urls() {
      return this.getUrls().then((urls) => {
        return urls
      })
    },
  }, // computed
}
</script>
