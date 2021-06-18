<template>
  <div class="page-wrapper">
    <h1 class="request-page-title">Solicitud de certificación</h1>
    <add-request></add-request>
  </div>
</template>

<script>
import AddRequest from '@/components/AddRequest.vue'

export default {
  components: { AddRequest },
}
</script>
<style lang="scss" scoped>
@import '@/theme/variables.scss';

.request-page-title {
  text-align: center;
  margin-bottom: 60px;
}
</style>
