<template>
  <div class="container">
    <h1>{{ document.name }}</h1>
    <h2>Estado: {{ document.status | docStatus }}</h2>
    <h3>{{ document.message }}</h3>
    <div class="document-grid">
      <div>
        <h3>Detalles del aspirante</h3>
        <span>
          Nombres: {{ document.user.firstName }} {{ document.user.lastName1 }}
          {{ document.user.lastName2 ? document.user.lastName2 : '' }}
        </span>
        <br />
        <span>Fecha de nacimiento: {{ document.user.dob | intlDate }}</span>
        <span>
          <small>Edad: {{ document.user.dob | age }}</small>
        </span>
        <br />
        <span>País de nacimiento: {{ document.user.nacionality }}</span>
        <br />
        <span>Género: {{ user.gender }} <i :class="document.user.gender | genderize"></i></span>
        <br />
        <span>CURP: {{ document.user.curp }}</span>
        <br />
        <span>RFC: {{ document.user.rfc }}</span>
      </div>
      <div>
        <h4>Datos de contacto</h4>
        <span>Correo electrónico: {{ document.user.contact.email }}</span>
        <br />
        <span>Teléfono celular: {{ document.user.contact.cellphone }}</span>
        <br />
        <span>Fax: {{ document.user.contact.fax }}</span>
        <br />
        <span>Teléfono: {{ document.user.contact.telephone }}</span>
        <br />
        <span>Dirección: {{ document.user.address }}</span>
      </div>
      <div>
        <h3>Detalles de solicitud</h3>
        <span>{{ document.request.address }} {{ document.request.date | intlDate }}</span>
        <br />
        <span>Examen previo: {{ document.request.previousExam }}</span>
      </div>
      <div>
        <h3>Estudios de posgrado</h3>
        <span>Cédula profesional: {{ document.request.postgraduate.license }}</span>
        <br />
        <span>Especialidad: {{ document.request.postgraduate.specialty }}</span>
        <br />
        <span>Hospital formativo: {{ document.request.postgraduate.hospital }}</span>
        <br />
        <span>Fecha de graduación: {{ document.request.postgraduate.graduationDate | intlDate }}</span>
        <br />
      </div>
      <div>
        <h3>Práctica profesional</h3>
        <span>Hospital donde labora: {{ document.request.professionalExercise.hospital }}</span>
        <span>Dirección: {{ document.request.professionalExercise.location }}</span>
        <span>Cargo: {{ document.request.professionalExercise.charge }}</span>
      </div>
      <div v-for="requiredFile in requiredFiles" :key="requiredFile">
        <div class="">
          <!-- <form @submit.prevent="onSubmit"> -->
          <h3></h3>
          <div v-if="uploadFileError" class="error-text">{{ uploadFileError }}</div>
          <span id="`upload-${requiredFile}-errors`" :class="{ error: errors[0] }">
            <div class="input-container">
              <span style="padding: 0.35rem;">{{ errors[0] }}</span>
              <input id="`upload-${requiredFile}`" type="file" data-test="login-email" @change="fileSelected" />
            </div>
          </span>
          <p v-if="uploadValue && uploadValue > 99">Progress: {{ uploadValue.toFixed() + '%' }}</p>
          <p v-if="picture">
            IMG:>> {{ picture }}
            <img :src="picture" alt="" />
          </p>
          <p>
            <label for="`upload-${requiredFile}`">{{ documentFileNames[requiredFile] }}</label>
          </p>
          <div>
            <button
              v-show="selectedFile"
              type="submit"
              name="signup_submit"
              data-test="signup-submit"
              @click.prevent="
                currentFileName = requiredFile
                onUpload()
              "
            >
              Cargar Archivo
            </button>
          </div>

          <!-- </form> -->
        </div>
      </div>
      <div v-for="(file, index) in allFiles" :key="`file-${index}`" class="item">
        <br />
        <document-file
          class="document-file"
          :url="file.url.i"
          :type="file.metadata"
          @editFile="editFile"
        ></document-file>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import { isNil } from 'lodash'
import { storage } from 'firebase'
import { mapState } from 'vuex'
import DocumentFile from '@/components/DocumentFile.vue'

export default {
  components: { DocumentFile },
  filters: {
    docStatus(value) {
      if (!value) return ''
      switch (value) {
        case 1:
          value = 'Por revisar'
          break
        case 2:
          value = 'En revisión'
          break
        case 3:
          value = 'Rechazado'
          break
        case 4:
          value = 'Aceptado'
          break
        default:
          break
      }
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    intlDate(date) {
      return (
        DateTime.fromJSDate(new Date(date))
          .setLocale('es')
          // .toLocaleString(DateTime.DATETIME_FULL)
          .toLocaleString()
      )
    },

    age(date) {
      if (date) {
        const dob = DateTime.fromISO(date)
        return Math.floor(dob.diffNow('years').years * -1)
      }
      return null
    },
    ago(date) {
      const newValueParsed = DateTime.fromJSDate(new Date(date))
      const now = DateTime.now()
      return Math.round(now.diff(newValueParsed, ['days']).days)
    },
    genderize: value => {
      let gender = null
      if (!isNil(value)) {
        if (value.toString() === 'Hombre') {
          gender = 'mdi mdi-gender-male icon'
        }
        if (value.toString() === 'Mujer') {
          gender = 'mdi mdi-gender-female icon'
        }
        return gender
      }
      return value
    },
  },
  props: {
    document: Object,
  },
  data: () => ({
    requiredFiles: ['avatar', 'degreeDiploma', 'enarm', 'license', 'postgraduateDiploma', 'residence', 'voucher'],
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
  }),
  computed: {
    ...mapState('authentication', ['user']),
  },
  methods: {
    editFile(url) {
      console.log('url', url)
    },
    fileSelected(event) {
      ;[this.selectedFile] = event.target.files
      console.log('event :>> ', event)
      console.log('this.selectedFile :>> ', this.selectedFile)
      return true
    },
    onUpload() {
      console.log('onUpload')
      try {
        const element = this.currentFileName
        console.log('element :>> ', element)
        console.log('this.user.id :>> ', this.user.id)
        const storageRef = storage().ref(`documents/${this.user.id}`)
        const uploadTask = storageRef.child(`${this.document.name}/${element}`).put(this.selectedFile)
        uploadTask.on(
          'state_changed',
          snapshot => {
            this.uploadValue = (snapshot.bytesTransfered / snapshot.totalBytes) * 100
          },
          error => {
            this.errors.push(error)
          },
          () => {
            this.uploadValue = 100
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
              this.picture = url
            })
          }
        )
      } catch (error) {
        // commit('setDocumentCreationMessage', { type: 'error', message: error })
        console.log('error :>> ', error)
        throw new Error('Error al subir el documento', error)
      }
    },
  },
  asyncComputed: {
    allFiles() {
      function getFile(fileRef) {
        return fileRef.getDownloadURL().then(url => {
          return url
        })
      }
      function getType(fileRef) {
        return fileRef.getMetadata().then(metadata => {
          return metadata
        })
      }
      const storageRef = storage().ref(`documents/${this.user.id}/`)
      const listRef = storageRef.child(`${this.document.name}`)
      const urls = listRef
        .listAll()
        .then(res => {
          const files = []
          res.items.forEach(itemRef => {
            const url = getFile(itemRef)
            const metadata = getType(itemRef)
            files.push({
              url,
              metadata,
            })
          })
          return files
        })
        .catch(error => {
          console.error(error)
        })
      return urls
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
.document-grid {
  display: grid;
  grid-gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  div {
    margin: 0.75rem;
    padding: 0.25rem;
  }
}

.document-grid img {
  width: 100%;
}
</style>
