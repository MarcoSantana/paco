<template>
  <div class="document-detail">
    <h1>{{ document.name }}</h1>
    <div>{{ document.data }}</div>
    <div>
      <!-- <img width="500px" :src="document.data.avatar" alt="" /> -->
    </div>
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
