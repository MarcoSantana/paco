<template>
  <div class="wrapper">
    <div :id="getFieldID(schema)" v-attributes="'input'" :name="schema.inputName" :class="schema.fieldClasses">
      Schema: {{ schema.attributes.input }} <br />
      <datetime
        :id="getFieldID(schema)"
        ref="datetime-start"
        v-model="periodStart"
        v-attributes="'input'"
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
        :title="schema.title"
        auto
      ></datetime>
      <datetime
        ref="datetime-end"
        v-model="periodEnd"
        v-attributes="'input'"
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
        :title="schema.title"
        auto
      ></datetime>
    </div>
    <h2>TODO</h2>
    <ul>
      <li>Add a second time component</li>
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
    age() {
      const dob = DateTime.fromISO(this.dateTime)
      return Math.floor(dob.diffNow('years').years * -1)
    },
    dataTest() {
      // const data = `${this.schema.attributes.input}`
      const data = this.schema.attributes.input
      return data
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
</style>
