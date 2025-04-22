<script>
import { reactive, computed, onMounted } from 'vue'
import Container from './components/Container.vue'
import Tabs from './components/Tabs.vue'
import SearchBar from './components/SearchBar.vue'
import Table from './components/Table.vue'
import FormModal from './components/FormModal.vue'
import DeleteModal from './components/DeleteModal.vue'
import studentService from './router/studentService'
import subjectService from './router/subjectService'
import scoreService from './router/scoreService'

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
      students: [],
      subjects: [],
      scores: [],
      currentItem: null,
      showFormModal: false,
      showDeleteModal: false,
      formMode: 'add',
      searchQuery: '',
      searchField: '',
      isLoading: false,
      error: null,
      deleteId: null,
      maxSubjectScores: [],
      averageScore: 0,
      topScores: [],
    })

    const headers = computed(() => {
      switch (state.activeTab) {
        case 'students':
          return [
            { label: 'ID', key: 'student_id', searchable: true, type: 'number' },
            { label: 'Name', key: 'name', searchable: true, required: true },
            { label: 'Class', key: 'class_', searchable: true, required: true },
            {
              label: 'Date of Birth',
              key: 'birthdate',
              searchable: true,
              type: 'date',
              required: true,
            },
          ]

        case 'subjects':
          return [
            { label: 'ID', key: 'subject_id', searchable: true, type: 'number' },
            { label: 'Name', key: 'name', searchable: true, required: true },
            { label: 'Lessons', key: 'amount', searchable: true, type: 'number', required: true },
          ]

        case 'scores':
          return [
            { label: 'ID', key: 'score_id', searchable: true, type: 'number' },
            {
              label: 'Student ID',
              key: 'student_id',
              searchable: true,
              type: 'number',
              required: true,
            },
            {
              label: 'Subject ID',
              key: 'subject_id',
              searchable: true,
              type: 'number',
              required: true,
            },
            { label: 'Score', key: 'score', searchable: true, type: 'number', required: true },
            { label: 'Date', key: 'date', searchable: true, type: 'date', required: true },
          ]

        default:
          return []
      }
    })

    const filteredItems = computed(() => {
      const items = currentItems.value
      if (!state.searchQuery) return items

      return items.filter((item) => {
        const field = state.searchField || headers.value[0].key
        const value = String(item[field]).toLowerCase()
        return value.includes(state.searchQuery.toLowerCase())
      })
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

    const studentNameLookup = computed(() => {
      return state.students.reduce((acc, student) => {
        acc[student.student_id] = student.name
        return acc
      }, {})
    })

    const subjectNameLookup = computed(() => {
      console.log(state.subjects)
      return state.subjects.reduce((acc, subject) => {
        acc[subject.subject_id] = subject.name
        return acc
      }, {})
    })

    const processedMaxSubjectScores = computed(() => {
      return state.maxSubjectScores.map((score) => ({
        ...score,
        student_name: studentNameLookup.value[score.student_id] || 'Unknown Student',
        subject_name: subjectNameLookup.value[score.subject_id] || 'Unknown Subject',
      }))
    })

    const processedTopScores = computed(() => {
      return state.topScores.map((score) => ({
        ...score,
        student_name: studentNameLookup.value[score.student_id] || 'Unknown Student',
        subject_name: subjectNameLookup.value[score.subject_id] || 'Unknown Subject',
      }))
    })

    const studentSubjectBreakdown = computed(() => {
      const breakdown = {}

      state.scores.forEach((score) => {
        const studentId = score.student_id
        const subjectId = score.subject_id

        if (!breakdown[studentId]) {
          breakdown[studentId] = {
            name: studentNameLookup.value[studentId] || `Student ${studentId}`,
            subjects: {},
          }
        }

        if (!breakdown[studentId].subjects[subjectId]) {
          breakdown[studentId].subjects[subjectId] = {
            name: subjectNameLookup.value[subjectId] || `Subject ${subjectId}`,
            scores: [],
            average: 0,
          }
        }

        breakdown[studentId].subjects[subjectId].scores.push(score.score)
      })

      Object.values(breakdown).forEach((student) => {
        Object.values(student.subjects).forEach((subject) => {
          const total = subject.scores.reduce((a, b) => a + b, 0)
          subject.average = total / subject.scores.length
        })
      })

      return breakdown
    })

    const loadData = async () => {
      try {
        state.isLoading = true
        state.error = null

        switch (state.activeTab) {
          case 'students':
            state.students = await studentService.getAll()
            break
          case 'subjects':
            state.subjects = await subjectService.getAll()
            break
          case 'scores':
            state.scores = await scoreService.getAll()
            await loadAverageScore()
            await loadTopScores()
            await loadMaxSubjectScores()
            break
        }
      } catch (error) {
        state.error = error.message
      } finally {
        state.isLoading = false
      }
    }

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
      switch (state.activeTab) {
        case 'students':
          state.deleteId = item.student_id
          break
        case 'subjects':
          state.deleteId = item.subject_id
          break
        case 'scores':
          state.deleteId = item.score_id
          break
      }
      state.showDeleteModal = true
    }

    const saveItem = async (formData) => {
      try {
        state.isLoading = true
        state.error = null

        switch (state.activeTab) {
          case 'students':
            if (state.formMode === 'add') {
              await studentService.create(formData)
            } else {
              await studentService.update(state.currentItem.id, formData)
            }
            break
          case 'subjects':
            if (state.formMode === 'add') {
              await subjectService.create(formData)
            } else {
              await subjectService.update(state.currentItem.id, formData)
            }
            break
          case 'scores':
            if (state.formMode === 'add') {
              await scoreService.create(formData)
            } else {
              await scoreService.update(state.currentItem.id, formData)
            }
            break
        }

        await loadData()
        state.showFormModal = false
      } catch (error) {
        state.error = error.message
      } finally {
        state.isLoading = false
      }
    }

    const confirmDelete = async () => {
      if (!state.deleteId) {
        console.error('No ID to delete')
        return
      }

      try {
        state.isLoading = true
        console.log('Deleting:', state.activeTab, state.deleteId)

        const response = await (async () => {
          switch (state.activeTab) {
            case 'students':
              return studentService.delete(state.deleteId)
            case 'subjects':
              return subjectService.delete(state.deleteId)
            case 'scores':
              return scoreService.delete(state.deleteId)
          }
        })()

        console.log('Delete response:', response)
        console.log(state.deleteId)
        await loadData()
      } catch (error) {
        if (error.message.includes('foreign key constraint')) {
          state.error = 'Cannot delete - related records exist!'
        } else {
          state.error = error.message
        }
      } finally {
        state.isLoading = false
        state.showDeleteModal = false
        state.deleteId = null
      }
    }

    const isValidDate = (dateString) => {
      return !isNaN(Date.parse(dateString))
    }

    const formatDateDisplay = (dateString) => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const loadMaxSubjectScores = async () => {
      try {
        state.subjects = await subjectService.getAll()
        state.maxSubjectScores = await scoreService.getMaxSubjectScores()
      } catch (error) {
        state.error = error.message
      }
    }

    const loadAverageScore = async () => {
      try {
        const scores = await scoreService.getAll()
        const totalScore = scores.reduce((acc, score) => acc + score.score, 0)
        state.averageScore = totalScore / scores.length
      } catch (error) {
        state.error = error.message
      }
    }

    const loadTopScores = async () => {
      try {
        state.topScores = await scoreService.getTopScores(10)
      } catch (error) {
        state.error = error.message
      }
    }

    onMounted(loadData)

    return {
      state,
      headers,
      filteredItems,
      processedMaxSubjectScores,
      processedTopScores,
      studentSubjectBreakdown,
      handleAdd,
      handleEdit,
      handleDelete,
      saveItem,
      confirmDelete,
      loadData,
      isValidDate,
      formatDateDisplay,
      loadMaxSubjectScores,
      loadAverageScore,
      loadTopScores,
    }
  },
}
</script>

<template>
  <Container>
    <div v-if="state.isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <div v-if="state.error" class="error-message">Error: {{ state.error }}</div>

    <Tabs
      :tabs="[
        { label: 'Students', value: 'students' },
        { label: 'Subjects', value: 'subjects' },
        { label: 'Scores', value: 'scores' },
      ]"
      :activeTab="state.activeTab"
      @update:activeTab="
        (newTab) => {
          state.activeTab = newTab
          loadData()
        }
      "
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
            {{ isValidDate(item.dob) ? formatDateDisplay(item.dob) : 'N/A' }}
          </template>
          <template #actions="{ item }">
            <button class="btn-icon" @click="handleEdit(item)">
              <img src="/edit-icon.svg" />
            </button>
            <button class="btn-icon" @click="handleDelete(item)">
              <img src="/delete-icon.svg" />
            </button>
          </template>
        </Table>
      </template>

      <template #subjects>
        <SearchBar
          :placeholder="'Search subjects...'"
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
          <template #actions="{ item }">
            <button class="btn-icon" @click="handleEdit(item)">
              <img src="/edit-icon.svg" />
            </button>
            <button class="btn-icon" @click="handleDelete(item)">
              <img src="/delete-icon.svg" />
            </button>
          </template>
        </Table>
      </template>

      <template #scores>
        <div class="score-stats">
          <div class="stat-card">
            <h3 class="stat-header">📊 Average Score</h3>
            <div class="stat-avg-value">{{ state.averageScore.toFixed(1) || '0.0' }}</div>
          </div>

          <div class="stat-card">
            <h3 class="stat-header">Subject Highest Scores</h3>
            <div class="stat-list">
              <div v-for="(score, index) in processedMaxSubjectScores" :key="index">
                {{ index + 1 }}. {{ score.subject_name }} - {{ score.score }}
                <span class="by-text">by</span> {{ score.student_name }}
              </div>
            </div>
          </div>

          <div class="stat-card">
            <h3 class="stat-header">Top Overall Scores</h3>
            <div class="stat-list">
              <div v-for="(score, index) in processedTopScores" :key="index">
                {{ index + 1 }}. {{ score.student_name }} (Scored {{ score.score }} in
                {{ score.subject_name }})
              </div>
              <li v-if="state.topScores.length === 0">No scores available</li>
            </div>
          </div>
        </div>

        <div class="stat-card full-width">
          <h3 class="stat-header">Student Subject Breakdown</h3>
          <div class="student-subject-list">
            <div
              v-for="student in Object.values(studentSubjectBreakdown)"
              :key="student.name"
              class="student-entry"
            >
              <div class="student-header">
                {{ student.name }}
                <span class="pill">Subjects: {{ Object.keys(student.subjects).length }}</span>
              </div>

              <div class="subject-scores">
                <div
                  v-for="subject in Object.values(student.subjects)"
                  :key="subject.name"
                  class="subject-entry"
                >
                  <div class="subject-name">{{ subject.name }}</div>
                  <div class="score-details">
                    <span v-for="(score, idx) in subject.scores" :key="idx" class="score-pill">
                      {{ score }}
                    </span>
                    <div class="average">Avg: {{ subject.average.toFixed(1) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SearchBar
          :placeholder="'Search scores...'"
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
          <template #cell-date="{ item }">
            {{ isValidDate(item.date) ? formatDateDisplay(item.date) : 'N/A' }}
          </template>
          <template #actions="{ item }">
            <button class="btn-icon" @click="handleEdit(item)">
              <img src="/edit-icon.svg" />
            </button>
            <button class="btn-icon" @click="handleDelete(item)">
              <img src="/delete-icon.svg" />
            </button>
          </template>
        </Table>
      </template>
    </Tabs>

    <FormModal
      :show="state.showFormModal"
      :fields="headers"
      :initial-data="state.currentItem"
      :mode="state.formMode"
      :title="`${state.formMode === 'add' ? 'Add' : 'Edit'} ${state.activeTab.slice(0, -1)}`"
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
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  padding: 1rem;
  background: #ffebee;
  color: #b71c1c;
  border-radius: 4px;
  margin: 1rem 0;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  opacity: 0.5;
}

.btn-icon:hover {
  background: #f0f0f0;
  border-radius: 4px;
  transition: background 0.2s;
  opacity: 1;
}

img {
  width: 15px;
  height: 15px;
  vertical-align: middle;
}

.score-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-header {
  font-weight: bold;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-avg-value {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
}

.stat-list {
  font-size: 0.9rem;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.5rem 0;
}

.student-subject-list {
  margin-top: 1rem;
}

.student-entry {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.student-header {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pill {
  background: #e9ecef;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9em;
}

.subject-scores {
  padding: 1rem;
}

.subject-entry {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.subject-entry:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.subject-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.score-details {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.score-pill {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9em;
}

.average {
  margin-left: auto;
  background: #f0f4c3;
  color: #827717;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 500;
}

.full-width {
  grid-column: 1 / -1;
}
</style>
