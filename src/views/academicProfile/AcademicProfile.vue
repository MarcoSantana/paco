<template>
  <v-container>
    <v-card dark class="accent--text" color="primary">
      <v-card-title>
        <h3>TODO</h3>
        <br />
        <h4>Profile view</h4>
      </v-card-title>
      <ul class="error white--text">
        <li>Get a list of all the info I need</li>
        <li>Create a field for each piece of data you need</li>
        <li>Create a collection in Firebase</li>
      </ul>
    </v-card>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'AcademicProfile',
  data() {
    return {}
  },
  computed: {
    ...mapState('authentication', ['user']),
  },
}
</script>
