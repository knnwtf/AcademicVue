<script>
export default {
  props: {
    modelValue: String,
    placeholder: String,
    searchableFields: Array,
  },
  emits: ['update:modelValue', 'search'],
  data() {
    return {
      selectedField: '',
      searchQuery: this.modelValue,
    }
  },
  watch: {
    selectedField(newVal) {
      this.$emit('field-change', newVal)
    },
  },
}
</script>

<template>
  <div class="search-bar">
    <div class="search-inputs">
      <select v-model="selectedField" class="field-select">
        <option value="">Any</option>
        <option v-for="field in searchableFields" :key="field.key" :value="field.key">
          {{ field.label }}
        </option>
      </select>
      <input
        type="text"
        :placeholder="placeholder"
        v-model="searchQuery"
        @input="$emit('update:modelValue', searchQuery)"
      />
    </div>
  </div>
</template>

<style scoped>
.search-inputs {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
}

.field-select {
  padding: 8px;
  border-radius: 4px;
  background: white;
}

input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 4px;
}
</style>
