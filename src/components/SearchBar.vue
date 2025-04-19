<template>
  <div class="search-bar">
    <div class="search-inputs">
      <select v-model="selectedField" class="field-select">
        <option value="">All Fields</option>
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
      <button @click="$emit('search')" class="search-button">
        <i class="fas fa-search"></i>
      </button>
    </div>
  </div>
</template>

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

<style scoped>
.search-inputs {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
}

.field-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-button {
  padding: 8px 16px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background: #1976d2;
}
</style>
