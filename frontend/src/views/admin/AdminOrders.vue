<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Quản lý đơn hàng</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <AdminStatsCard 
        title="Tổng đơn hàng"
        :value="stats.totalOrders"
        icon="shopping-cart"
        color="blue"
      />
      
      <AdminStatsCard 
        title="Đơn hàng hôm nay"
        :value="stats.todayOrders"
        icon="calendar-day"
        color="green"
      />
      
      <AdminStatsCard 
        title="Chờ xác nhận"
        :value="getPendingOrdersCount"
        icon="clock"
        color="yellow"
      />
      
      <AdminStatsCard 
        title="Doanh thu tháng"
        :value="formatRevenue(stats.monthlyRevenue)"
        icon="dollar-sign"
        color="pink"
      />
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1 min-w-[200px]">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Tìm kiếm đơn hàng..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
          />
        </div>
        
        <select 
          v-model="filterStatus"
          @change="loadOrders"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="shipping">Đang giao hàng</option>
          <option value="delivered">Đã giao hàng</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <p class="text-gray-500">Đang tải...</p>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="p-8 text-center">
        <p class="text-gray-500">Không có đơn hàng nào</p>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ order.id }}</td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ order.customerName }}</div>
              <div class="text-sm text-gray-500">{{ order.phoneNumber }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(order.created_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[var(--primary-color)]">{{ order.totalAmount }} đ</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button 
                @click="viewOrderDetail(order)"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                <i class="fas fa-eye"></i> Xem
              </button>
              <button 
                @click="openUpdateStatusModal(order)"
                class="text-green-600 hover:text-green-900 mr-3"
              >
                <i class="fas fa-edit"></i> Cập nhật
              </button>
              <button 
                v-if="userRole === 'admin'"
                @click="handleDeleteOrder(order.id)"
                class="text-red-600 hover:text-red-900"
              >
                <i class="fas fa-trash"></i> Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-6 py-4 border-t border-gray-200">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Hiển thị {{ (pagination.page - 1) * pagination.limit + 1 }} - 
            {{ Math.min(pagination.page * pagination.limit, pagination.total) }} 
            trong tổng số {{ pagination.total }} đơn hàng
          </div>
          <div class="flex gap-2">
            <button 
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="changePage(page)"
              :class="['px-3 py-1 border rounded', page === pagination.page ? 'bg-[var(--primary-color)] text-white' : 'hover:bg-gray-50']"
            >
              {{ page }}
            </button>
            <button 
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page === pagination.totalPages"
              class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Chi tiết đơn hàng -->
    <AdminModal v-if="showDetailModal" @close="closeDetailModal">
      <template #header>
        <h2 class="text-2xl font-bold text-gray-800">Chi tiết đơn hàng #{{ selectedOrder?.order?.id }}</h2>
      </template>
      
      <template #body>
        <div v-if="selectedOrder" class="space-y-6">
          <!-- Thông tin đơn hàng -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Thông tin đơn hàng</h3>
            <div class="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Mã đơn hàng:</strong> #{{ selectedOrder.order.id }}</p>
              <p><strong>Trạng thái:</strong> <span :class="getStatusClass(selectedOrder.order.status)">{{ getStatusText(selectedOrder.order.status) }}</span></p>
              <p><strong>Ngày đặt:</strong> {{ formatDate(selectedOrder.order.created_at) }}</p>
              <p><strong>Phương thức thanh toán:</strong> {{ getPaymentMethodText(selectedOrder.order.payment_method) }}</p>
              <p v-if="selectedOrder.order.note"><strong>Ghi chú:</strong> {{ selectedOrder.order.note }}</p>
            </div>
          </div>

          <!-- Thông tin khách hàng -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Thông tin khách hàng</h3>
            <div class="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Tên khách hàng:</strong> {{ selectedOrder.order.customerName }}</p>
              <p><strong>Email:</strong> {{ selectedOrder.order.email || 'Không có' }}</p>
              <p><strong>Số điện thoại:</strong> {{ selectedOrder.order.phoneNumber }}</p>
              <p><strong>Địa chỉ giao hàng:</strong> {{ selectedOrder.order.yourAddress }}</p>
            </div>
          </div>

          <!-- Chi tiết sản phẩm -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Sản phẩm</h3>
            <div class="space-y-3">
              <div v-for="item in selectedOrder.items" :key="item.id" class="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <img :src="item.product_image" :alt="item.product_name" class="w-20 h-20 object-cover rounded">
                <div class="flex-1">
                  <p class="font-medium text-gray-800">{{ item.product_name }}</p>
                  <p class="text-sm text-gray-600">Số lượng: {{ item.quantity }}</p>
                  <p class="text-sm text-gray-600">Đơn giá: {{ item.price }} đ</p>
                  <p class="font-semibold text-[var(--primary-color)]">Thành tiền: {{ item.subtotal }} đ</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tổng tiền -->
          <div class="border-t pt-4">
            <div class="flex justify-between text-xl font-bold">
              <span>Tổng cộng:</span>
              <span class="text-[var(--primary-color)]">{{ selectedOrder.order.totalAmount }} đ</span>
            </div>
          </div>
        </div>
      </template>
    </AdminModal>

    <!-- Modal Cập nhật trạng thái -->
    <AdminModal v-if="showUpdateModal" @close="closeUpdateModal">
      <template #header>
        <h2 class="text-2xl font-bold text-gray-800">Cập nhật trạng thái đơn hàng #{{ orderToUpdate?.id }}</h2>
      </template>
      
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2">Trạng thái hiện tại</label>
            <span :class="getStatusClass(orderToUpdate?.status)">{{ getStatusText(orderToUpdate?.status) }}</span>
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Chọn trạng thái mới</label>
            <select 
              v-model="newStatus"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
            >
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="shipping">Đang giao hàng</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div class="flex gap-3 justify-end pt-4">
            <button 
              @click="closeUpdateModal"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button 
              @click="handleUpdateStatus"
              class="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-dark-color)] transition-colors"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </template>
    </AdminModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminOrderStore } from '@/stores/admin/adminOrderStore'
import AdminStatsCard from '@/components/admin/AdminStatsCard.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import { jwtDecode } from 'jwt-decode'

const orderStore = useAdminOrderStore()

const loading = ref(false)
const filterStatus = ref('')
const searchQuery = ref('')
const showDetailModal = ref(false)
const showUpdateModal = ref(false)
const selectedOrder = ref(null)
const orderToUpdate = ref(null)
const newStatus = ref('')

const orders = computed(() => orderStore.orders)
const stats = computed(() => orderStore.stats)
const pagination = computed(() => orderStore.pagination)

const userRole = computed(() => {
  const currentUserId = sessionStorage.getItem('currentUserId')
  const token = currentUserId ? localStorage.getItem(`user_${currentUserId}_accessToken`) : null
  if (token) {
    try {
      const decoded = jwtDecode(token)
      return decoded.role
    } catch (err) {
      return null
    }
  }
  return null
})

const getPendingOrdersCount = computed(() => {
  const pendingStats = stats.value.statusStats.find(s => s.status === 'pending')
  return pendingStats ? pendingStats.count : 0
})

const filteredOrders = computed(() => {
  let result = orders.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(order => 
      order.id.toString().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.phoneNumber.includes(query)
    )
  }
  
  return result
})

const visiblePages = computed(() => {
  const pages = []
  const total = pagination.value.totalPages
  const current = pagination.value.page
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages.filter(p => p !== '...' || pages.indexOf(p) === pages.lastIndexOf(p))
})

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  const classMap = {
    pending: 'px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium',
    confirmed: 'px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium',
    shipping: 'px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium',
    delivered: 'px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium',
    cancelled: 'px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium'
  }
  return classMap[status] || 'px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium'
}

const getPaymentMethodText = (method) => {
  const methodMap = {
    cod: 'Thanh toán khi nhận hàng',
    banking: 'Chuyển khoản ngân hàng',
    momo: 'Ví MoMo'
  }
  return methodMap[method] || method
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatRevenue = (revenue) => {
  if (!revenue) return '0'
  return revenue.toLocaleString('vi-VN')
}

const loadOrders = async () => {
  loading.value = true
  try {
    await orderStore.fetchOrders({
      status: filterStatus.value,
      page: pagination.value.page,
      limit: pagination.value.limit
    })
  } catch (error) {
    console.error('Error loading orders:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page < 1 || page > pagination.value.totalPages) return
  pagination.value.page = page
  loadOrders()
}

const viewOrderDetail = async (order) => {
  try {
    const response = await orderStore.fetchOrderDetail(order.id)
    selectedOrder.value = response
    showDetailModal.value = true
  } catch (error) {
    alert('Không thể tải chi tiết đơn hàng')
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedOrder.value = null
}

const openUpdateStatusModal = (order) => {
  orderToUpdate.value = order
  newStatus.value = order.status
  showUpdateModal.value = true
}

const closeUpdateModal = () => {
  showUpdateModal.value = false
  orderToUpdate.value = null
  newStatus.value = ''
}

const handleUpdateStatus = async () => {
  if (!newStatus.value || newStatus.value === orderToUpdate.value.status) {
    alert('Vui lòng chọn trạng thái mới')
    return
  }

  try {
    await orderStore.updateOrderStatus(orderToUpdate.value.id, newStatus.value)
    alert('Cập nhật trạng thái thành công')
    closeUpdateModal()
    await loadOrders()
    await orderStore.fetchOrderStats()
  } catch (error) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái')
  }
}

const handleDeleteOrder = async (orderId) => {
  if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return
  
  try {
    await orderStore.deleteOrder(orderId)
    alert('Xóa đơn hàng thành công')
    await orderStore.fetchOrderStats()
  } catch (error) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa đơn hàng')
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      orderStore.fetchOrders(),
      orderStore.fetchOrderStats()
    ])
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
:root {
  --primary-color: #ec4899;
  --primary-dark-color: #db2777;
}
</style>
