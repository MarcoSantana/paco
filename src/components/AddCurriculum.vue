<template>
  <div class="box">
    form model: {{ model }}
    <vue-form-generator :schema="schema" :model="model" :options="formOptions"> </vue-form-generator>
  </div>
</template>
<script>
import 'vue-form-generator/dist/vfg'

export default {
  components: {},
  data: () => ({
    formOptions: {
      validateAfterLoad: true,
      validateAfterChanged: true,
      validateAsync: true,
    },
    model: {},
    schema: {
      groups: [
        // User details
        {
          legend: 'Datos personales',
          fields: [
            // Names
            {
              type: 'input',
              inputType: 'text',
              label: 'Nombre (s)',
              model: 'user.firstName',
              attributes: {
                input: { 'data-test': 'curriculum-user-firstName' },
              },
              readonly: false,
              disabled: false,
              styleClasses: 'document-form',
              validator: ['required', 'regexp'],
              pattern: "^[ a-zA-ZáéíóúÁÉÍÓÚÄËÏÖÜäëïöü'-]+$",
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Apellido paterno',
              model: 'user.lastName1',
              attributes: {
                input: { 'data-test': 'curriculum-user-lastName1' },
              },
              readonly: false,
              disabled: false,
              styleClasses: 'document-form',
              validator: ['regexp', 'required'],
              pattern: "^[ a-zA-ZáéíóúÁÉÍÓÚÄËÏÖÜäëïöü'-]+$",
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Apellido Materno',
              required: false,
              model: 'user.lastName2',
              attributes: {
                input: { 'data-test': 'curriculum-user-lastName2' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
              validator: ['regexp'],
              pattern: "^[ a-zA-ZáéíóúÁÉÍÓÚÄËÏÖÜäëïöü'-]+$",
            },
            // DOB
            {
              type: 'date',
              label: 'Fecha de nacimiento',
              model: 'user.dob',
              title: 'Fecha de nacimiento',
              age: true,
              attributes: {
                input: { 'data-test': 'curriculum-user-dob' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
            },
            // RFC
            {
              type: 'input',
              inputType: 'text',
              label: 'RFC',
              hint: 'Registro federal de contribuyentes',
              model: 'user.rfc',
              attributes: {
                input: { 'data-test': 'curriculum-user-rfc' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
              validator: ['required', 'regexp'],
              pattern: '^[a-zA-Z]{4}[0-9]{6}[A-Za-z0-9_]{3}$',
            },
            // CURP
            {
              type: 'input',
              inputType: 'text',
              label: 'CURP',
              hint: 'Clave única de registro de población',
              model: 'user.curp',
              attributes: {
                input: { 'data-test': 'curriculum-user-curp' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
              validator: ['required', 'regexp'],
              pattern:
                '^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$',
            },
            // Address
            {
              type: 'googleAddress',
              label: 'Domicilio permanente',
              hint: 'Domicilio actual',
              model: 'user.address',
              attributes: {
                input: { 'data-test': 'curriculum-user-googleAddress' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
              onPlaceChanged: (value, place, rawPlace, model, schema) => {
                console.log('value :>> ', value)
                console.log('place :>> ', place)
                console.log('rawPlace :>> ', rawPlace)
                console.log('model :>> ', model)
                console.log('schema :>> ', schema)
              },
            },
            // email
            {
              type: 'input',
              inputType: 'user.email',
              label: 'Correo electrónico',
              hint: 'Una dirección de correo válida',
              model: 'user.email',
              attributes: {
                input: { 'data-test': 'curriculum-user-email' },
              },
              styleClasses: 'document-form',
              visibility: 'true',
              validator: ['email'],
            },
          ],
        },
        // Studies
        {
          legend: 'Estudios profesionales',
          fields: [
            // university
            {
              type: 'university',
              id: 'college',
              label: 'Título de médico cirujano expedido por:',
              hint: 'Universidad formativa',
              model: 'college',
              attributes: {
                input: { 'data-test': 'curriculum-user-university' },
              },
              styleClasses: 'document-form',
              visibility: 'true',
              campus: true,
            },
            // graduationDate
            {
              type: 'date',
              label: 'Fecha de expedicioń del título',
              model: 'college.graduationDate',
              title: 'Fecha de expedición del título',
              age: false,
              attributes: {
                input: { 'data-test': 'curriculum-user-graduationDate' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
            },
            // degree emission place
            {
              type: 'googleAddress',
              label: 'Lugar de expedición del título',
              hint: 'Mty, CMDX, Gdl, etc.',
              model: 'college.place',
            },
          ],
        },
        // Postgraduate
        {
          legend: 'Estudios de posgrado en pediatría',
          fields: [
            // Hospital (postgraduate)
            {
              type: 'hospital',
              label: 'Estudios de posgrado en pediatría efectuados en:',
              model: 'postgraduate.hospital',
              attributes: {
                input: { 'data-test': 'curriculum-user-hospital' },
              },
            },
            // Endorsing institution
            {
              type: 'university',
              id: 'endorser',
              name: 'foo',
              label: 'Avalado por',
              hint: 'Universidad',
              model: 'postgraduate.college',
              attributes: {
                input: { 'data-test': 'curriculum-posgraduate-university' },
              },
              styleClasses: 'document-form',
              visibility: 'true',
              campus: false,
            },
            // Postgraduate studies
            {
              type: 'period',
              label: 'Estudios realizados entre',
              model: 'postgraduate.period',
              title: 'Estudios de posgrado en pediatría',
              attributes: {
                input: {
                  'data-test': 'curriculum-user-postgraduatePeriod',
                  inputIdPrefix: 'postgraduatePeriod',
                },
                visibility: 'true',
                styleClasses: 'document-form',
              },
            },
            // Postgraduate studies place
            {
              type: 'googleAddress',
              label: 'Ciudad',
              hint: 'Mty, CMDX, Gdl, etc.',
              model: 'postgraduate.place',
              attributes: {
                input: {
                  'data-test': 'curriculum-user-postgraduatePlace',
                  inputIdPrefix: 'postgraduatePlace',
                },
                visibility: 'true',
                styleClasses: 'document-form',
              },
            },
          ],
        },
        // Professional exercise
        {
          legend: 'Ejercicio profesional en pediatria actual',
          fields: [
            {
              type: 'input',
              inputType: 'text',
              label: 'Nombre del lugar',
              model: 'professionalExercise.description',
              hint: 'Ej. Consultorio privado, Hospital General No. 450, Durango',
            },
            {
              type: 'googleAddress',
              label: 'Lugar',
              hint: 'Mty, CMDX, Gdl, etc.',
              model: 'professionalExercise.location',
            },
          ],
        },
      ],
    },
  }),
}
</script>
<style lang="scss">
@import '@/theme/style.scss';
@import '@/theme/variables.scss';

fieldset {
  margin-top: 1.75rem;
  legend {
    font-size: 1.5rem;
    color: $main;
    padding-bottom: 0.75rem;
  }
}
</style>
