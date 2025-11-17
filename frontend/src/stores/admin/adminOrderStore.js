import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useAdminOrderStore = defineStore('adminOrder', () => {
  const orders = ref([])
  const currentOrder = ref(null)
  const stats = ref({
    totalOrders: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    statusStats: []
  })
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  })
  const loading = ref(false)
  const error = ref(null)

  // Lấy danh sách tất cả đơn hàng
  const fetchOrders = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/api/admin/orders', { params })
      orders.value = response.data.orders || []
      pagination.value = response.data.pagination || pagination.value
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi lấy danh sách đơn hàng'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy chi tiết đơn hàng
  const fetchOrderDetail = async (orderId) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/api/admin/orders/${orderId}`)
      currentOrder.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi lấy chi tiết đơn hàng'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (orderId, status) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/api/admin/orders/${orderId}/status`, { status })
      // Cập nhật lại danh sách đơn hàng
      await fetchOrders({ page: pagination.value.page, limit: pagination.value.limit })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi cập nhật trạng thái đơn hàng'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Xóa đơn hàng
  const deleteOrder = async (orderId) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.delete(`/api/admin/orders/${orderId}`)
      // Cập nhật lại danh sách đơn hàng
      await fetchOrders({ page: pagination.value.page, limit: pagination.value.limit })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi xóa đơn hàng'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy thống kê đơn hàng
  const fetchOrderStats = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/api/admin/orders/stats')
      stats.value = response.data.stats || stats.value
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi lấy thống kê đơn hàng'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    currentOrder,
    stats,
    pagination,
    loading,
    error,
    fetchOrders,
    fetchOrderDetail,
    updateOrderStatus,
    deleteOrder,
    fetchOrderStats
  }
})
