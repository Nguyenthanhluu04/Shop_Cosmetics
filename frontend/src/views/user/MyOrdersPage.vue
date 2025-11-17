<template>
  <div class="min-h-screen bg-gray-50">
    <HeaderComponent />
    
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Đơn hàng của tôi</h1>

      <!-- Filter tabs -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-6">
        <div class="flex flex-wrap gap-2">
          <button 
            @click="filterStatus = ''"
            :class="['px-4 py-2 rounded-lg font-medium transition-colors', 
                     filterStatus === '' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
          >
            Tất cả
          </button>
          <button 
            @click="filterStatus = 'pending'"
            :class="['px-4 py-2 rounded-lg font-medium transition-colors', 
                     filterStatus === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
          >
            Chờ xác nhận
          </button>
          <button 
            @click="filterStatus = 'confirmed'"
            :class="['px-4 py-2 rounded-lg font-medium transition-colors', 
                     filterStatus === 'confirmed' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
          >
            Đã xác nhận
          </button>
          <button 
            @click="filterStatus = 'shipping'"
            :class="['px-4 py-2 rounded-lg font-medium transition-colors', 
                     filterStatus === 'shipping' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
          >
            Đang giao
          </button>
          <button 
            @click="filterStatus = 'delivered'"
            :class="['px-4 py-2 rounded-lg font-medium transition-colors', 
                     filterStatus === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
          >
            Đã giao
          </button>
          <button 
            @click="filterStatus = 'cancelled'"
            :class="['px-4 py-2 rounded-lg font-medium transition-colors', 
                     filterStatus === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
          >
            Đã hủy
          </button>
        </div>
      </div>

      <!-- Orders list -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Đang tải...</p>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
        <i class="fas fa-shopping-bag text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-600 text-lg">Chưa có đơn hàng nào</p>
        <router-link 
          to="/" 
          class="inline-block mt-4 px-6 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-dark-color)] transition-colors"
        >
          Tiếp tục mua sắm
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <p class="text-sm text-gray-600">Mã đơn hàng: <span class="font-semibold">#{{ order.id }}</span></p>
                <p class="text-sm text-gray-600">Ngày đặt: {{ formatDate(order.created_at) }}</p>
              </div>
              <span :class="getStatusClass(order.status)">
                {{ getStatusText(order.status) }}
              </span>
            </div>

            <div class="border-t border-b py-4 my-4">
              <p class="text-gray-700"><strong>Người nhận:</strong> {{ order.customerName }}</p>
              <p class="text-gray-700"><strong>Điện thoại:</strong> {{ order.phoneNumber }}</p>
              <p class="text-gray-700"><strong>Địa chỉ:</strong> {{ order.yourAddress }}</p>
            </div>

            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-gray-600">Tổng tiền</p>
                <p class="text-xl font-bold text-[var(--primary-color)]">{{ order.totalAmount }} đ</p>
              </div>
              <div class="flex gap-2">
                <button 
                  @click="viewOrderDetail(order.id)"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Xem chi tiết
                </button>
                <button 
                  v-if="order.status === 'pending'"
                  @click="handleCancelOrder(order.id)"
                  class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Hủy đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterComponent />

    <!-- Modal chi tiết đơn hàng -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeModal">
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800">Chi tiết đơn hàng #{{ selectedOrder?.order?.id }}</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-2xl"></i>
          </button>
        </div>

        <div v-if="selectedOrder" class="p-6">
          <!-- Thông tin đơn hàng -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Thông tin đơn hàng</h3>
            <div class="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Trạng thái:</strong> <span :class="getStatusClass(selectedOrder.order.status)">{{ getStatusText(selectedOrder.order.status) }}</span></p>
              <p><strong>Ngày đặt:</strong> {{ formatDate(selectedOrder.order.created_at) }}</p>
              <p><strong>Phương thức thanh toán:</strong> {{ getPaymentMethodText(selectedOrder.order.payment_method) }}</p>
              <p v-if="selectedOrder.order.note"><strong>Ghi chú:</strong> {{ selectedOrder.order.note }}</p>
            </div>
          </div>

          <!-- Thông tin giao hàng -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Thông tin giao hàng</h3>
            <div class="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Người nhận:</strong> {{ selectedOrder.order.customerName }}</p>
              <p><strong>Email:</strong> {{ selectedOrder.order.email || 'Không có' }}</p>
              <p><strong>Điện thoại:</strong> {{ selectedOrder.order.phoneNumber }}</p>
              <p><strong>Địa chỉ:</strong> {{ selectedOrder.order.yourAddress }}</p>
            </div>
          </div>

          <!-- Sản phẩm -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Sản phẩm</h3>
            <div class="space-y-3">
              <div v-for="item in selectedOrder.items" :key="item.id" class="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <img :src="item.product_image" :alt="item.product_name" class="w-20 h-20 object-cover rounded">
                <div class="flex-1">
                  <p class="font-medium text-gray-800">{{ item.product_name }}</p>
                  <p class="text-gray-600">Số lượng: {{ item.quantity }}</p>
                  <p class="text-gray-600">Đơn giá: {{ item.price }} đ</p>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/user/orderStore'
import HeaderComponent from '@/components/user/HeaderComponent.vue'
import FooterComponent from '@/components/user/FooterComponent.vue'

const orderStore = useOrderStore()

const filterStatus = ref('')
const loading = ref(false)
const showDetailModal = ref(false)
const selectedOrder = ref(null)

const orders = computed(() => orderStore.orders)
const filteredOrders = computed(() => {
  if (!filterStatus.value) return orders.value
  return orders.value.filter(order => order.status === filterStatus.value)
})

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    processing: 'Đang xử lý',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  const classMap = {
    pending: 'px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium',
    confirmed: 'px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium',
    processing: 'px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium',
    shipping: 'px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium',
    delivered: 'px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium',
    cancelled: 'px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium'
  }
  return classMap[status] || 'px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium'
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

const viewOrderDetail = async (orderId) => {
  try {
    const response = await orderStore.fetchOrderDetail(orderId)
    selectedOrder.value = response
    showDetailModal.value = true
  } catch (error) {
    alert('Không thể tải chi tiết đơn hàng')
  }
}

const closeModal = () => {
  showDetailModal.value = false
  selectedOrder.value = null
}

const handleCancelOrder = async (orderId) => {
  if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return
  
  try {
    await orderStore.cancelOrder(orderId)
    alert('Hủy đơn hàng thành công')
  } catch (error) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng')
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await orderStore.fetchMyOrders()
  } catch (error) {
    console.error('Error loading orders:', error)
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
