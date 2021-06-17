<template>
  <div class="wrapper">
    <div class="document-container">
      <div :id="getFieldID(schema)" :name="schema.inputName" :class="schema.fieldClasses">
        <datetime
          v-if="dateNow"
          :id="getFieldID(schema)"
          ref="datetime"
          v-model="value"
          v-attributes="'input'"
          class="form-control"
          :max-datetime="dateNow"
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
      <div v-if="schema.age && age > 1" class="form-control">
        <label for="age">Edad</label>
        <input id="age" v-model="age" type="text" name="age" readonly />
      </div>
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
      // dateTime: null,
    }
  },
  computed: {
    age() {
      // const dob = DateTime.fromISO(this.dateTime)
      if (this.value) {
        const dob = DateTime.fromISO(this.value)
        return Math.floor(dob.diffNow('years').years * -1)
      }
      return null
    },
    dateNow() {
      return DateTime.now().toISO()
      // return Date.now().toString()
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

.preview {
  position: relative;
  margin-top: 1.5rem;
  // height: 100px;
  height: auto;
  // background-repeat: no-repeat;
  // background-size: contain;
  // background-position: center center;
  // border: 1px solid #ccc;
  // border-radius: 3px;
  // box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  .remove {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXUlEQVR42u2SwQoAIAhD88vVLy8KBlaS0i1oJwP3piGVg0Skmpq8HjqZrWl9uwCbGAmwKYGZs/6iqgMyAdJuM8W2QmYKpLt/0AG9ASCv/oAnANd3AEjmAlFT1BypAV+PnRH5YehvAAAAAElFTkSuQmCC');
    background-repeat: no-repeat;
    width: 16px;
    height: 16px;
    font-size: 1.2em;
    position: absolute;
    right: 0.2em;
    bottom: 0.2em;
    opacity: 0.6;
    border-radius: 25%;
    opacity: 80%;
    &:hover {
      opacity: 1;
      cursor: pointer;
    }
  }
}
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
.vue-form-generator .field-image {
  .wrapper {
    width: 100%;
  }
  .preview {
    position: relative;
    margin-top: 5px;
    height: 100px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    .remove {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXUlEQVR42u2SwQoAIAhD88vVLy8KBlaS0i1oJwP3piGVg0Skmpq8HjqZrWl9uwCbGAmwKYGZs/6iqgMyAdJuM8W2QmYKpLt/0AG9ASCv/oAnANd3AEjmAlFT1BypAV+PnRH5YehvAAAAAElFTkSuQmCC');
      width: 16px;
      height: 16px;
      font-size: 1.2em;
      position: absolute;
      right: 0.2em;
      bottom: 0.2em;
      opacity: 0.7;
      &:hover {
        opacity: 1;
        cursor: pointer;
      }
    }
  }
}
</style>
