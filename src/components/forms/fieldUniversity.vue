<template>
  <div class="wrapper">
    <select
      :id="getFieldID(schema)"
      v-model="value"
      v-attributes="'input'"
      class="form-control"
      :disabled="disabled"
      :name="schema.inputName"
      :class="schema.fieldClasses"
    >
      <option v-if="!selectOptions.hideNoneSelectedText" :disabled="schema.required" :value="null">
        {{ selectOptions.noneSelectedText || '&lt;Seleccione una universidad&gt;' }}
      </option>
      <template v-for="item in colleges">
        <optgroup v-if="item.group" :key="item" :label="getGroupName(item)">
          <span v-if="item.ops">
            <option v-for="i in item.ops" :key="getItemName(i)" :value="getItemValue(i)">{{ getItemName(i) }}</option>
          </span>
        </optgroup>
        <option v-if="!item.group" :key="getItemValue(item)" :value="getItemValue(item)">
          {{ getItemName(item) }}
        </option>
      </template>
    </select>
    <h1>Log</h1>
    <div>Select model {{ value }}</div>
    <h1>TODO</h1>
    <ul>
      <li>Add second dependant list for the campus</li>
    </ul>
  </div>
</template>
<script>
import { isObject, isNil, find } from 'lodash'
import { abstractField } from 'vue-form-generator'
import { mapState } from 'vuex'

export default {
  mixins: [abstractField],
  data() {
    return {
      // items: ['item1', 'item2'],
    }
  },
  computed: {
    ...mapState('colleges', ['colleges']),
    ...mapState('products', ['products']),
    ...mapState('app', ['networkOnLine']),
    selectOptions() {
      return this.schema.selectOptions || this.colleges
    },
    // items() {
    //   // const { values } = this.schema
    //   const { items } = this
    //   if (typeof items === 'function') {
    //     return this.groupValues(values.apply(this, [this.model, this.schema]))
    //   }
    //   return this.groupValues(values)
    // },
  },
  mounted() {
    this.$store.dispatch('colleges/getColleges', null, { root: true })
  },
  methods: {
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
</style>