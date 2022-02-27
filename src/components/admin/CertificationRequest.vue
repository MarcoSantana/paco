<template>
  <div class="container">
    <v-card>
      <v-card-title class="text-h5 white--text justify-center mb-2 indigo lighten-3">{{
        $t('documentDetails') | capitalize
      }}</v-card-title>
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
          <v-list-item-title>{{ $t('name') | capitalize }}</v-list-item-title>
          <v-list-item-subtitle @click="copyText($event)">
            {{ user.firstName | capitalize }} {{ user.lastName1 | capitalize }}
            {{ user.lastName2 ? user.lastName2 : '' | capitalize }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>{{ $t('userData.dob') | capitalize }}</v-list-item-title>
          <v-list-item-subtitle @click="copyText($event)">
            {{ user.dob | intlDate }}
            <small>{{ $t('userData.age') | capitalize }} {{ user.dob | age }}</small>
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>{{ $t('userData.pob') | capitalize }}</v-list-item-title>
          <v-list-item-subtitle @click="copyText($event)">{{ user.nacionality }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item>
          <v-list-item-title>{{ $t('userData.gender') | capitalize }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.gender }} <i :class="user.gender | genderize"></i> </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>{{ $t('userData.curp') }}</v-list-item-title>
          <v-list-item-subtitle @click="copyText($event)">{{ user.curp }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>{{ $t('userData.rfc') }}</v-list-item-title>
          <v-list-item-subtitle @click="copyText($event)">{{ user.rfc }}</v-list-item-subtitle></v-list-item
        >
        <v-divider></v-divider>
        <v-list-item class="text-center"
          ><v-list-item-title>{{ $t('userData.contactData') | capitalize }}</v-list-item-title></v-list-item
        >
        <v-list-item
          ><v-list-item-title>{{ $t('userData.email') | capitalize }} </v-list-item-title
          ><v-list-item-subtitle @click="copyText($event)">{{ user.contact.email }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>{{ $t('userData.cellphone') | capitalize }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.contact.cellphone }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item
          ><v-list-item-title>{{ $t('userData.phone') | capitalize }} </v-list-item-title
          ><v-list-item-subtitle @click="copyText($event)">{{ user.contact.phone }}</v-list-item-subtitle></v-list-item
        >

        <v-list-item
          ><v-list-item-title>{{ $t('userData.fax') | capitalize }}</v-list-item-title
          ><v-list-item-subtitle>{{ user.contact.fax }}</v-list-item-subtitle></v-list-item
        >

        <v-list-item
          ><v-list-item-title>{{ $t('userData.address') | capitalize }}</v-list-item-title
          ><v-list-item-subtitle> {{ user.contact.address }}</v-list-item-subtitle></v-list-item
        >
        <v-divider />
        <v-list-item
          ><v-list-item-title class="text-center">
            {{ $t('request.details') | capitalize }}
          </v-list-item-title></v-list-item
        >
        <v-list-item>
          <v-list-item-title>{{ $t('request.place') | capitalize }}</v-list-item-title>
          <v-list-item-subtitle @click="copyText($event)">{{ request.address }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item
          ><v-list-item-title>{{ $t('request.date') | capitalize }} </v-list-item-title
          ><v-list-item-subtitle>{{ request.date }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>{{ $t('request.previous') | capitalize }}</v-list-item-title
          ><v-list-item-subtitle>{{ request.previousExam }}</v-list-item-subtitle></v-list-item
        >
        <v-divider />
        <v-list-item class="text-center"
          ><v-list-item-title>{{ $t('request.voucher') | capitalize }}</v-list-item-title></v-list-item
        >
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
          ><v-list-item-title class="text-center">{{
            $t('request.degree') | capitalize
          }}</v-list-item-title></v-list-item
        >
        <v-list-item
          ><v-list-item-title>{{ $t('request.title') | capitalize }}</v-list-item-title></v-list-item
        >
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
          <v-list-item-title>{{ $t('request.enarm') | capitalize }}</v-list-item-title>
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
        <v-list-item class="text-center"
          ><v-list-item-title>{{ $t('request.postDegree') | capitalize }}</v-list-item-title></v-list-item
        >
        <v-list-item>
          <v-list-item-title>{{ $t('request.postDegreeLicense') | capitalize }}</v-list-item-title
          ><v-list-item-subtitle @click="copyText($event)">{{
            request.postgraduate.license
          }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item class="text-center"
          ><v-list-item-title>{{ $t('request.license') | capitalize }}</v-list-item-title></v-list-item
        >
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
<<<<<<< HEAD
          <div>Universidad</div>
          <div>Especialidad: {{ request.postgraduate.specialty }}</div>
          <div>Hospital formativo: {{ request.postgraduate.hospital }}</div>
          <div>Fecha de graduación: {{ request.postgraduate.graduationDate | intlDate }}</div>
          <div>
            <div>Constancia de residencia progresiva hospitalaria</div>
            <document-file
              class="document-file"
              :document-name="document.name"
              :user-id="document.userId"
              file-name="residence"
            ></document-file>
          </div>
        </div>
        <div>
          <div>Diploma institucional en Medicina de Urgencias o en su caso Urgencias Pediatricas</div>
=======
        </v-list-item>
        <v-divider />
        <v-list-item
          ><v-list-item-title>{{ $t('request.specialty') | capitalize }}</v-list-item-title
          ><v-list-item-subtitle>{{ request.postgraduate.specialty }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>{{ $t('request.schoolHospital') | capitalize }}</v-list-item-title
          ><v-list-item-subtitle @click="copyText($event)">{{
            request.postgraduate.hospital
          }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>{{ $t('request.specialtyGraduationDate') | capitalize }}</v-list-item-title
          ><v-list-item-subtitle>{{
            request.postgraduate.graduationDate | intlDate
          }}</v-list-item-subtitle></v-list-item
        >
        <v-divider />
        <v-list-item class="text-center"
          ><v-list-item-title>
            {{ $t('request.postDegreeCertificate') | capitalize }}
          </v-list-item-title></v-list-item
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
          ><v-list-item-title>{{ $t('request.postDegreeDiploma') | capitalize }}</v-list-item-title></v-list-item
        >
        <v-list-item class="center">
>>>>>>> feature/fixCertificationReq
          <document-file
            class="document-file"
            :document-name="document.name"
            :user-id="document.userId"
            file-name="postgraduateDiploma"
          ></document-file>
<<<<<<< HEAD
        </div>
      </div>
      <!-- // postgraduateUniversitaryDiploma -->
      <div>
        <div>Diploma universitario en Medicina de Urgencias o en su caso Urgencias Pediatricas</div>
        <document-file
          class="document-file"
          :document-name="document.name"
          :user-id="document.userId"
          file-name="postgraduateUniversitaryDiploma"
        ></document-file>
      </div>
      <div>
        <h4>Práctica profesional</h4>
        <div>Hospital donde labora: {{ request.professionalExercise.hospital }}</div>
        <div>Dirección: {{ request.professionalExercise.location }}</div>
        <div>Cargo: {{ request.professionalExercise.charge }}</div>
      </div>
    </div>
=======
        </v-list-item>
        <v-divider />
        <v-list-item
          ><v-list-item-title>{{ $t('request.profesionalPractice') | capitalize }}</v-list-item-title></v-list-item
        >
        <v-list-item
          ><v-list-item-title>{{ $t('request.professionalExerciseHospital') | capitalize }}</v-list-item-title
          ><v-list-item-subtitle @click="copyText($event)">{{
            request.professionalExercise.hospital
          }}</v-list-item-subtitle></v-list-item
        >
        <v-list-item
          ><v-list-item-title>{{
            $t('request.professionalExerciseLocation') | capitalize
          }}</v-list-item-title></v-list-item
        >
        <v-list-item
          ><v-list-item-title>{{ $t('request.professionalExerciseCharge') | capitalize }}</v-list-item-title
          ><v-list-item-subtitle @click="copyText($event)">{{
            request.professionalExercise.charge
          }}</v-list-item-subtitle></v-list-item
        >
      </v-list>
      <v-snackbar v-model="copySnackbar" timeout="2000">
        {{ copyMessage }}

        <template v-slot:action="{ attrs }">
          <v-btn color="error" text v-bind="attrs" @click="copySnackbar = false">
            {{ $t('actions.close') | capitalize }}
          </v-btn>
        </template>
      </v-snackbar>
    </v-card>
>>>>>>> feature/fixCertificationReq
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
      console.log('newDate', newDate)
      if (!date || Number.isNaN(newDate)) {
        // return this.$t('errors.missingData')
        return 'Datos faltantes'
      }
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
      copyMessage: '',
      copySnackbar: false,
    }
  },
  computed: {},
  mounted() {},
  methods: {
    copyText(event) {
      navigator.clipboard
        .writeText(event.target.innerHTML)
        .then(() => {
          this.copyMessage = 'Texto copiado!'
        })
        .catch(err => {
          this.copyMessage = `Error al copiar ${err}'`
        })
        .finally(() => {
          this.copySnackbar = true
        })
    },
  },
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
