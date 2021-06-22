<template>
  <div class="box">
    <h1>TODO</h1>
    <ul>
      <li>Add wizard</li>
      <li>Add vuex for the current form</li>
    </ul>
    <h1>Debug</h1>
    <div>Model>> {{ model }}</div>
    <vue-form-generator :schema="schema" :model="model" :options="formOptions" @validated="onValidated">
    </vue-form-generator>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { mapMutations, mapState, mapActions } from 'vuex'
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
  watch: {},
  mounted() {},
  methods: {},
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
