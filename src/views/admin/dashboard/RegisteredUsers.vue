<template>
  <v-card class="d-flex flex-column" max-width="400" height="400">
    <v-card-title>
      <v-icon large left>
        mdi-file-multiple
      </v-icon>
      <span class="text-h6 font-weight-light">Usuarios registrados</span>
    </v-card-title>
    <v-spacer></v-spacer>
    <v-card-text class="text-h5 font-weight-bold" style="height: 200;">
      <p class="text-h1 text-center">{{ registeredUsers.count }}</p>
      <p class="caption text-center">Ultima actualizacion {{ registeredUsers.updateTimestamp | intlDate }}</p>
    </v-card-text>
    <v-spacer></v-spacer>
    <v-card-actions>
      <v-list-item class="grow" to="/users">
        <v-list-item-content>
          <v-list-item-title>Ver detalle</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>
<script>
import CountersDB from '@/firebase/counters-db'
import intlDate from '@/filters/intlDate'

export default {
  data: () => ({}),
  filters:{intlDate},
  asyncComputed: {
    async registeredUsers() {
      // return async () => new CountersDB().readAll()
      const [counter] = await new CountersDB().readAll()
      console.log('counter', counter.count)
      return counter
    },
  },
}
</script>
