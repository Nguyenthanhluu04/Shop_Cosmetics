import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useAdminStore = defineStore('adminStore', () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchUsers = async (role = '') => {
    loading.value = true
    try {
      const url = role ? `/api/admin/users?role=${role}` : '/api/admin/users'
      const res = await api.get(url)
      users.value = res.data.users || []
    } catch (err) {
      console.error('fetchUsers error', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const createStaff = async (payload) => {
    try {
      const res = await api.post('/api/admin/users', payload)
      return res.data
    } catch (err) {
      console.error('createStaff error', err)
      throw err
    }
  }

  const updateUser = async (id, payload) => {
    try {
      const res = await api.put(`/api/admin/users/${id}`, payload)
      return res.data
    } catch (err) {
      console.error('updateUser error', err)
      throw err
    }
  }

  const deleteUser = async (id) => {
    try {
      const res = await api.delete(`/api/admin/users/${id}`)
      return res.data
    } catch (err) {
      console.error('deleteUser error', err)
      throw err
    }
  }

  return { users, loading, error, fetchUsers, createStaff, updateUser, deleteUser }
})
