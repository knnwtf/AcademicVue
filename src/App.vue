<script>
import { reactive, computed } from 'vue'
import Container from './components/Container.vue'
import Tabs from './components/Tabs.vue'
import SearchBar from './components/SearchBar.vue'
import Table from './components/Table.vue'
import FormModal from './components/FormModal.vue'
import DeleteModal from './components/DeleteModal.vue'

export default {
  components: {
    Container,
    Tabs,
    SearchBar,
    Table,
    FormModal,
    DeleteModal,
  },

  setup() {
    const state = reactive({
      activeTab: 'students',
      students: [
        { id: 1, name: 'John Doe', class: '10A', dob: '2005-05-15' },
        { id: 2, name: 'Jane Smith', class: '10B', dob: '2005-06-20' },
      ],
      subjects: [
        { id: 1, name: 'Mathematics', credits: 3 },
        { id: 2, name: 'Physics', credits: 4 },
      ],
      scores: [{ id: 1, studentId: 1, subjectId: 1, score: 85, date: '2023-01-15' }],
      currentItem: null,
      showFormModal: false,
      showDeleteModal: false,
      formMode: 'add',
      searchQuery: '',
      searchField: '',
    })

    const studentHeaders = [
      { label: 'ID', key: 'id', searchable: true },
      { label: 'Name', key: 'name', searchable: true },
      { label: 'Class', key: 'class', searchable: true },
      { label: 'Date of Birth', key: 'dob', searchable: true },
    ]

    const subjectHeaders = [
      { label: 'ID', key: 'id', searchable: true },
      { label: 'Name', key: 'name', searchable: true },
      { label: 'Credits', key: 'credits', searchable: true },
    ]

    const scoreHeaders = [
      { label: 'ID', key: 'id', searchable: true },
      { label: 'Student', key: 'studentId', searchable: true },
      { label: 'Subject', key: 'subjectId', searchable: true },
      { label: 'Score', key: 'score', searchable: true },
      { label: 'Date', key: 'date', searchable: true },
    ]

    const filteredItems = computed(() => {
      const items = currentItems.value
      if (!state.searchQuery) return items

      return items.filter((item) => {
        const field = state.searchField || headers.value[0].key
        return String(item[field]).toLowerCase().includes(state.searchQuery.toLowerCase())
      })
    })

    const headers = computed(() => {
      switch (state.activeTab) {
        case 'students':
          return studentHeaders
        case 'subjects':
          return subjectHeaders
        case 'scores':
          return scoreHeaders
        default:
          return studentHeaders
      }
    })

    const currentItems = computed(() => {
      switch (state.activeTab) {
        case 'students':
          return state.students
        case 'subjects':
          return state.subjects
        case 'scores':
          return state.scores
        default:
          return []
      }
    })

    const handleAdd = () => {
      state.formMode = 'add'
      state.currentItem = null
      state.showFormModal = true
    }

    const handleEdit = (item) => {
      state.formMode = 'edit'
      state.currentItem = { ...item }
      state.showFormModal = true
    }

    const handleDelete = (item) => {
      state.currentItem = item
      state.showDeleteModal = true
    }

    const saveItem = (formData) => {
      if (state.formMode === 'add') {
        formData.id = currentItems.value.length + 1
        currentItems.value.push(formData)
      } else {
        const index = currentItems.value.findIndex((i) => i.id === state.currentItem.id)
        if (index !== -1) {
          currentItems.value.splice(index, 1, formData)
        }
      }
      state.showFormModal = false
    }

    const confirmDelete = () => {
      const index = currentItems.value.findIndex((i) => i.id === state.currentItem.id)
      if (index !== -1) {
        currentItems.value.splice(index, 1)
      }
      state.showDeleteModal = false
    }

    return {
      state,
      headers,
      filteredItems,
      handleAdd,
      handleEdit,
      handleDelete,
      saveItem,
      confirmDelete,
    }
  },
}
</script>

<template>
  <Container>
    <Tabs
      :tabs="[
        { label: 'Students', value: 'students' },
        { label: 'Subjects', value: 'subjects' },
        { label: 'Scores', value: 'scores' },
      ]"
      :activeTab="state.activeTab"
      @update:activeTab="state.activeTab = $event"
    >
      <template #students>
        <SearchBar
          :placeholder="'Search students...'"
          v-model="state.searchQuery"
          :searchable-fields="headers.filter((h) => h.searchable)"
          @field-change="state.searchField = $event"
        />
        <Table
          :headers="headers"
          :items="filteredItems"
          @add="handleAdd"
          @edit="handleEdit"
          @delete="handleDelete"
        >
          <template #cell-dob="{ item }">
            {{ new Date(item.dob).toLocaleDateString() }}
          </template>
          <template #actions="{ item }">
            <button class="btn-icon" @click="handleEdit(item)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon btn-danger" @click="handleDelete(item)">
              <i class="fas fa-trash"></i>
            </button>
          </template>
        </Table>
      </template>

      <!-- tao chua add subjects voi scores -->
    </Tabs>

    <FormModal
      :show="state.showFormModal"
      :fields="headers"
      :initial-data="state.currentItem"
      :mode="state.formMode"
      :title="state.activeTab.charAt(0).toUpperCase() + state.activeTab.slice(1)"
      @close="state.showFormModal = false"
      @submit="saveItem"
    />

    <DeleteModal
      :show="state.showDeleteModal"
      @confirm="confirmDelete"
      @cancel="state.showDeleteModal = false"
    />
  </Container>
</template>

<style>
.btn-icon {
  padding: 8px;
  margin: 0 4px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-icon:hover {
  transform: scale(1.1);
}
</style>
