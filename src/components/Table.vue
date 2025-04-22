<script>
export default {
  props: {
    headers: {
      type: Array,
      required: true,
      validator: (value) => value.every((h) => 'label' in h && 'key' in h),
    },
    items: {
      type: Array,
      required: true,
    },
    showAddRow: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    hasActions() {
      return !!this.$slots.actions
    },
  },
}
</script>

<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">
            {{ header.label }}
          </th>
          <th v-if="hasActions" class="actions-cell">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="showAddRow" class="add-row" @click="$emit('add')">
          <td :colspan="headers.length + (hasActions ? 1 : 0)">
            <slot name="add-row">Add...</slot>
          </td>
        </tr>
        <tr v-for="(item, index) in items" :key="item.id || index">
          <td v-for="(header, hIndex) in headers" :key="hIndex">
            <slot :name="`cell-${header.key}`" :item="item">
              {{ item[header.key] }}
            </slot>
          </td>
          <td v-if="hasActions" class="actions-cell">
            <slot name="actions" :item="item">
              <button @click="$emit('edit', item)">Edit</button>
              <button @click="$emit('delete', item)">Delete</button>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: whitesmoke;
  font-weight: bold;
}

tr.add-row {
  background-color: white;
  cursor: pointer;
  text-align: center;
  font-size: 15px;
  font-style: italic;
}

tr.add-row:hover {
  background-color: whitesmoke;
}

button {
  padding: 6px 12px;
  margin: 2px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #e9ecef;
}

button:hover {
  background-color: #dee2e6;
}

th.actions-cell,
td.actions-cell {
  width: 100px;
  text-align: center;
}
</style>
