<template>
  <v-container>
    <validation-provider v-slot="{ errors, required }" :rules="rules">
      <span id="registration-license-span" :class="{ error: errors[0] }">
        <v-text-field
          :id="`userEdit-${name}`"
          v-model="model[name]"
          :append-icon="required ? 'mdi-star' : ''"
          :disabled="disabled"
          :hint="$t(`userEdit.${name}.hint`)"
          :label="$t(`userEdit.${name}.label`)"
          :name="name"
          :placeholder="$t(`userEdit.${name}.placeholder`)"
          :prepend-inner-icon="$t(`userEdit.${name}.icon`)"
          autocomplete="off"
          class="my-1"
          clearable
          counter
          data-test="`userEdit-field-${name}`"
          :type="type"
        />
      </span>
      <span class="error--text error lighten-4">{{ errors[0] }}</span>
    </validation-provider>
  </v-container>
</template>
<script src="./userField.comp.js"></script>
