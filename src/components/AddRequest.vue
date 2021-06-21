<template>
  <div class="box">
    <vue-form-generator :schema="schema" :model="model" :options="formOptions" @validated="onValidated">
    </vue-form-generator>

    <button id="show-modal" @click="showModal = true">Show Modal</button>
    <!-- use the modal component, pass in the prop -->
  </div>
</template>
<script>
import 'vue-form-generator/dist/vfg'
import cmmuCertificationSchema from '@/components/cmmuCertificationSchema'

export default {
  mixins: [cmmuCertificationSchema],
  data: () => ({
    modalErrors: null,
    formOptions: {
      validateAfterLoad: false,
      validateAfterChanged: true,
      validateAsync: false,
      validateBeforeSubmit: true,
    },
    model: {},
  }),
  watch: {},
  mounted() {},
  methods: {
    displayValidationErrors() {},

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
