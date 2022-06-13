<template>
  <v-sheet>
    <v-text-field
      label="Comentario(opcional)"
      :placeholder="placeholder"
      outlined
      @input="input"
    ></v-text-field>
  </v-sheet>
</template>

<script>
// import { VTextField } from 'vuetify/lib'

export default {
  name: 'CommentField',
  // components: { VTextField },
  props: {
    placeholder: {
      type: String,
      default: 'Comentario',
    },
    name: {
      type: String,
      required: true,
    },
  },
  methods: {
    input(e) {
      this.$emit('input', e)
    },
  },
}
</script>

<style></style>
