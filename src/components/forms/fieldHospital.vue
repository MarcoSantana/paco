<template>
  <div class="wrapper">
    <!-- TODO input field with the attr given by the shcema -->
    <input
      :id="getFieldID(schema)"
      v-model="searchInput"
      v-attributes="'input'"
      type="text"
      class="form-control"
      :name="schema.inputName"
      :required="schema.required"
      :class="schema.fieldClasses"
      placeholder="Escriba el nombre del hospital"
      @input="onChange"
    />
    <div v-show="isOpen" class="results">
      <ul v-show="isOpen" data-test="hospital-list">
        <li v-if="isLoading" class="loading">
          Cargando lista
        </li>
        <li v-for="(item, i) in results" v-else :key="i" class="result" @click="setResult(item)">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { isObject, isNil, find, isFunction } from 'lodash'
import { abstractField } from 'vue-form-generator'
import { mapState } from 'vuex'

export default {
  mixins: [abstractField],
  data() {
    return {
      searchInput: null,
      results: [],
      isOpen: false,
      isLoading: false,
      result: null,
    }
  },
  computed: {
    ...mapState('hospitals', ['hospitals', 'campi']),
    ...mapState('app', ['networkOnLine']),
    selectOptions() {
      return this.schema.selectOptions || this.hospitals
    },
    collegeId() {
      if (!isNil(this.value)) {
        return this.value
      }
      return null
    },
  },
  watch: {
    searchInput(newVal) {
      this.value = newVal
    },
  },
  mounted() {
    // Popullate hospitals
    this.$store.dispatch('hospitals/getHospitals', null, { root: true })
  },
  methods: {
    validate(calledParent) {
      // disabled inputs should always be assumed
      // to be "valid" as they can not be changed
      if (this.disabled) return true

      let isValid = false

      // clear previous errors
      this.clearValidationErrors()

      // BE SURE TO IMPLEMENT THE "required" validation rules
      if (this.schema.required && !this.value) {
        isValid = false
        this.errors.push(this.schema.errorText || 'Este campo es requerido')
      }

      // CUSTOM VALIDATION LOGIC HERE
      // return ['Enter your primary phone number']

      // internal VFG logic for how validation is processed
      // be sure to implement any core VFG logic in this method
      if (isFunction(this.schema.onValidated)) {
        this.schema.onValidated.call(this, this.model, this.errors, this.schema)
      }

      if (!calledParent) this.$emit('validated', isValid, this.errors, this)

      return this.errors
    },
    formatValueToField(value) {
      if (isNil(value)) {
        return null
      }
      return value
    },
    groupValues(values) {
      const array = []
      let arrayElement = {}
      values.forEach(item => {
        arrayElement = null
        if (item.group && isObject(item)) {
          // There is in a group.
          // Find element with this group.
          arrayElement = find(array, i => i.group === item.group)
          if (arrayElement) {
            // There is such a group.
            arrayElement.ops.push({
              id: item.id,
              name: item.name,
            })
          } else {
            // There is not such a group.
            // Initialising.
            arrayElement = {
              group: '',
              ops: [],
            }
            // Set group.
            arrayElement.group = item.group
            // Set Group element.
            arrayElement.ops.push({
              id: item.id,
              name: item.name,
            })
            // Add array.
            array.push(arrayElement)
          }
        } else {
          // There is not in a group.
          array.push(item)
        }
      })
      // With Groups.
      return array
    },
    getGroupName(item) {
      if (item && item.group) {
        return item.group
      }
      throw new Error(
        'Group name is missing! https://icebob.gitbooks.io/vueformgenerator/content/fields/select.html#select-field-with-object-items'
      )
    },
    getItemValue(item) {
      if (isObject(item)) {
        if (
          typeof this.schema.selectOptions !== 'undefined' &&
          typeof this.schema.selectOptions.value !== 'undefined'
        ) {
          return item[this.schema.selectOptions.value]
        }
        // Use 'id' instead of 'value' cause of backward compatibility
        if (typeof item.id !== 'undefined') {
          return item.id
        }
        throw new Error(
          '`id` is not defined. If you want to use another key name, add a `value` property under `selectOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/select.html#select-field-with-object-items'
        )
      } else {
        return item
      }
    },
    getItemName(item) {
      if (isObject(item)) {
        if (typeof this.schema.selectOptions !== 'undefined' && typeof this.schema.selectOptions.name !== 'undefined') {
          return item[this.schema.selectOptions.name]
        }
        if (typeof item.name !== 'undefined') {
          return item.name
        }
        throw new Error(
          '`name` is not defined. If you want to use another key name, add a `name` property under `selectOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/select.html#select-field-with-object-items'
        )
      } else {
        return item
      }
    },
    filterResults() {
      const temp = Object.values(this.hospitals).map(item => item.name)
      this.results = temp.filter(hospital => hospital.toLowerCase().indexOf(this.searchInput.toLowerCase()) > -1)
    },
    // Change the input text to the selected item from the list and close de the list
    setResult(result) {
      this.searchInput = result
      this.isOpen = false
    },
    onChange() {
      // Let's warn the parent that a change was made
      this.$emit('input', this.search)

      // Is the data given by an outside ajax request?
      if (this.isAsync) {
        this.isLoading = true
      } else {
        // Let's search our flat array
        this.filterResults()
        this.isOpen = true
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
}

.results {
  padding: 1.5rem;
  margin-left: 5%;
  margin-right: 5%;
  border: 1px dashed $light-accent;
  max-width: 90%;
  color: $main;

  li:nth-child(even) {
    background-color: lighten($main, 70%);
  }
  li:nth-child(even):hover {
    background-color: $light-accent;
  }
}
.result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}
.result:hover {
  background-color: $light-accent;
  color: $main;
}
</style>
