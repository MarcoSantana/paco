<template>
  <v-container>
    <v-dialog v-model="dialog" overlay-color="grey darken-1" id="fileView">
      <v-card v-if="documentFileType" class="image-container">
        <v-card-actions>
          <v-btn outlined color="error" @click="dialog = false">
            <i class="mdi mdi-close" />
            {{ $t('actions.close') }}
          </v-btn>
        </v-card-actions>
        <v-img
          v-if="documentFileType.contentType == 'image/png' || documentFileType.contentType == 'image/jpeg'"
          lazy-src="img/logo_cmmu.9ca8d5e0.png"
          style="height: 80%;"
          :src="documentFile"
          class="pad-media"
          :data-pad-media="documentName"
        />
        <pdf
          v-if="documentFileType.contentType == 'application/pdf'"
          class="pad-media"
          style="height: 80%;"
          :src="documentFile"
          :data-pad-media="documentName"
        ></pdf>
      </v-card>
    </v-dialog>
    <v-card v-if="documentFileType" class="text-center">
      <v-img
        v-if="documentFileType.contentType == 'image/png' || documentFileType.contentType == 'image/jpeg'"
        lazy-src="img/logo_cmmu.9ca8d5e0.png"
        :src="documentFile"
        class="pad-media"
        :data-pad-media="documentName"
        @click="dialog = true"
      ></v-img>
      <pdf
        v-if="documentFileType.contentType == 'application/pdf'"
        :src="documentFile"
        class="pad-media"
        :data-pad-media="documentName"
        @click="dialog = true"
      ></pdf>
      <v-card-actions>
        <v-btn fab color="info" :href="documentFile" download target="_blank">
          <v-icon>mdi-cloud-download</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { storage } from 'firebase'

import pdf from 'vue-pdf'

export default {
  components: { pdf },
  props: {
    documentName: String,
    userId: String,
    fileName: String,
  },
  data: () => ({
    dialog: false,
  }),
  mount() {},
  mounted() {},
  asyncComputed: {
    // gs://paco-1a08b.appspot.com/documents/pg8LuCJLh4Q4X7LyvVVHnZlmiWn1/Solicitud de certificacion/pediatricResidence
    documentFile() {
      console.info('licenseFile')
      let docName = this.$props.documentName
      docName = docName.replace(/^(\w.+)( [0-9]+)/, '$1')
      const storageRef = storage().ref(`documents/${this.$props.userId}/${docName}/${this.fileName}`)
      console.log('storageRef :>> ', storageRef)
      const url = storageRef.getDownloadURL().then((resUrl) => {
        console.log(resUrl)
        return resUrl
      })
      return url
    },
    documentFileType() {
      let docName = this.$props.documentName
      docName = docName.replace(/^(\w.+)( [0-9]+)/, '$1')
      const ref = `/documents/${this.$props.userId}/${docName}/${this.fileName}`
      const storageRef = storage().ref(ref)
      const metadata = storageRef
        .getMetadata()
        .then((resMetadata) => {
          return resMetadata
        })
        .catch((error) => {
          console.error('Error al conseguir metadatos del documento', error)
          return error
        })
      return metadata
    },
  },
  methods: {},
}
</script>
