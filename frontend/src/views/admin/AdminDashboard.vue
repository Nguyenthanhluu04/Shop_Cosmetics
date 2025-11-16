<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <AdminStatsCard 
        title="Tổng người dùng"
        :value="stats.totalUsers"
        icon="users"
        color="pink"
      />
      
      <AdminStatsCard 
        title="Khách hàng"
        :value="stats.customers"
        icon="user-friends"
        color="blue"
      />
      
      <AdminStatsCard 
        title="Nhân viên"
        :value="stats.staff"
        icon="user-tie"
        color="green"
      />
      
      <AdminStatsCard 
        title="Quản trị viên"
        :value="stats.admins"
        icon="user-shield"
        color="yellow"
      />
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Thao tác nhanh</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link 
          :to="{name: 'AdminUsers'}" 
          class="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-[var(--primary-color)] hover:shadow-md transition-all group"
        >
          <i class="fas fa-users text-3xl text-gray-400 group-hover:text-[var(--primary-color)] mb-2"></i>
          <span class="text-sm text-gray-700 group-hover:text-[var(--primary-color)]">Quản lý tài khoản</span>
        </router-link>

        <div class="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-[var(--primary-color)] hover:shadow-md transition-all group cursor-pointer">
          <i class="fas fa-box text-3xl text-gray-400 group-hover:text-[var(--primary-color)] mb-2"></i>
          <span class="text-sm text-gray-700 group-hover:text-[var(--primary-color)]">Quản lý sản phẩm</span>
        </div>

        <div class="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-[var(--primary-color)] hover:shadow-md transition-all group cursor-pointer">
          <i class="fas fa-shopping-cart text-3xl text-gray-400 group-hover:text-[var(--primary-color)] mb-2"></i>
          <span class="text-sm text-gray-700 group-hover:text-[var(--primary-color)]">Quản lý đơn hàng</span>
        </div>

        <div class="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-[var(--primary-color)] hover:shadow-md transition-all group cursor-pointer">
          <i class="fas fa-chart-line text-3xl text-gray-400 group-hover:text-[var(--primary-color)] mb-2"></i>
          <span class="text-sm text-gray-700 group-hover:text-[var(--primary-color)]">Thống kê</span>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Hoạt động gần đây</h2>
      <div class="space-y-3" v-if="loading">
        <p class="text-gray-500">Đang tải...</p>
      </div>
      <div class="space-y-3" v-else-if="recentUsers.length > 0">
        <div 
          v-for="user in recentUsers" 
          :key="user.id"
          class="flex items-center justify-between p-3 border-b border-gray-100 last:border-0"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <i class="fas fa-user text-gray-500"></i>
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ user.tenKH }}</p>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
            </div>
          </div>
          <span class="text-xs px-2 py-1 rounded-full" :class="{
            'bg-blue-100 text-blue-700': user.role === 'user',
            'bg-green-100 text-green-700': user.role === 'staff',
            'bg-yellow-100 text-yellow-700': user.role === 'admin'
          }">
            {{ user.role }}
          </span>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        Không có dữ liệu
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import AdminStatsCard from '@/components/admin/AdminStatsCard.vue'

const adminStore = useAdminStore()
const loading = ref(false)

const stats = ref({
  totalUsers: 0,
  customers: 0,
  staff: 0,
  admins: 0
})

const recentUsers = ref([])

const loadDashboard = async () => {
  loading.value = true
  try {
    await adminStore.fetchUsers()
    const users = adminStore.users
    
    stats.value.totalUsers = users.length
    stats.value.customers = users.filter(u => u.role === 'user').length
    stats.value.staff = users.filter(u => u.role === 'staff').length
    stats.value.admins = users.filter(u => u.role === 'admin').length
    
    // Get 5 most recent users
    recentUsers.value = users.slice(0, 5)
  } catch (err) {
    console.error('Load dashboard error', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

<style scoped>
</style>
