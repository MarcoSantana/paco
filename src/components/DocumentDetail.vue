<template>
  <div class="document-detail">
    <h1>{{ document.name }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    document: Object,
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.document-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
