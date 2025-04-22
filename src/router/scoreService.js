import api from './api'

export default {
  async getAll() {
    try {
      const response = await api.get('/scores/list')
      return response.data.data
    } catch (error) {
      console.error('Error fetching scores:', error)
      throw error.response?.data?.detail || 'Failed to fetch scores'
    }
  },

  async create(score) {
    try {
      const response = await api.post('/scores/add', score)
      return response.data.data
    } catch (error) {
      console.error('Error creating score:', error)
      throw error.response?.data?.detail || 'Failed to create score'
    }
  },

  async update(id, score) {
    try {
      const response = await api.put('/scores/update', score)
      return response.data.data
    } catch (error) {
      console.error('Error updating score:', error)
      throw error.response?.data?.detail || 'Failed to update score'
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/scores/remove/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error deleting score:', error)
      throw error.response?.data?.detail || 'Failed to delete score'
    }
  },

  async getMaxSubjectScores() {
    try {
      const response = await api.get('/scores/max_subject_scores')
      return response.data.data
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to fetch max subject scores'
    }
  },

  async getAverageScore() {
    try {
      const response = await api.get('/scores/avg')
      return response.data.data
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to fetch average score'
    }
  },

  async getTopScores(limit) {
    try {
      const response = await api.get(`/scores/top/${limit}`)
      return response.data.data
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to fetch top score'
    }
  },
}
