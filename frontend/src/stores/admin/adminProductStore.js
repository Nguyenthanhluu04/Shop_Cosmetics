import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useAdminProductStore = defineStore('adminProductStore', () => {
  const products = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Lấy danh sách sản phẩm
  const fetchProducts = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const queryParams = new URLSearchParams({
        page: params.page || pagination.value.page,
        limit: params.limit || pagination.value.limit,
        ...(params.search && { search: params.search }),
        ...(params.category && { category: params.category })
      })
      
      const res = await api.get(`/api/admin/products?${queryParams}`)
      
      if (res.data.success) {
        products.value = res.data.products || []
        pagination.value = res.data.pagination
      }
    } catch (err) {
      console.error('fetchProducts error', err)
      error.value = err.response?.data?.message || 'Lỗi khi tải sản phẩm'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy danh mục
  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/admin/products/categories')
      if (res.data.success) {
        categories.value = res.data.categories || []
      }
    } catch (err) {
      console.error('fetchCategories error', err)
      error.value = err.response?.data?.message || 'Lỗi khi tải danh mục'
    }
  }

  // Lấy chi tiết sản phẩm
  const getProductById = async (id) => {
    try {
      const res = await api.get(`/api/admin/products/${id}`)
      if (res.data.success) {
        return res.data.product
      }
    } catch (err) {
      console.error('getProductById error', err)
      throw err
    }
  }

  // Tạo sản phẩm
  const createProduct = async (payload) => {
    console.log('Store: Creating product with payload:', payload)
    try {
      const res = await api.post('/api/admin/products', payload)
      console.log('Store: Create product response:', res.data)
      if (res.data.success) {
        // Reload với params hiện tại để giữ nguyên page/filter
        return res.data
      }
    } catch (err) {
      console.error('createProduct error', err)
      console.error('Error response:', err.response?.data)
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm'
      throw new Error(errorMsg)
    }
  }

  // Cập nhật sản phẩm
  const updateProduct = async (id, payload) => {
    console.log('Store: Updating product', id, 'with payload:', payload)
    try {
      const res = await api.put(`/api/admin/products/${id}`, payload)
      console.log('Store: Update product response:', res.data)
      if (res.data.success) {
        // Reload với params hiện tại để giữ nguyên page/filter
        return res.data
      }
    } catch (err) {
      console.error('updateProduct error', err)
      console.error('Error response:', err.response?.data)
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm'
      throw new Error(errorMsg)
    }
  }

  // Xóa sản phẩm
  const deleteProduct = async (id) => {
    try {
      const res = await api.delete(`/api/admin/products/${id}`)
      if (res.data.success) {
        // Reload với params hiện tại để giữ nguyên page/filter
        return res.data
      }
    } catch (err) {
      console.error('deleteProduct error', err)
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm'
      throw new Error(errorMsg)
    }
  }

  return {
    products,
    categories,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchCategories,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  }
})
