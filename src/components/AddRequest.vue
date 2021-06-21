<template>
  <div class="box">
    <vue-form-generator
      :schema="schema"
      :model="model"
      :options="formOptions"
      @validated="onValidated"
      @submited="alert('meh')"
    >
    </vue-form-generator>
    <button id="show-modal" @click="showModal = true">Show Modal</button>
    <!-- use the modal component, pass in the prop -->
    <error-modal v-if="showModal" @close="showModal = false">
      create method to display this modal when validated is triggered
      <!--
      you can use custom content here to overwrite
      default content
    -->
      <h3 slot="header">custom header</h3>
    </error-modal>
  </div>
</template>
<script>
import 'vue-form-generator/dist/vfg'
import cmmuCertificationSchema from '@/components/cmmuCertificationSchema'
import ErrorModal from '@/components/forms/ErrorModal.vue'

export default {
  components: { ErrorModal },
  mixins: [cmmuCertificationSchema],
  data: () => ({
    showModal: false,
    formOptions: {
      validateAfterLoad: true,
      validateAfterChanged: true,
      validateAsync: true,
      validateBeforeSubmit: true,
    },
    model: {},
  }),
  mounted() {},
  methods: {
    displayValidationErrors() {
      this.showModal = true
    },

    onSubmit(foo) {
      console.log('foo :>> ', foo)
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
