<template>
  <v-container>
    <h1 class="text-capitalize">
      {{ $t('document.name') }}: {{ $t(`document.types.${document.name}`) }}
    </h1>
    <h2 class="text-capitalize">
      {{ $t('document.status') }}:
      {{ $t(`document.statusKey[${document.status}]`) }}
    </h2>
    <h3 v-show="editable">
      <small>Mensaje del administrador:</small>
      {{ document.message }}
    </h3>
    <v-card>
      <v-card-title>Estamos en mantenimiento</v-card-title>
      <v-img src="/img/IT_Support_Two_Color.svg" alt="" />
    </v-card>
    <!-- <div class="text-capitalize">{{ $t('document.createTimestamp') }}: {{ document.createTimestamp | intlDate }}</div>
         <show-file v-if="document.files" :files="document.files"></show-file>
         <div v-if="document.files">
         <show-file v-for="file in document.files" :key="file" :url="file" />
         </div>
         <div v-show="editable">
         <h4>Enviar para revisión</h4>
         <div>
         <v-btn color="accent" elevation="2" @click="markForReview">Enviar</v-btn>
         </div>
         </div> -->
  </v-container>
  <!-- <div class="container">
      <h1>{{$t('document.createTimestamp')}}>> {{ document.createTimestamp }}</h1>
      <h1>{{$t('document.updateTimestamp')}}>> {{ document.updateTimestamp }}</h1>
      <h1>{{$t('document.id')}}>> {{ document.id }}</h1>
    <h1>{{ document.name }}</h1>
    <h2>Estado: {{ document.status | docStatus }}</h2>
    <h2 v-show="!editable">
      Recuerde que los archivos de sus documentos no pueden ser cambiados si la "solicitud de certificación" no ha sido marcada como "Rechazada" por el administrador.
    </h2>
    <h3 v-show="editable"><small>Mensaje del administrador: </small>{{ document.message }}</h3>
    <div v-show="editable">
      <h4>Enviar para revisión</h4>
      <div>
        <button class="button" @click="markForReview">Enviar</button>
      </div>
    </div>
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
          Editable:: {{ editable ? 'Si' : 'No' }}
          <document-form
            :ref="`${requiredFile}-form`"
            :document-name="document.name"
            :file-name="requiredFile"
            :editable="editable"
          ></document-form>
        </div>
      </div>
    </div>
  </div>-->
</template>

<script>
import { DateTime } from 'luxon'
// import { isNil } from 'lodash'
import { mapActions, mapState } from 'vuex'
// import DocumentForm from '@/components/DocumentForm.vue'
// import ShowFile from '@/components/ShowFile'

export default {
  // components: { DocumentForm },
  // components: { ShowFile },
  filters: {
    //   docStatus(value) {
    //     if (!value) return ''
    //     switch (value) {
    //       case 1:
    //         value = 'Por revisar'
    //         break
    //       case 2:
    //         value = 'En revisión'
    //         break
    //       case 3:
    //         value = 'Rechazado'
    //         break
    //       case 4:
    //         value = 'Aceptado'
    //         break
    //       default:
    //         break
    //     }
    //     value = value.toString()
    //     return value.charAt(0).toUpperCase() + value.slice(1)
    //   },
    intlDate(date) {
      return (
        DateTime.fromJSDate(new Date(date))
          .setLocale('es')
          // .toLocaleString(DateTime.DATETIME_FULL)
          .toLocaleString()
      )
    },
    //   age(date) {
    //     if (date) {
    //       const dob = DateTime.fromISO(date)
    //       return Math.floor(dob.diffNow('years').years * -1)
    //     }
    //     return null
    //   },
    //   ago(date) {
    //     const newValueParsed = DateTime.fromJSDate(new Date(date))
    //     const now = DateTime.now()
    //     return Math.round(now.diff(newValueParsed, ['days']).days)
    //   },
    //   genderize: value => {
    //     let gender = null
    //     if (!isNil(value)) {
    //       if (value.toString() === 'Hombre') {
    //         gender = 'mdi mdi-gender-male icon'
    //       }
    //       if (value.toString() === 'Mujer') {
    //         gender = 'mdi mdi-gender-female icon'
    //       }
    //       return gender
    //     }
    //     return value
    //   },
  },
  props: {
    document: Object,
  },
  // data: () => ({
  //   requiredFiles: [
  //     'avatar',
  //     'degreeDiploma',
  //     'enarm',
  //     'license',
  //     'postgraduateDiploma',
  //     'postgraduateUniversitaryDiploma',
  //     'residence',
  //     'voucher',
  //   ],
  //   documentFileNames: {
  //     avatar: 'Fotografía de título',
  //     degreeDiploma: 'Diploma de licenciatura',
  //     enarm: 'Constancia ENARM o similar',
  //     license: 'Cédula profesional',
  //     postgraduateUniversitaryDiploma: 'Diploma universitario de especialidad',
  //     postgraduateDiploma: 'Diploma de especialidad',
  //     residence: 'Diploma de residencia',
  //     voucher: 'Comprobante de pago',
  //   },
  //   uploadFileError: null,
  //   selectedFile: null,
  //   currentFileName: null,
  //   errors: [],
  //   uploadValue: 0,
  //   picture: null,
  // }),
  computed: {
    ...mapState('authentication', ['user']),
    editable() {
      return this.document.status === 3
    },
  },
  methods: {
    ...mapActions('documents', ['setDocumentForReview']),
    //   ...mapActions('admin', ['readAllAsAdmin']),
    async markForReview() {
      console.clear()
      console.log('this.document.id :>> ', this.document.id)
      const data = { id: this.document.id }
      await this.setDocumentForReview(data)
        .then(result => {
          console.log('result :>> ', result)
        })
        .then(res => {
          console.log('res :>> ', res)
          this.document.status = 1
          // eslint-disable-next-line no-alert
          alert(
            'Documento marcado para ser revisado, este proceso puede tardar algunos días.'
          )
        })
      // TODO change the local state to reflect the new status of this document 202108.08-12.09
    },
  },
}
</script>

<style lang="scss" scoped>
/* @import '@/theme/variables.scss'; */
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
