<template>
  <div class="page-wrapper">
    <h1 class="curriculum-page-title">Curriculum</h1>
    <add-curriculum></add-curriculum>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
// TODO import the component to show the rendered curriculum or the creation form
import AddCurriculum from '@/components/AddCurriculum'

export default {
  components: { AddCurriculum },
  // TODO components Curriculum form
  computed: {
    // TODO curriculum/userDetails store
    // ...mapGetters('products', ['getProductById']),
    // TODO refactor to get the current user curriculum
    // currentProduct() {
    //   return this.getProductById(this.id)
    // },
  },
}
</script>
<style lang="scss" scoped>
@import '@/theme/variables.scss';

.curriculum-page-title {
  text-align: center;
  margin-bottom: 60px;
}
</style>
