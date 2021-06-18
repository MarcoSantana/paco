<template>
  <div class="wrapper">
    <div id="period-wrapper" v-attributes="'input'" :name="schema.inputName" :class="schema.fieldClasses">
      <label class="hint" for="`${schema.attributes.input.inputIdPrefix}-start`">Fecha de inicio</label>
      Period>> {{ period }}
      <datetime
        v-if="dateNow"
        v-model="period.start"
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
        v-model="period.end"
        :disabled="!period.start"
        :min-datetime="period.start"
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
      period: { start: null, end: null },
    }
  },
  computed: {
    dateNow() {
      return DateTime.now().toISO()
    },
  },

  watch: {
    period: {
      handler(newVal) {
        this.value = newVal
      },
      deep: true,
    },
  },
  mounted() {},
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
