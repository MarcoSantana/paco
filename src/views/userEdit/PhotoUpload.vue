<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="6">
        <v-file-input
          v-model="imgValue"
          :disabled="uploadLoading"
          :loading="uploadLoading"
          accept="image/*"
          label="Archivo de imagen"
          dense
          show-size
        ></v-file-input>
        <cropper
          :src="url"
          :stencil-props="{
            aspectRatio: 2 / 3,
          }"
          @change="change"
        ></cropper>
        <v-btn
          v-if="imgValue"
          :disabled="uploadLoading"
          :loading="uploadLoading"
          block
          outlined
          color="success"
          small
          @click="uploadPhoto(imgValue)"
        >
          <v-icon>mdi-cloud-upload</v-icon>

          <template v-slot:loader>
            <span>Cargando archivo</span>
          </template>
        </v-btn>
      </v-col>
      <v-col v-if="imgValue" sm="12" md="6">
        <v-img ref="photo" max-height="300" max-width="200" :src="result" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { isNil } from 'lodash'
import { auth, storage, firestore } from 'firebase'
import { mapState, mapMutations } from 'vuex'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

export default {
  name: 'PhotoUpload',
  components: { Cropper },
  data() {
    return {
      imgValue: null,
      uploadLoading: false,
      loadingPercentage: null,
      result: null,
      uploadComplete: true,
    }
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['apiURL']),
    url() {
      return isNil(this.imgValue) ? null : URL.createObjectURL(this.imgValue)
    },
  },
  asyncComputed: {
    // Convert the file (URL) to `blob`
    async pictureBlob() {
      return isNil(this.result) ? null : fetch(this.result).then(r => r.blob())
    },
  },
  mounted() {},
  methods: {
    ...mapMutations('authentication', ['setUser', 'updateUser']),
    async uploadPhoto(file) {
      this.uploadLoading = true
      const fileExtension = file.type.split('/').pop()
      const storageRef = storage().ref(`users/${this.user.id}/profilePhoto.${fileExtension}`)
      this.uploadLoading = true
      this.uploadComplete = false
      // Create file metadata including the content type
      storageRef
        .put(this.pictureBlob)
        .then(snapshot => {
          this.loadingPercentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          return storageRef.getDownloadURL()
        })
        .then(downloadURL => {
          this.uploadComplete = true
          this.updateProfilePhoto(downloadURL)
        })
        .catch(err => {
          console.error('Error al cargar el archivo', err)
        })
        .finally(() => {
          this.uploadLoading = false
          this.loadingPercentage = 0
          this.file = null
          this.imgValue = null
          this.$emit('done')
        })
    },
    async updateProfilePhoto(url) {
      await firestore()
        .collection('users')
        .doc(this.user.id)
        .update({ photoURL: `${url}` })
      const myUser = auth().currentUser
      await myUser
        .updateProfile({ photoURL: url })
        .then(() => this.updateUser({ photoURL: url }))
        .catch(error => {
          console.log(error)
        })
    },
    // Used by vue-advanced-cropper
    change({ canvas }) {
      this.result = canvas.toDataURL()
    },
  },
}
</script>
