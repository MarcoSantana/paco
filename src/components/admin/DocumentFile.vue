<template>
  <div>
    <div
      v-if="
        documentFileType &&
          (documentFileType.contentType == 'image/png' || documentFileType.contentType == 'image/jpeg')
      "
      class="image-container"
    >
      <img :src="documentFile" alt="" />
    </div>

    <div v-if="documentFileType && documentFileType.contentType == 'application/pdf'" class="pdf-container">
      <!-- <pdf :src="documentFile"></pdf> -->
    </div>
  </div>
</template>

<script>
import { storage } from 'firebase'
// import pdf from 'vue-pdf'

export default {
  // components: { pdf },
  props: {
    documentName: String,
    userId: String,
    fileName: String,
  },
  mounted() {},
  asyncComputed: {
    // gs://paco-1a08b.appspot.com/documents/pg8LuCJLh4Q4X7LyvVVHnZlmiWn1/Solicitud de certificacion/pediatricResidence
    documentFile() {
      console.info('licenseFile')
      const storageRef = storage().ref(`documents/${this.$props.userId}/${this.$props.documentName}/${this.fileName}`)
      console.log('storageRef :>> ', storageRef)
      const url = storageRef.getDownloadURL().then(resUrl => {
        console.log(resUrl)
        return resUrl
      })
      return url
    },
    documentFileType() {
      console.info('documentFileType')
      const storageRef = storage().ref(`documents/${this.$props.userId}/${this.$props.documentName}/${this.fileName}`)
      const metadata = storageRef
        .getMetadata()
        .then(resMetadata => {
          console.log('resMetadata', resMetadata)
          return resMetadata
        })
        .catch(error => {
          console.error('Error al conseguir metadatos del documento', error)
          return error
        })
      return metadata
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
@import '@/theme/style.scss';
@import '@/theme/variables.scss';

.image-container {
  width: 100%;
  max-width: 800px;
  margin: 2rem;
  border: $light-accent;
  border-style: double;
  img {
    width: 100%;
  }
}
</style>
