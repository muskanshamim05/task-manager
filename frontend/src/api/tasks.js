import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

export const taskApi = {
  getAll: (filter = 'all', search = '') =>
    api.get('/tasks', { params: { filter, search } }).then(r => r.data),

  getStats: () =>
    api.get('/tasks/stats').then(r => r.data),

  create: (data) =>
    api.post('/tasks', data).then(r => r.data),

  update: (id, data) =>
    api.put(`/tasks/${id}`, data).then(r => r.data),

  toggle: (id) =>
    api.patch(`/tasks/${id}/toggle`).then(r => r.data),

  delete: (id) =>
    api.delete(`/tasks/${id}`)
}
