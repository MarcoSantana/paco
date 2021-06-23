<template>
  <div class="box">
    <h1>TODO</h1>
    <ul>
      <li>Add wizard</li>
      <li>Add vuex for the current form</li>
    </ul>
    <h1>Debug</h1>
    <div>Model>> {{ model }}</div>
    <div>State {{ currentForm }}</div>

    <!-- :value="productNameToCreate"
         @input="setProductNameToCreate($event.target.value)" -->

    <vue-form-generator
      :schema="schema"
      :model="model"
      :options="formOptions"
      @validated="onValidated"
      @model-updated="updateCurrentForm"
    >
    </vue-form-generator>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'
import 'vue-form-generator/dist/vfg'
import cmmuCertificationSchema from '@/components/cmmuCertificationSchema'

export default {
  mixins: [cmmuCertificationSchema],

  data: () => ({
    formOptions: {
      validateAfterLoad: false,
      validateAfterChanged: true,
      validateAsync: false,
      validateBeforeSubmit: true,
    },
    model: {},
  }),
  // computed: mapState('forms', ['formNameToCreate', 'formCreationPending']),
  // computed: mapState('forms', ['currentForm']),
  computed: {
    ...mapState('forms', ['currentForm']),
    // currentForm: {
    //   get() {
    //     return this.getCurrentForm()
    //   },
    //   set(value) {
    //     // this.state.forms.currentForm = value
    //     console.log('value :>> ', value);
    //   },
    // },
  },
  watch: {
    model() {
      console.log('this.model: ', this.model) // this.setCurrentForm(this.model)
      // this.setCurrentForm(this.model.request)
      // this.setCurrentForm([newVal])
    },
  },
  methods: {
    // ...mapMutations('forms', ['setCurrentForm']),
    ...mapActions('forms', ['triggerAddCurrentFormAction']),
    ...mapGetters('forms', ['getCurrentForm']),
    updateCurrentForm() {
      // this.currentForm = this.model
      this.triggerAddCurrentFormAction(this.model)
      // console.log('this.model :>> ', this.model)
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
  legend {
    font-size: 1.5rem;
    color: $main;
    padding-bottom: 0.75rem;
  }
}
</style>
