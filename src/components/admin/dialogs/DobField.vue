<template>
  <v-sheet>
    <v-date-picker
      v-if="show"
      v-model="localDOB"
      :rules="rules"
      :label="$t('userData.personalProfile.dob')"
      required
      @change="$emit('setDOB', localDOB)"
    ></v-date-picker>
  </v-sheet>
</template>
<script>
//@ts-check
/**
 *@vue-prop {String} dob - The dob to start with
 *@vue-prop {Boolean} show - Whether to show the field
 *@vue-prop {Array} rules - Validation rules
 *@vue-data {String} dob
 */
export default {
  name: 'DobField',
  props: {
    dob: {
      type: String,
      required: false,
    },
    show: {
      type: Boolean,
      required: false,
      default: true,
    },
    rules: {
      type: Array,
      required: false,
    },
  }, // propsData
  data: () => ({
    localDOB: '',
  }),
}
</script>
