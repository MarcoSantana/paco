<template>
  <v-container>
    <users-data-table />
  </v-container>
</template>
<script>
import UsersDataTable from '@/components/admin/UsersDataTable'

export default {
  name: 'UsersMain',
  components: { UsersDataTable }
}
</script>

