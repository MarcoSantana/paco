<template>
  <v-container>
    {{ user }}
  </v-container>
</template>
<script>
// @ts-check
export default {
  name: 'UserCrud',
  props: {
    /** @type {import('vue').PropOptions<{name: string, id: string}>} */
    user: {
      type: Object,
      required: true,
    },
  },
}
</script>
