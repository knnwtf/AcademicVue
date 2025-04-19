<template>
  <div class="tabs-container">
    <div class="tabs-header">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tab', { active: activeTab === tab.value }]"
        @click="$emit('update:activeTab', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tab-content">
      <slot :name="activeTab"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: Array,
    activeTab: String,
  },
  emits: ['update:activeTab'],
}
</script>

<style scoped>
.tabs-header {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}

.tab {
  padding: 15px 30px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
  font-size: 16px;
  font-weight: bold;
}

.tab.active {
  color: #2196f3;
  border-bottom: 3px solid #2196f3;
}

.tab-content {
  padding: 1rem 0;
}
</style>
