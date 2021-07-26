<template>
  <div class="wrapper">
    <template v-if="refreshingApp">
      Cargando nuevo contenido...
    </template>
    <template v-else>
      Nuevo contenido disponible por favor
      <span class="refresh-btn" @click="$emit('refresh')">REFRESQUE</span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    refreshingApp: Boolean,
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 80vw;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  display: inline-block;
  border-radius: 5px;

  .refresh-btn {
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
