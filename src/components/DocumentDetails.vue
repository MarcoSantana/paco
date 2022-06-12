<template>
  <v-container>
    <v-card class="pa-3">
      <v-card-title>
        <h1 class="text-capitalize text-h4">{{$t(`document.types.${document.name}`)}}</h1>
      </v-card-title>
      <show-file v-for="file in docURLs" :key="file" :url="file" @removeFile="file = null" />
    </v-card>
  </v-container>
</template>

<script>
import { isNil } from 'lodash'
import { storage } from 'firebase'
import ShowFile from '@/components/ShowFile'

export default {
  name: 'DocumentDetail',
  components: { ShowFile },
  props: {
    document: Object,
  },
  data() {
    return {
      docURLs: [],
    }
  },
  mounted() {
    console.log('Document detail', this.document)
    this.$nextTick(() => {
      this.populateRemoteFiles(this.documentFiles)
    })
  },
  methods: {
    populateRemoteFiles(files) {
      if (isNil(files)) return null
      return files.map(async (file) => {
        this.docURLs.push(await this.getDownloadURL(file))
      })
    },

    async getDownloadURL(docRef) {
      const storageRef = storage().ref(docRef)
      const url = await storageRef.getDownloadURL()
      return url
    },
  },
  computed: {
    documentFiles() {
      return Object.values(this.document.files)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.document-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
