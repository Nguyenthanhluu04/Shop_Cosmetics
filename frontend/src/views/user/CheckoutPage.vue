<template>
  <div class="min-h-screen bg-gray-50">
    <HeaderComponent />
    
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Thanh toán</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form thông tin giao hàng -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Thông tin giao hàng</h2>
            
            <!-- Chọn địa chỉ đã lưu -->
            <div v-if="addresses.length > 0" class="mb-6">
              <label class="block text-gray-700 font-medium mb-3">
                <i class="fas fa-map-marker-alt mr-2"></i>Chọn địa chỉ đã lưu
              </label>
              <div class="space-y-2">
                <div 
                  v-for="address in addresses" 
                  :key="address.id"
                  @click="selectAddress(address)"
                  :class="[
                    'p-4 border-2 rounded-lg cursor-pointer transition-all',
                    selectedAddressId === address.id 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
                  ]"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <p class="font-semibold text-gray-800">{{ address.userName }}</p>
                      <p class="text-sm text-gray-600 mt-1">
                        <i class="fas fa-phone mr-2"></i>{{ address.phoneNumber }}
                      </p>
                      <p class="text-sm text-gray-600 mt-1">
                        <i class="fas fa-map-marker-alt mr-2"></i>{{ address.userAddress }}
                      </p>
                    </div>
                    <div v-if="selectedAddressId === address.id" class="text-pink-500">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-3 text-sm text-gray-500 italic">
                <i class="fas fa-info-circle mr-1"></i>Hoặc nhập thông tin mới bên dưới
              </div>
            </div>

            <form @submit.prevent="handleSubmitOrder">
              <div class="space-y-4">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Họ và tên *</label>
                  <input 
                    v-model="shippingInfo.customerName" 
                    type="text" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Số điện thoại *</label>
                  <input 
                    v-model="shippingInfo.phoneNumber" 
                    type="tel" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Địa chỉ giao hàng *</label>
                  <textarea 
                    v-model="shippingInfo.yourAddress" 
                    required
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    placeholder="Nhập địa chỉ chi tiết"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Ghi chú đơn hàng (tùy chọn)</label>
                  <textarea 
                    v-model="note" 
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa chỉ giao hàng chi tiết hơn"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>

          <!-- Phương thức thanh toán -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Phương thức thanh toán</h2>
            
            <div class="space-y-3">
              <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="cod"
                  class="w-4 h-4 text-[var(--primary-color)]"
                />
                <span class="ml-3 text-gray-700">Thanh toán khi nhận hàng (COD)</span>
              </label>

              <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="banking"
                  class="w-4 h-4 text-[var(--primary-color)]"
                />
                <span class="ml-3 text-gray-700">Chuyển khoản ngân hàng</span>
              </label>

              <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="momo"
                  class="w-4 h-4 text-[var(--primary-color)]"
                />
                <span class="ml-3 text-gray-700">Ví MoMo</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Tóm tắt đơn hàng -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Đơn hàng của bạn</h2>
            
            <div class="space-y-4 mb-6">
              <div v-for="item in cartItems" :key="item.id" class="flex gap-3 pb-4 border-b">
                <img 
                  :src="item.urlImg" 
                  :alt="item.title"
                  class="w-16 h-16 object-cover rounded"
                />
                <div class="flex-1">
                  <p class="text-sm text-gray-800 font-medium line-clamp-2">{{ item.title }}</p>
                  <p class="text-sm text-gray-600">Số lượng: {{ item.quantity }}</p>
                  <p class="text-sm font-semibold text-[var(--primary-color)]">{{ item.totalPrice }} đ</p>
                </div>
              </div>
            </div>

            <div class="border-t pt-4 space-y-2">
              <div class="flex justify-between text-gray-700">
                <span>Tạm tính:</span>
                <span>{{ totalAmount }} đ</span>
              </div>
              <div class="flex justify-between text-gray-700">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Tổng cộng:</span>
                <span class="text-[var(--primary-color)]">{{ totalAmount }} đ</span>
              </div>
            </div>

            <button 
              @click="handleSubmitOrder"
              :disabled="loading || cartItems.length === 0"
              class="w-full mt-6 bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--primary-dark-color)] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Đang xử lý...' : 'Đặt hàng' }}
            </button>

            <router-link 
              to="/CartPage"
              class="block text-center mt-4 text-gray-600 hover:text-[var(--primary-color)] transition-colors"
            >
              ← Quay lại giỏ hàng
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/user/cartStore'
import { useOrderStore } from '@/stores/user/orderStore'
import { useUserProfileStore } from '@/stores/user/userProfileStore'
import HeaderComponent from '@/components/user/HeaderComponent.vue'
import FooterComponent from '@/components/user/FooterComponent.vue'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const profileStore = useUserProfileStore()

const shippingInfo = ref({
  customerName: '',
  phoneNumber: '',
  yourAddress: ''
})

const paymentMethod = ref('cod')
const note = ref('')
const loading = ref(false)
const selectedAddressId = ref(null)

const cartItems = computed(() => cartStore.cartItems)
const addresses = computed(() => profileStore.addresses)
const userProfile = computed(() => profileStore.userProfile)

const totalAmount = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = parseInt(item.priceNew.replace(/\./g, ''))
    return sum + (price * item.quantity)
  }, 0).toLocaleString('vi-VN')
})

const selectAddress = (address) => {
  selectedAddressId.value = address.id
  shippingInfo.value = {
    customerName: address.userName,
    phoneNumber: address.phoneNumber.toString(),
    yourAddress: address.userAddress
  }
}

const handleSubmitOrder = async () => {
  if (!shippingInfo.value.customerName || !shippingInfo.value.phoneNumber || !shippingInfo.value.yourAddress) {
    alert('Vui lòng điền đầy đủ thông tin giao hàng')
    return
  }

  if (cartItems.value.length === 0) {
    alert('Giỏ hàng trống')
    return
  }

  loading.value = true

  try {
    const orderData = {
      items: cartItems.value.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      })),
      shippingInfo: shippingInfo.value,
      paymentMethod: paymentMethod.value,
      note: note.value
    }

    console.log('Sending order data:', orderData)
    console.log('Cart items structure:', cartItems.value)

    const response = await orderStore.createOrder(orderData)
    
    console.log('Order response:', response)
    
    if (response.success) {
      // Xóa giỏ hàng local
      await cartStore.fetchCartItems()
      // Chuyển đến trang đơn hàng
      router.push('/user/orders')
    } else {
      alert(response.message || 'Có lỗi xảy ra khi đặt hàng')
    }
  } catch (error) {
    console.error('Order error:', error)
    console.error('Error response:', error.response)
    alert(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đặt hàng')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Lấy giỏ hàng nếu chưa có
  if (cartItems.value.length === 0) {
    await cartStore.fetchCartItems()
  }

  // Lấy thông tin user và địa chỉ
  await profileStore.fetchUserProfile()
  await profileStore.fetchAddresses()

  // Tự động điền địa chỉ mặc định nếu có
  if (addresses.value.length > 0) {
    selectAddress(addresses.value[0])
  } else if (userProfile.value) {
    // Nếu không có địa chỉ đã lưu, tự động điền tên
    shippingInfo.value.customerName = userProfile.value.tenKH || ''
  }
})
</script>

<style scoped>
:root {
  --primary-color: #ec4899;
  --primary-dark-color: #db2777;
}
</style>
