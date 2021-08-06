<template>
  <div class="container">
    <h1>{{ document.name }}</h1>
    <h2>Estado: {{ document.status | docStatus }}</h2>
    <h3><small>Mensaje del administrador: </small>{{ document.message }}</h3>
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
          Editable:: {{ editable }} Status:: {{ document.status }}
          <document-form
            :ref="`${requiredFile}-form`"
            :document-name="document.name"
            :file-name="requiredFile"
            :editable="editable"
          ></document-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import { isNil } from 'lodash'
import { mapState } from 'vuex'
import DocumentForm from '@/components/DocumentForm.vue'

export default {
  components: { DocumentForm },
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
    editable() {
      console.log('this.document.status :>> ', this.document.status)
      console.log('this.document.status === "3" :>> ', this.document.status === '3')
      console.log('typeof document.status :>> ', typeof document.status)
      return this.document.status === 3
    },
  },
  methods: {},
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
