<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import MyAccountComponent from '@/components/MyAccountComponent.vue';
import MyAddressComponent from '@/components/MyAddressComponent.vue';

const route = useRoute();
const activeTab = ref('account'); // 'account' or 'address'

onMounted(() => {
  // Check if there's a tab query parameter
  if (route.query.tab) {
    activeTab.value = route.query.tab;
  }
});

const setActiveTab = (tab) => {
  activeTab.value = tab;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <HeaderComponent />

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-4">
            <h2 class="text-lg font-bold text-gray-800 mb-4">Quản Lý Tài Khoản</h2>
            
            <nav class="space-y-1">
              <button 
                @click="setActiveTab('account')"
                :class="[
                  'w-full text-left px-4 py-3 rounded-md transition-colors flex items-center gap-3',
                  activeTab === 'account' 
                    ? 'bg-[var(--primary-color)] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                <i class="fas fa-user w-5 h-5"></i>
                <span>Tài khoản của tôi</span>
              </button>

              <button 
                @click="setActiveTab('address')"
                :class="[
                  'w-full text-left px-4 py-3 rounded-md transition-colors flex items-center gap-3',
                  activeTab === 'address' 
                    ? 'bg-[var(--primary-color)] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                <i class="fas fa-map-marker-alt w-5 h-5"></i>
                <span>Địa chỉ của tôi</span>
              </button>

              <button 
                class="w-full text-left px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
              >
                <i class="fas fa-shopping-bag w-5 h-5"></i>
                <span>Đơn hàng của tôi</span>
              </button>

              <button 
                class="w-full text-left px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
              >
                <i class="fas fa-bell w-5 h-5"></i>
                <span>Thông báo</span>
              </button>

              <button 
                class="w-full text-left px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
              >
                <i class="fas fa-gift w-5 h-5"></i>
                <span>Ưu đãi của tôi</span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Content Area -->
        <div class="lg:col-span-3">
          <Transition name="fade" mode="out-in">
            <MyAccountComponent v-if="activeTab === 'account'" key="account" />
            <MyAddressComponent v-else-if="activeTab === 'address'" key="address" />
          </Transition>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <FooterComponent />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
