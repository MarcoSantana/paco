<template>
  <div class="container">
    <v-card>
      <v-card-title class="text-h5 white--text justify-center mb-2 indigo lighten-3">
        Detalles del aspirante</v-card-title
      >
      <v-list>
        <v-list-item class="text-center">
          <document-file
            class="document-file"
            :document-name="documentName"
            :user-id="document.userId"
            :scrollable-modal="true"
            :resizable-modal="true"
            file-name="avatar"
          />
        </v-list-item>
        <v-list-item>
          <v-list-item-title>{{ $t('name') | capitalize }}:</v-list-item-title
          ><v-list-item-subtitle>
            {{ user.firstName | capitalize }} {{ user.lastName1 | capitalize }}
            {{ user.lastName2 ? user.lastName2 : '' | capitalize }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Fecha de nacimiento:</v-list-item-title>
          <v-list-item-subtitle>
            {{ user.dob | intlDate }}
            <small>Edad: {{ user.dob | age }}</small>
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item
          ><v-list-item-title>Lugar de nacimiento:</v-list-item-title>
          <v-list-item-subtitle>{{ user.nacionality }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>Género:</v-list-item-title>
          <v-list-item-subtitle>{{ user.gender }} <i :class="user.gender | genderize"></i> </v-list-item-subtitle
        ></v-list-item>
        <v-list-item>
          <v-list-item-title>CURP:</v-list-item-title>
          <v-list-item-subtitle>{{ user.curp }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item
          ><v-list-item-title>RFC:</v-list-item-title>
          <v-list-item-subtitle>{{ user.rfc }}</v-list-item-subtitle></v-list-item
        >
        <v-divider></v-divider>
        <v-list-item class="text-center"><v-list-item-title>Datos de contacto</v-list-item-title></v-list-item>
        <v-list-item
          ><v-list-item-title>Correo electrónico: </v-list-item-title
          ><v-list-item-subtitle>{{ user.contact.email }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>Teléfono celular: </v-list-item-title
          ><v-list-item-subtitle>{{ user.contact.cellphone }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>Fax: </v-list-item-title
          ><v-list-item-subtitle>{{ user.contact.fax }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>Teléfono: </v-list-item-title
          ><v-list-item-subtitle>{{ user.contact.telephone }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>Dirección: </v-list-item-title
          ><v-list-item-subtitle>{{ user.address }}</v-list-item-subtitle></v-list-item
        >
        <v-divider />
        <v-list-item><v-list-item-title class="text-center">Detalles de solicitud</v-list-item-title></v-list-item>
        <v-list-item>
          <v-list-item-title>Lugar de la solicitud: </v-list-item-title>
          <v-list-item-subtitle>{{ request.address }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item
          ><v-list-item-title>Fecha de la solicitud</v-list-item-title
          ><v-list-item-subtitle>{{ request.date | intlDate }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>Examen previo: </v-list-item-title
          ><v-list-item-subtitle>{{ request.previousExam }}</v-list-item-subtitle></v-list-item
        >
        <v-divider />
        <v-list-item class="text-center"><v-list-item-title>Recibo de pago</v-list-item-title></v-list-item>
        <v-list-item class="text-center">
          <document-file
            class="document-file"
            :document-name="documentName"
            :user-id="document.userId"
            :scrollable-modal="true"
            :resizable-modal="true"
            file-name="voucher"
          ></document-file>
        </v-list-item>
        <v-divider />
        <v-list-item
          ><v-list-item-title class="text-center">Estudios de licenciatura de medicina</v-list-item-title></v-list-item
        >
        <v-list-item><v-list-item-title>Título de la licenciatura en medicina</v-list-item-title></v-list-item>
        <v-list-item class="text-center"
          ><document-file
            class="document-file"
            :document-name="document.name"
            :user-id="document.userId"
            :scrollable-modal="true"
            :resizable-modal="true"
            file-name="degreeDiploma"
        /></v-list-item>
        <v-list-item>
          <v-list-item-title>Documento del ENARM (constancia de haber presentado o equivalente)</v-list-item-title>
        </v-list-item>
        <v-list-item class="text-center">
          <document-file
            class="document-file"
            :document-name="document.name"
            :user-id="document.userId"
            :scrollable-modal="true"
            :resizable-modal="true"
            file-name="enarm"
          >
          </document-file>
        </v-list-item>
        <v-divider />
        <v-list-item class="text-center"><v-list-item-title>Estudios de posgrado</v-list-item-title></v-list-item>
        <v-list-item
          ><v-list-item-title>Cédula profesional: </v-list-item-title
          ><v-list-item-subtitle>{{ request.postgraduate.license }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item class="text-center"><v-list-item-title>Cédula</v-list-item-title></v-list-item>
        <v-list-item class="text-center">
          <document-file
            class="document-file"
            :document-name="document.name"
            :user-id="document.userId"
            :scrollable-modal="true"
            :resizable-modal="true"
            file-name="license"
          >
          </document-file>
        </v-list-item>
        <v-divider />
        <v-list-item
          ><v-list-item-title>Especialidad: </v-list-item-title
          ><v-list-item-subtitle>{{ request.postgraduate.specialty }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>Hospital formativo: </v-list-item-title
          ><v-list-item-subtitle>{{ request.postgraduate.hospital }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>Fecha de graduación: </v-list-item-title
          ><v-list-item-subtitle>{{
            request.postgraduate.graduationDate | intlDate
          }}</v-list-item-subtitle></v-list-item
        >
        <v-divider />
        <v-list-item class="text-center"
          ><v-list-item-title>Constancia de residencia progresiva hospitalaria</v-list-item-title></v-list-item
        >
        <v-list-item class="text-center">
          <document-file
            class="document-file"
            :document-name="document.name"
            :user-id="document.userId"
            file-name="pediatricResidence"
          ></document-file>
        </v-list-item>
        <v-list-item class="text-center"
          ><v-list-item-title
            >Diploma institucional en Medicina de Urgencias o en su caso Urgencias Pediatricas</v-list-item-title
          ></v-list-item
        >
        <v-list-item class="center">
          <document-file
            class="document-file"
            :document-name="document.name"
            :user-id="document.userId"
            file-name="postgraduateDiploma"
          ></document-file>
        </v-list-item>
        <v-divider />
        <v-list-item><v-list-item-title>Práctica profesional</v-list-item-title></v-list-item>
        <v-list-item
          ><v-list-item-title>Hospital donde labora: </v-list-item-title
          ><v-list-item-subtitle>{{ request.professionalExercise.hospital }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>Dirección: </v-list-item-title
          ><v-list-item-subtitle>{{ request.professionalExercise.location }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>Cargo: </v-list-item-title
          ><v-list-item-subtitle>{{ request.professionalExercise.charge }}</v-list-item-subtitle></v-list-item
        >
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import { isNil } from 'lodash'
import DocumentFile from '@/components/admin/DocumentFile.vue'

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

.document-file {
  max-width: 200px;
}
</style>
