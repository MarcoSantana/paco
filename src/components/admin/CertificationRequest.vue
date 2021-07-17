<template>
  <div class="details-container">
    <div>
      <h3>Detalles del aspirante</h3>
      <div>
        <div>Nombres: {{ user.firstName }} {{ user.lastName1 }} {{ user.lastName2 ? user.lastName2 : '' }}</div>
        <div class="row">
          <div>Fecha de nacimiento: {{ user.dob | intlDate }}</div>
          <div>
            <small>Edad: {{ user.dob | age }}</small>
          </div>
        </div>
        <div>País de nacimiento: {{ user.nacionality }}</div>
        <div>Género: {{ user.gender }} <i :class="user.gender | genderize"></i></div>
        <div>CURP: {{ user.curp }}</div>
        <div>RFC: {{ user.rfc }}</div>
        <h4>Datos de contacto</h4>
        <div>Correo electrónico: {{ user.contact.email }}</div>
        <div>Teléfono celular: {{ user.contact.cellphone }}</div>
        <div>Fax: {{ user.contact.fax }}</div>
        <div>Teléfono: {{ user.contact.telephone }}</div>
        <div>Dirección: {{ user.address }}</div>
      </div>
      <h3>Detalles de solicitud</h3>
      <div>
        <div>{{ request.address }} {{ request.date | intlDate }}</div>
        <div>Examen previo: {{ request.previousExam }}</div>
      </div>
      <div>
        <h4>Estudios de posgrado</h4>
        <div>
          <div>Cédula profesional: {{ request.postgraduate.license }}</div>
          <div>Cedula</div>
          <document-file :document-name="document.name" :user-id="document.userId" file-name="license"> </document-file>
          <div>Universidas</div>
          <div>Especialidad: {{ request.postgraduate.specialty }}</div>
          <div>Hospital formativo: {{ request.postgraduate.hospital }}</div>
          <div>Fecha de graduación: {{ request.postgraduate.graduationDate | intlDate }}</div>
          <div>
            <document-file
              :document-name="document.name"
              :user-id="document.userId"
              file-name="pediatricResidence"
            ></document-file>
          </div>
        </div>
      </div>
      <div>
        <h4>Práctica profesional</h4>
        <div>Hospital donde labora: {{ request.professionalExercise.hospital }}</div>
        <div>Dirección: {{ request.professionalExercise.location }}</div>
        <div>Cargo: {{ request.professionalExercise.charge }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import { isNil } from 'lodash'
import DocumentFile from '@/components/admin/DocumentFile.vue'
// TODO move this to a method that runs on mounted in a tiny component
// import { storage } from 'firebase'

export default {
  components: {
    DocumentFile,
    // TODO Export this to ist own component 202107.17-11.42
    // props: document name, user name
    // lightbox/modal or some crap
  },
  filters: {
    intlDate(date) {
      const newDate = new Date(date)
      return DateTime.fromJSDate(newDate)
        .setLocale('es')
        .toLocaleString()
    },
    age(date) {
      if (date) {
        const dob = DateTime.fromISO(date)
        return Math.floor(dob.diffNow('years').years * -1)
      }
      return null
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
  data() {
    return {
      // ...document,
      request: this.document.data.request,
      user: this.document.data.user,
      documentName: this.document.data.name,
    }
  },
  computed: {},
  // TODO move this to a method that runs on mounted in a tiny component
  // asyncComputed: {
  //   licenseFile() {
  //     const storageRef = storage().ref(`documents/${this.document.userId}/${this.documentName}/license`)
  //     const url = storageRef.getDownloadURL().then(res => res)
  //     return url
  //   },
  // },

  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
@import '@/theme/style.scss';
@import '@/theme/variables.scss';

.details-container {
  background-color: whitesmoke;
  border: 1px;
  border-color: $light-accent;
}
.row {
  display: flex;
}
small {
  color: grey;
  margin: 0.35rem;
}
.btn {
  @extend .delete-btn;
  background-color: transparent;
  color: $main;
  border: none;
  :hover {
    background-color: $main;
    color: $light-accent;
    opacity: 0.7;
    cursor: pointer;
  }
}
.delete-btn {
  border: none;
}
.pending {
  color: lighten($danger-color, 10%);
}
</style>
