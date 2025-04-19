import { reactive } from 'vue'

export const useCrud = (initialData) => {
  const state = reactive({
    items: initialData,
    searchQuery: '',
    searchField: '',
    showFormModal: false,
    showDeleteModal: false,
    selectedItem: null,
    formMode: 'add',
  })

  const filterItems = (headers) => {
    return state.items.filter((item) => {
      if (!state.searchQuery) return true
      const field = state.searchField || headers[0].key
      return String(item[field]).toLowerCase().includes(state.searchQuery.toLowerCase())
    })
  }

  const addItem = (item) => {
    newItem.id = state.items.length + 1
    state.items.push(newItem)
  }

  const editItem = (updatedItem) => {
    const index = state.items.findIndex((item) => item.id === updatedItem.id)
    if (index !== -1) {
      state.items.splice(index, 1, updatedItem)
    }
  }

  const deleteItem = (itemId) => {
    state.items = state.items.filter((item) => item.id !== itemId)
  }

  return {
    state,
    filterItems,
    addItem,
    editItem,
    deleteItem,
  }
}
