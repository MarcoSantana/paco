<template>
  <div class="wrapper">
    <div :id="getFieldID(schema)" :name="schema.inputName" :class="schema.fieldClasses">
      <select
        v-model="college.collegeId"
        v-attributes="'input'"
        class="form-control"
        :disabled="disabled"
        :name="schema.inputName"
        :class="schema.fieldClasses"
      >
        <option v-if="selectOptions && !selectOptions.hideNoneSelectedText" :disabled="schema.required" :value="null">
          {{ selectOptions.noneSelectedText || '&lt;Seleccione una universidad&gt;' }}
        </option>
        <template v-for="item in selectOptions">
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
      <!-- Campus select -->
      <select
        v-if="campi && schema.campus"
        v-model="college.campusId"
        v-attributes="'input'"
        class="form-control"
        name="campi"
      >
        <option v-if="selectOptions && !selectOptions.hideNoneSelectedText" :disabled="schema.required" :value="null">
          {{ selectOptions.noneSelectedText || '&lt;Seleccione un campus&gt;' }}
        </option>
        <template v-for="item in campi">
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
      <!-- / Campus select -->
    </div>
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
      // collegeId: null,
      // campusId: null,
      college: { collegeId: null, campusId: null },
    }
  },
  computed: {
    ...mapState('colleges', ['colleges', 'campi']),
    ...mapState('products', ['products']),
    ...mapState('app', ['networkOnLine']),
    selectOptions() {
      return this.schema.selectOptions || this.colleges
    },
  },
  watch: {
    college: {
      handler(newVal) {
        this.value = newVal
        this.$store.dispatch('colleges/getCollegeCampi', this.college.collegeId)
      },
      deep: true,
    },
    value() {
      this.$store.dispatch('colleges/getCollegeCampi', this.value.collegeId)
    },
  },
  mounted() {
    // Popullate colleges
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
    // Refactor value to college
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
