<template>
  <div class="document-action-bar">
    <input
      placeholder="document name..."
      class="document-name-input"
      type="text"
      :value="documentNameToCreate"
      @input="setDocumentNameToCreate($event.target.value)"
      @keypress.enter="triggerAddDocumentAction"
    />
    <div :class="{ disabled: documentCreationPending }" class="create-document-btn" @click="triggerAddDocumentAction">
      add document
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  computed: mapState('documents', ['documentNameToCreate', 'documentCreationPending']),
  methods: {
    ...mapMutations('documents', ['setDocumentNameToCreate']),
    ...mapActions('documents', ['triggerAddDocumentAction']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.document-action-bar {
  display: flex;
  align-items: center;
  justify-content: center;

  .document-name-input {
    padding-left: 5px;
    height: 30px;
    width: 150px;
    outline: none;
    font: inherit;
    border: 1px solid;
    border-color: #2c3e50;
    border-radius: 3px;
  }

  .create-document-btn {
    cursor: pointer;
    padding: 5px 10px;
    border: 1px solid;
    display: inline-block;
    border-radius: 3px;
    margin-left: 10px;
    border-color: #2c3e50;

    &.disabled {
      pointer-events: none;
      background-color: #aaa;
    }

    &:hover {
      color: $vue-color;
      border-color: $vue-color;
    }
  }
}
</style>
