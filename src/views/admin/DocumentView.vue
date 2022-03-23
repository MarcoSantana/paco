<template>
  <div class="container">
    <v-card>
      <v-card-title>{{ document.name }}</v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item>{{ $t('userName') | capitalize }}: {{ document.userName }}</v-list-item>
          <v-list-item>
            {{ $t('createTimestamp') | capitalize }}: {{ document.createTimestamp | removeTime }}
          </v-list-item>
          <v-list-item>
            {{ $t('status') | capitalize }}: {{ $t('document.statusKey')[document.status] | capitalize }}
          </v-list-item>
          <v-list-item v-show="document.message">{{ $t('message') | capitalize }}: {{ document.message }}</v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <v-card>
      <component :is="components[document.name.replaceAll(' 2022', '')]" :document="document"></component>
    </v-card>
  </div>
</template>

<script>
import * as components from '@/components/admin/componentsList.json'
import CertificationRequest from '@/components/admin/CertificationRequest'
import capitalize from '@/filters/capitalize'
import removeTime from '@/filters/removeTime'

console.log('components :>> ', components.default['Solicitud de certificación'])
export default {
  components: { CertificationRequest },
  filters: { capitalize, removeTime },
  props: { document: Object },
  data() {
    return {
      components: components.default,
    }
  },
  mounted() {
    console.log(this.document)
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
