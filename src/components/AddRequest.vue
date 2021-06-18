<template>
  <div class="box">
    <vue-form-generator :schema="schema" :model="model" :options="formOptions"> </vue-form-generator>
  </div>
</template>
<script>
import 'vue-form-generator/dist/vfg'
import cmmuCertificationSchema from '@/components/cmmuCertificationSchema'

export default {
  components: {},
  mixins: [cmmuCertificationSchema],
  data: () => ({
    formOptions: {
      validateAfterLoad: true,
      validateAfterChanged: true,
      validateAsync: true,
    },
    model: {},
  }),
  mounted() {},
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
