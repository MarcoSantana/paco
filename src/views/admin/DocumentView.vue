<template>
  <div class="container">
    <button class="btn" @click="$router.go(-1)">Volver</button>
    <component :is="components[document.name]" :document="document"></component>
    <button class="btn" @click="$router.go(-1)">Volver</button>
  </div>
</template>

<script>
import * as components from '@/components/admin/componentsList.json'
import CertificationRequest from '@/components/admin/CertificationRequest'

console.log('components :>> ', components.default['Solicitud de certificación'])
export default {
  components: { CertificationRequest },
  props: { document: Object },
  data() {
    return {
      components: components.default,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/style';
@import '@/theme/variables.scss';

.container {
  padding: 0.75rem;
}

.btn {
  @extend .button !optional;
  background-color: $main;
  color: $light-accent;
  font-size: 0.75rem;
  padding: 0.35rem;
  border-radius: 5px;
  // background-color: transparent;
  border: none;
  :hover {
    background-color: $main;
    color: whitesmoke;
    opacity: 0.7;
    cursor: pointer;
    // border-radius: 2px;
    // border-style: dotted;
  }
}
</style>
