<template>
  <div>
    <modal :name="src" :width="'80%'" :height="'auto'" :resizable="true" :scrollable="true">
      <button class="delete-btn" @click="hide()">
        <i class="mdi mdi-close-box"></i>
      </button>
      <div
        v-if="src && (metadata.contentType == 'image/png' || metadata.contentType == 'image/jpeg')"
        class="image-container"
      >
        <img style="max-heigth: 800px;" :src="src" />
      </div>
      <div v-if="src && metadata.contentType == 'application/pdf'" class="pdf-container">
        <pdf :src="src"></pdf>
      </div>
    </modal>
    <div class="">
      <div
        v-if="src && (metadata.contentType == 'image/png' || metadata.contentType == 'image/jpeg')"
        class="image-container"
        @click="show()"
      >
        <img :src="src" />
      </div>
      <div v-if="src && metadata.contentType == 'application/pdf'" class="pdf-container" @click="show()">
        <pdf :src="src"></pdf>
      </div>
    </div>
    <div v-if="!src">
      <h3 class="error">Documento Faltante</h3>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  components: { pdf },
  props: {
    url: String,
    type: Object,
    resizableModal: Boolean,
    scrollableModal: Boolean,
  },
  data() {
    return {}
  },
  mount() {},
  computed: {
    src() {
      return this.$props.url
    },
    metadata() {
      return this.$props.type.i
    },
  },
  mounted() {},
  methods: {
    show() {
      this.$modal.show(this.src)
    },
    hide() {
      this.$modal.hide(this.src)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/style.scss';
@import '@/theme/variables.scss';

.image-container {
  width: 100%;
  max-width: 800px;
  margin: 2rem;
  border: $light-accent;
  border-style: double;
  img {
    width: 100%;
  }
}

.pdf-container {
  @extend .image-container;
  border: $vue-color;
}
</style>
