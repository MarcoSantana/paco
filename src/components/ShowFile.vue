<template
  ><v-container>
    <v-card v-for="file in files" :key="file" class="mx-auto mt-5" max-width="500">
      {{ file }}
      <img src="file" alt="" />
    </v-card>
  </v-container>
</template>
<script>
export default {
  props: { files: { type: Object, required: true } },
  methods: {},
}
</script>
