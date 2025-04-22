import api from './api'

export default {
  async getAll() {
    try {
      const response = await api.get('/students/list')
      return response.data
    } catch (error) {
      console.error('Error fetching students:', error)
      throw error
    }
  },

  async create(student) {
    try {
      const response = await api.post('/students/add', student)
      return response.data
    } catch (error) {
      console.error('Error creating student:', error)
      throw error.response.data.detail
    }
  },

  async update(id, student) {
    try {
      const response = await api.put('/students/update', student)
      return response.data
    } catch (error) {
      console.error('Error updating student:', error)
      throw error.response.data.detail
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/students/remove/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting student:', error)
      throw error.response.data.detail
    }
  },
}
