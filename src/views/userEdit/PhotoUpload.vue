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
        <v-img max-height="300" max-width="200" :src="url" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { isNil } from 'lodash'
import { auth, storage, firestore } from 'firebase'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'PhotoUpload',
  data() {
    return {
      imgValue: null,
      uploadLoading: false,
      loadingPercentage: null,
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
  mounted() {},
  methods: {
    ...mapMutations('authentication', ['setUser', 'updateUser']),
    uploadPhoto(file) {
      this.uploadLoading = true
      const fileExtension = file.type.split('/').pop()
      const storageRef = storage().ref(`users/${this.user.id}/profilePhoto.${fileExtension}`)
      this.uploadLoading = true
      this.uploadComplete = false
      storageRef
        .put(file)
        .then((snapshot) => {
          this.loadingPercentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          return storageRef.getDownloadURL()
        })
        .then((downloadURL) => {
          this.uploadComplete = true
          this.updateProfilePhoto(downloadURL)
        })
        .catch((err) => {
          console.error('Error al cargar el archivo', err)
        })
        .finally(() => (this.uploadLoading = false))
      // TODO update user state to reflect changes
      // TODO emit message for toast
    },
    async updateProfilePhoto(url) {
      await firestore()
        .collection('users')
        .doc(this.user.id)
        .update({ photoURL: `${url}` })

      console.log('current user', auth().currentUser.displayName)

      const myUser = auth().currentUser
      await myUser
        .updateProfile({ photoURL: url })
        .then(function () {
          console.log(myUser)
        })
        .then(() => this.updateUser({ photoURL: url }))
        .catch(function (error) {
          console.log(error)
        })
      // await auth()
      //   .currentUser.updateProfile({
      //     photoURL: url,
      //   })
      //   .then((user) => this.setUser({ ...user, photoURL: url }))
    },
  },
}
</script>
