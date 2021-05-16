<template>
  <div class="wrapper">
    <div class="document-container">
      Here be the date picker
    </div>
  </div>
</template>
<script>
import { abstractField } from 'vue-form-generator'

export default {
  name: 'FieldDate',
  components: {},
  mixins: [abstractField],
  data() {
    return {
      show: true,
    }
  },
  computed: {
    // TODO  investigate what is this for
    wrappedValue: {
      get() {
        if (this.value && this.value.indexOf('data') === 0) return '<inline base64 pdf>'
        return this.value
      },
      set(newValue) {
        if (newValue && newValue.indexOf('http') === 0) {
          this.value = newValue
        }
      },
    },
  },
  watch: {
    model() {
      const el = this.$el.querySelector('input.file')
      if (el) {
        el.value = ''
      }
    },
  },
  methods: {
    //    remove() {
    //      this.value = ''
    //    },
  },
}
</script>

<style lang="scss">
@import '@/theme/style.scss';
@import '@/theme/variables.scss';
.wrapper {
  // width: 100%;
  // height: auto;
}

.preview {
  position: relative;
  margin-top: 1.5rem;
  // height: 100px;
  height: auto;
  // background-repeat: no-repeat;
  // background-size: contain;
  // background-position: center center;
  // border: 1px solid #ccc;
  // border-radius: 3px;
  // box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  .remove {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXUlEQVR42u2SwQoAIAhD88vVLy8KBlaS0i1oJwP3piGVg0Skmpq8HjqZrWl9uwCbGAmwKYGZs/6iqgMyAdJuM8W2QmYKpLt/0AG9ASCv/oAnANd3AEjmAlFT1BypAV+PnRH5YehvAAAAAElFTkSuQmCC');
    background-repeat: no-repeat;
    width: 16px;
    height: 16px;
    font-size: 1.2em;
    position: absolute;
    right: 0.2em;
    bottom: 0.2em;
    opacity: 0.6;
    border-radius: 25%;
    opacity: 80%;
    &:hover {
      opacity: 1;
      cursor: pointer;
    }
  }
}
.document-container {
  border: 0;
  // width: auto;
  // height: auto;
  & span {
    border: 1px dashed $light-accent;
  }
  @include respond(tablet) {
    // responsive code for tablet viewport i.e. 600px
    max-height: 50px;
    width: 100%;
  }

  @include respond(mobile) {
    // responsive code for mobile viewport i.e. 480px
    font-size: 0.8rem;
    max-height: 50px;
  }
}
.vue-form-generator .field-image {
  .wrapper {
    width: 100%;
  }
  .preview {
    position: relative;
    margin-top: 5px;
    height: 100px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    .remove {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXUlEQVR42u2SwQoAIAhD88vVLy8KBlaS0i1oJwP3piGVg0Skmpq8HjqZrWl9uwCbGAmwKYGZs/6iqgMyAdJuM8W2QmYKpLt/0AG9ASCv/oAnANd3AEjmAlFT1BypAV+PnRH5YehvAAAAAElFTkSuQmCC');
      width: 16px;
      height: 16px;
      font-size: 1.2em;
      position: absolute;
      right: 0.2em;
      bottom: 0.2em;
      opacity: 0.7;
      &:hover {
        opacity: 1;
        cursor: pointer;
      }
    }
  }
}
</style>
