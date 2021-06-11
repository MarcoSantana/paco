<template>
  <div class="wrapper">
    <div id="period-wrapper" v-attributes="'input'" :name="schema.inputName" :class="schema.fieldClasses">
      <label class="hint" for="`${schema.attributes.input.inputIdPrefix}-start`">Fecha de inicio</label>
      <datetime
        v-model="periodStart"
        :max-datetime="dateNow"
        :input-id="`${schema.attributes.input.inputIdPrefix}-start`"
        class="form-control"
        :name="schema.inputName"
        :class="schema.fieldClasses"
        value-zone="America/Mexico_City"
        :format="{
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }"
        :phrases="{ ok: 'Continuar', cancel: 'Salir' }"
        :week-start="1"
        use12-hour
        :title="`Inicio de ${schema.title}`"
        auto
      ></datetime>
      <label class="hint" for="`${schema.attributes.input.inputIdPrefix}-end`">Fecha de terminación</label>
      <datetime
        v-model="periodEnd"
        :disabled="periodStart"
        :min-datetime="periodStart"
        :input-id="`${schema.attributes.input.inputIdPrefix}-end`"
        class="form-control"
        :name="schema.inputName"
        :class="schema.fieldClasses"
        value-zone="America/Mexico_City"
        :format="{
          month: 'long',
          year: 'numeric',
          day: 'numeric',
        }"
        :phrases="{ ok: 'Continuar', cancel: 'Salir' }"
        :week-start="1"
        use12-hour
        :title="`Fin de ${schema.title}`"
        auto
      ></datetime>
    </div>
    <h2>TODO</h2>
    <ul>
      <li>Style to put inline the two dates</li>
    </ul>
    <h2>TODO</h2>
    <ul>
      <li>Add a model (json) that reflects start and end</li>
      <li>Compute the time period</li>
      <li>show/hide time period from schema</li>
    </ul>
  </div>
</template>
<script>
import { abstractField } from 'vue-form-generator'
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import { Settings, DateTime } from 'luxon'

Settings.defaultLocale = 'es'

export default {
  name: 'FieldDate',
  components: { Datetime },
  mixins: [abstractField],
  data() {
    return {
      show: true,
      dateTime: null,
      periodStart: null,
      periodEnd: null,
    }
  },
  computed: {
    dateNow() {
      return DateTime.fromObject(Date.now())
    },
    startTitle() {
      const startTitle = `${this.schema.title} inicio`
      return startTitle
    },
  },

  watch: {
    // model() {},
  },
  mounted() {
    document.querySelector('.vdatetime-input').placeholder = 'Clic para ingresar fecha'
  },
  methods: {},
}
</script>

<style lang="scss">
@import '@/theme/style.scss';
@import '@/theme/variables.scss';

.document-container {
  border: 0;
  // width: auto;
  // height: auto;
  & span {
    border: 1px dashed $light-accent;
  }
  @include respond(tablet) {
    // responsive code for tablet viewport i.e. 600px
    max-height: 50px;
    width: 100%;
  }

  @include respond(mobile) {
    // responsive code for mobile viewport i.e. 480px
    font-size: 0.8rem;
    max-height: 50px;
  }
}
label {
  color: $main;
}
</style>
