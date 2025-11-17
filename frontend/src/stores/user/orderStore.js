import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])
  const currentOrder = ref(null)
  const addresses = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Tạo đơn hàng mới
  const createOrder = async (orderData) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/api/user/orders', orderData)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi tạo đơn hàng'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy danh sách đơn hàng của user
  const fetchMyOrders = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/api/user/orders/my-orders')
      orders.value = response.data.orders || []
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
      const response = await api.get(`/api/user/orders/${orderId}`)
      currentOrder.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi lấy chi tiết đơn hàng'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Hủy đơn hàng
  const cancelOrder = async (orderId) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/api/user/orders/${orderId}/cancel`)
      // Cập nhật lại danh sách đơn hàng
      await fetchMyOrders()
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi hủy đơn hàng'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy danh sách địa chỉ đã lưu
  const fetchAddresses = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/api/user/orders/addresses')
      addresses.value = response.data.addresses || []
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi lấy danh sách địa chỉ'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Thêm địa chỉ mới
  const addAddress = async (addressData) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/api/user/orders/addresses', addressData)
      // Cập nhật lại danh sách địa chỉ
      await fetchAddresses()
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi thêm địa chỉ'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    currentOrder,
    addresses,
    loading,
    error,
    createOrder,
    fetchMyOrders,
    fetchOrderDetail,
    cancelOrder,
    fetchAddresses,
    addAddress
  }
})
