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
      shape="tab"
      step-size="xs"
      color="#2596c7"
      error-color="#e74c3c"
      title="Solicitud de certificación"
      subtitle="Pasos de solicitud"
      finish-button-text="Terminado"
      @on-complete="onComplete"
      @on-loading="setLoading"
      @on-validate="handleValidation"
      @on-error="handleErrorMessage"
    >
      <span v-for="item in groups" :key="item.legend">
        <tab-content :title="item.legend" icon="ti-user">
          <h2>{{ item.legend }}</h2>
          <vue-form-generator
            :schema="item"
            :model="model"
            :options="formOptions"
            @validated="onValidated"
            @model-updated="updateCurrentForm"
          >
          </vue-form-generator>
        </tab-content>
      </span>
      <tab-content title="Siguientes pasos" icon="ti-check"
        >Aquí ponemos los siguientes pasos a para el aspirante</tab-content
      >
      <div v-if="loadingWizard" class="loader"></div>
      <div v-if="errorMsg">
        <span class="error">{{ errorMsg }}</span>
        <span class="error">{{ errors }}</span>
      </div>
      <button slot="prev" class="form-wizard-button" data-test="document-prev-btn">Atrás</button>
      <button slot="next" class="form-wizard-button" data-test="document-next-btn">Adelante</button>
      <button slot="finish" class="form-wizard-button">Guardar</button>
    </form-wizard>
    <h1>Debug</h1>
    <div>Model>> {{ model }}</div>
    <div>State {{ currentForm }}</div>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'
import { isNil } from 'lodash'
import 'vue-form-generator/dist/vfg'
import cmmuCertificationSchema from '@/components/cmmuCertificationSchema'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default {
  components: { 'form-wizard': FormWizard, 'tab-content': TabContent },
  mixins: [cmmuCertificationSchema],

  data: () => ({
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
    model() {
      console.log('this.model: ', this.model)
    },
  },
  methods: {
    // ...mapMutations('forms', ['setCurrentForm']),
    ...mapActions('forms', ['triggerAddCurrentFormAction']),
    ...mapGetters('forms', ['getCurrentForm']),
    updateCurrentForm() {
      this.triggerAddCurrentFormAction(this.model)
    },
    // form wizard
    onComplete() {
      // eslint-disable-next-line no-alert
      alert('Form wizard ended')
    },
    setLoading(value) {
      this.loadingWizard = value
    },
    handleValidation(isValid, tabIndex) {
      // TODO use this to validate the presence of the actual file and maybe the complete fields
      console.log(`Tab: ${tabIndex} valid: ${isValid}`)
    },
    handleErrorMessage(errorMsg) {
      // TODO Give this better style
      // this.errorMsg = this.model.errors
      this.$store.state.currentForm.errors.push(errorMsg)
    },
    validateAsync() {
      // TODO use this for all tab validations
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (isNil(this.documentType)) {
            this.count += 1
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('Debe elegir un tipo de documento')
          } else {
            this.count = 0
            resolve(true)
          }
        }, 500)
      })
    },
  },
}
</script>
<style lang="scss">
@import '@/theme/style.scss';
@import '@/theme/variables.scss';

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
