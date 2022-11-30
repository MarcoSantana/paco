<script>
import { abstractField } from 'vue-form-generator'
export default {
  name: 'FieldPreviousExam',
  mixins: [abstractField],
  data() {
    return {
      switch1: false,
    }
  }, // data
  computed: {
    selection() {
      return this.switch1 ? 'Si' : 'No'
    },
  }, // computed
  methods: {
    onChange() {
      this.$emit('input', this.switch1)
    }, // onchange
  }, // methods
}
</script>
<template>
  <v-container>
    <v-switch v-model="switch1" @change="onChange" />
    Respuesta: {{ selection }}
  </v-container>
</template>
