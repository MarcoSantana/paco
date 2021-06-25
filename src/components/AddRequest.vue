<template>
  <div class="box">
    <h1>TODO</h1>
    <ul>
      <li>Bind wizard errors to vfg errors</li>
      <li>check loading animation (wizard)</li>
      <li>change tab color acording to validation results</li>
      <li>Add proper style to item legend title</li>
    </ul>
    <form-wizard
      ref="wizard"
      shape="tab"
      step-size="xs"
      color="#2596c7"
      error-color="#e74c3c"
      title="Solicitud de certificación"
      subtitle="Pasos de solicitud"
      finish-button-text="Terminado"
      @on-complete="onComplete"
    >
      current step>> {{ currentStep }}
      <tab-content v-for="item in groups" :key="item.legend" :before-change="validateAsync" :title="item.legend">
        <vue-form-generator
          :ref="getAttrs(item.fields)"
          :schema="item"
          :model="model"
          :options="formOptions"
          @validated="onValidated"
          @model-updated="updateCurrentForm"
        >
        </vue-form-generator>
      </tab-content>
      <tab-content title="Siguientes pasos">
        Aquí ponemos los siguientes pasos a para el aspirante
      </tab-content>
      <div v-if="loadingWizard" class="loader"></div>
      {{ errorMsg }}
      <span slot="prev"></span>
      <button
        class="reset-button"
        @click="
          model = {}
          $refs.wizard.reset()
        "
      >
        Borrar formulario
      </button>
      <button slot="next" class="form-wizard-button" data-test="document-next-btn">
        Adelante
      </button>
      <button slot="finish" class="form-wizard-button">Guardar</button>
    </form-wizard>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'
import { get, isEmpty, isNil } from 'lodash'
import 'vue-form-generator/dist/vfg'
import cmmuCertificationSchema from '@/components/cmmuCertificationSchema'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default {
  components: { 'form-wizard': FormWizard, 'tab-content': TabContent },
  mixins: [cmmuCertificationSchema],

  data: () => ({
    currentIsValid: false,
    currentStep: null,
    steps: [],
    formOptions: {
      validateAfterLoad: false,
      validateAfterChanged: true,
      validateAsync: false,
      validateBeforeSubmit: true,
    },
    model: {},
    // wizard
    loadingWizard: false,
    errorMsg: null,
  }),
  computed: {
    ...mapState('forms', ['currentForm']),
    groups() {
      return this.schema.groups
    },
  },
  watch: {
    model() {},
  },
  methods: {
    // ...mapMutations('forms', ['setCurrentForm']),
    ...mapActions('forms', ['triggerAddCurrentFormAction']),
    ...mapGetters('forms', ['getCurrentForm']),
    getAttrs(vnode) {
      return get(vnode[0], 'attributes.input.data-test', {})
    },
    updateCurrentForm() {
      this.triggerAddCurrentFormAction(this.model)
    },
    // vfg
    onValidated(isValid, errors) {
      this.errorMsg = errors
      this.currentIsValid = isValid
    },
    // form wizard
    onComplete() {
      // eslint-disable-next-line no-alert
      alert('Form wizard ended')
    },
    setLoading(value) {
      this.loadingWizard = value
    },
    handleErrorMessage(errorMsg) {
      if (!isNil(errorMsg) || !isEmpty(errorMsg)) this.errorMsg = errorMsg
      return true
      // TODO Give this better style
      // this.errorMsg = this.model.errors
      // this.$store.state.currentForm.errors.push(errorMsg)
    },
    validateAsync() {
      // TODO use this for all tab validations
      return new Promise((resolve, reject) => {
        this.setLoading(true)
        setTimeout(() => {
          if (!this.currentIsValid) {
            const msg = 'Complete este paso antes de pasar al siguiente'
            this.errorMsg = msg
            reject(new Error(msg))
          } else {
            this.currentIsValid = false
            this.errorMsg = null
            resolve(true)
          }
          this.setLoading(false)
        }, 1000)
      })
    },
  },
}
</script>
<style lang="scss">
@import '@/theme/style.scss';
@import '@/theme/variables.scss';
.reset-button {
  @extend .form-wizard-button;
  background-color: lighten($danger-color, 10%);
  // color: $danger-color;
}

fieldset {
  margin-top: 1.75rem;
  border: none;
  h1 {
    color: $main;
  }
  legend {
    font-size: 1.5rem;
    color: $main;
    padding-bottom: 0.75rem;
  }
}
/* form wizard */
.loader,
.loader:after {
  border-radius: 75%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(255, 255, 255, 0.2);
  border-right: 1.1em solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
  border-left: 1.1em solid $secondary;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

fieldset {
  border-style: dotted;
  border-color: $light-accent;
}
.field-wrap {
  color: red;
}

.file-upload {
  :hover {
    background: $light-accent;
  }

  label {
    opacity: 0.8; // This makes visible the label wich is behind
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: $light-accent-1;
    color: $main;
    min-height: 80px; /* minimum height */
    cursor: pointer;
    position: relative;
    cursor: pointer;
    font-size: 1.2em;
    display: grid;
    place-items: center;
    margin-top: 3.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    & span {
      margin-left: 1rem;
      margin-right: 1rem;
    }

    @include respond(tablet) {
      // responsive code for tablet viewport i.e. 600px
      max-height: 50px;
      width: 100%;
    }

    @include respond(mobile) {
      // responsive code for mobile viewport i.e. 480px
      font-size: 0.8rem;
    }
  }
}
</style>
