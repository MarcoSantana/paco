<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="6">
        <v-file-input v-model="imgValue" accept="image/*" label="Archivo (formato PNG ó JPEG)" dense show-size />
      </v-col>
      <v-col sm="12" md="6">
        <v-img max-height="300" max-width="200" :src="url" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { isNil } from 'lodash'

export default {
  data() {
    return {
      imgValue: null,
    }
  },
  computed: {
    url() {
      return isNil(this.imgValue) ? null : URL.createObjectURL(this.imgValue)
    },
  },
  mounted() {},
  methods: {},
}
</script>
