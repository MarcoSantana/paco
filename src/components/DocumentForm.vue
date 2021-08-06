<template>
  <div>
    <label for="`upload-${fileName}">
      <h4 v-if="fileName">{{ documentFileNames[fileName] }}</h4>
      Editab:: {{ editable }}
    </label>
    <div v-if="fileName && picture && picture.i && pictureMetadata">
      <document-file
        class="document-file"
        :name="`${fileName}-modal`"
        :url="picture.i"
        :type="pictureMetadata"
        :file-name="fileName"
      ></document-file>
    </div>
    <div v-if="uploadFileError" class="error-text">{{ uploadFileError }}</div>
    <span :id="`upload-${fileName}-errors`" :class="{ error: errors[0] }">
      <div v-show="editable" class="input-container">
        <span style="padding: 0.35rem;">{{ errors[0] }}</span>
        <input type="button" class="file-button" value="Cargar documento" @click="clickLoadFile" />
        <input
          :ref="`upload-${fileName}`"
          type="file"
          class="file"
          data-test=""
          :name="`upload-${fileName}`"
          @change="fileSelected"
        />
      </div>
    </span>
    <!-- TODO add spinner 202108.06-08.53 -->
    <p v-if="uploadValue && uploadValue > 99">Progress: {{ uploadValue.toFixed() + '%' }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { storage } from 'firebase'
import DocumentFile from '@/components/DocumentFile'

export default {
  components: { DocumentFile },
  props: {
    fileName: String,
    documentName: String,
    editable: Boolean,
  },
  data: () => ({
    documentFileNames: {
      avatar: 'Fotografía de título',
      degreeDiploma: 'Diploma de licenciatura',
      enarm: 'Constancia ENARM o similar',
      license: 'Cédula profesional',
      postgraduateDiploma: 'Diploma de especialidad',
      residence: 'Diploma de residencia',
      voucher: 'Comprobante de pago',
    },
    uploadFileError: null,
    selectedFile: null,
    currentFileName: null,
    errors: [],
    uploadValue: 0,
    picture: null,
    pictureMetadata: null,
  }),
  computed: {
    ...mapState('authentication', ['user']),
  },
  mounted() {
    this.getFileData()
  },
  methods: {
    clickLoadFile() {
      // this.$document.getElementById(this.getFileId).click()
      this.$refs[`upload-${this.fileName}`].click()
    },
    fileSelected(event) {
      ;[this.selectedFile] = event.target.files
      this.picture.i = URL.createObjectURL(this.selectedFile)

      console.log('event :>> ', event)
      console.log('this.selectedFile :>> ', this.selectedFile)
      console.log('this.fileName :>> ', this.fileName)
      // this.emitUpload()
      this.onUpload()
    },
    emitUpload() {
      console.log('emit upload')
      this.$emit('uploadFile', this.selectedFile, this.fileName)
    },
    onUpload() {
      console.log('onUpload')
      try {
        const storageRef = storage().ref(`documents/${this.user.id}`)
        storageRef
          .child(`${this.documentName}/${this.fileName}`)
          .put(this.selectedFile)
          .then(() => {
            // FIXME Move me to a function 202108.06-08.51
            storageRef
              .child(`${this.documentName}/${this.fileName}`)
              .getDownloadURL()
              .then(url => {
                this.picture.i = url
                console.log('this.picture :>> ', this.picture)
              })
          })
        // TODO add this and a spinner 202108.06-08.52
        // const uploadTask = storageRef.child(`${this.document.name}/${fileName}`).put(file)
        // uploadTask.on(
        //   'state_changed',
        //   snapshot => {
        //     this.uploadValue = (snapshot.bytesTransfered / snapshot.totalBytes) * 100
        //   },
        //   error => {
        //     this.errors.push(error)
        //   },
        //   () => {
        //     this.uploadValue = 100
        //     uploadTask.snapshot.ref.getDownloadURL().then(url => {
        //       this.picture = url
        //     })
        //   }
        // )
      } catch (error) {
        // commit('setDocumentCreationMessage', { type: 'error', message: error })
        console.log('error :>> ', error)
        throw new Error('Error al subir el documento', error)
      }
    },
    getFileData() {
      function getFile(fileRef) {
        try {
          return fileRef.getDownloadURL().then(url => {
            console.log('url :>> ', url)
            return url
          })
        } catch (error) {
          console.log('error in getFile:>> ', error)
          return error
        }
      }
      function getType(fileRef) {
        try {
          return fileRef.getMetadata().then(metadata => {
            console.log('metadata :>> ', metadata)
            return metadata
          })
        } catch (error) {
          console.log('error in getType :>> ', error)
          return error
        }
      }
      try {
        const storageRef = storage().ref(`documents/${this.user.id}/Solicitud de certificacion/`)
        const fileRef = storageRef.child(`${this.fileName}`)
        console.log('fileRef :>> ', fileRef)
        this.pictureMetadata = getType(fileRef)
        this.picture = getFile(fileRef)
      } catch (error) {
        console.log('error :>> ', error)
        return null
      }
      return true
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/style.scss';
@import '@/theme/variables.scss';

img {
  max-height: 200px;
  width: auto;
}
input.file {
  visibility: hidden;
  display: none;
}
</style>
