<template>
  <div class="wrapper">
    <div v-if="value">
      <div v-if="fileType == 'pdf'">
        <input
          v-if="fileType == 'pdf'"
          v-model.number="page"
          type="number"
          style="width: 5em"
          :max="numPages"
          min="1"
        />
        /{{ numPages }}
        <div
          v-if="loadedRatio > 0 && loadedRatio < 1"
          style="background-color: green; color: white; text-align: center"
          :style="{ width: loadedRatio * 100 + '%' }"
        >
          {{ Math.floor(loadedRatio * 100) }}%
        </div>
      </div>
      <div style="width: 50%">
        <pdf
          ref="myPdf"
          :src="value"
          :page="page"
          @progress="loadedRatio = $event"
          @error="error"
          @num-pages="numPages = $event"
          @link-clicked="page = $event"
        ></pdf>
        <div class="preview">
          <img v-if="fileType == 'jpeg' || fileType == 'png'" class="" :src="value" alt="" />
          <div class="remove" title="Remover" @click="remove"></div>
        </div>
      </div>
    </div>
    <input
      v-if="!value"
      type="button"
      class="file-button"
      onclick="document.getElementById('getFile').click()"
      value="Cargar documento"
    />
    <input
      id="getFile"
      class="file"
      accept="image/png, image/jpeg, .pdf"
      :disabled="disabled"
      :name="schema.inputName"
      type="file"
      style="display:none"
      @change="fileChanged"
    />
  </div>
</template>
<script>
import { abstractField } from 'vue-form-generator'
import pdf from 'vue-pdf'

export default {
  // TODO change name to DocumentField 202105.15-18.03
  name: 'FieldPdf',
  components: {
    pdf,
  },
  mixins: [abstractField],
  data() {
    return {
      show: true,
      currentPage: 0,
      pageCount: 0,
      rotate: 0,
      page: 1,
      numPages: 0,
      loadedRatio: 0,
      mimeType: null,
    }
  },
  computed: {
    previewStyle() {
      if (this.schema.preview !== false) {
        return {
          display: 'block',
          'background-image': this.value != null ? `url(${this.value})` : 'none',
        }
      }
      return {
        display: 'none',
      }
    },
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
    fileType() {
      const myRe = /data:(\w+)\/(\w+)/g
      const myArray = myRe.exec(this.value)
      console.log('myArray :>> ', myArray)
      return myArray[2]
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
  mounted() {
    console.log('this.$refs :>> ', this.$refs)
    console.log('this.$refs.foo :>> ', this.$refs.foo)
  },
  methods: {
    remove() {
      this.value = ''
    },
    error(e) {
      console.log('error :>> ', e)
    },
    fileChanged(event) {
      // TODO Add schema option to enforce only pdf  202105.15-16.59
      const reader = new FileReader()
      reader.onload = e => {
        this.value = e.target.result
        console.log('this.value :>> ', this.value)
      }
      if (event.target.files && event.target.files.length > 0) {
        reader.readAsDataURL(event.target.files[0])
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/theme/style.scss';
@import '@/theme/variables.scss';
.wrapper {
  width: 100%;
  height: auto;
}

.preview {
  position: relative;
  margin-top: 1.5rem;
  // height: 100px;
  height: auto;
  background-repeat: no-repeat;
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
  img {
    width: 250px;
    height: auto;
    margin-bottom: 1.5rem;
  }
}
.document-container {
  border: 0;
  // width: auto;
  // height: auto;
  max-height: 200px;
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
    max-height: 25%;
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
.file-button {
  @extend .form-wizard-button;
  width: 100%;
}
</style>
