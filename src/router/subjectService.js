import api from './api'

export default {
  async getAll() {
    try {
      const response = await api.get('/subjects/list')
      return response.data
    } catch (error) {
      console.error('Error fetching subjects:', error)
      throw error.response?.data?.detail || 'Failed to fetch subjects'
    }
  },

  async create(subject) {
    try {
      const response = await api.post('/subjects/add', subject)
      return response.data
    } catch (error) {
      console.error('Error creating subject:', error)
      throw error.response?.data?.detail || 'Failed to create subject'
    }
  },

  async update(id, subject) {
    try {
      const response = await api.put('/subjects/update', subject)
      return response.data
    } catch (error) {
      console.error('Error updating subject:', error)
      throw error.response?.data?.detail || 'Failed to update subject'
    }
  },

  async delete(id) {
    try {
      await api.delete(`/subjects/remove/${id}`)
    } catch (error) {
      console.error('Error deleting subject:', error)
      throw error.response?.data?.detail || 'Failed to delete subject'
    }
  },
}
