<template>
  <aside 
    :class="[
      'fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out',
      adminUIStore.sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
    style="top: 73px;"
  >
    <nav class="p-4">
      <ul class="space-y-2">
        <!-- Dashboard -->
        <li>
          <router-link 
            :to="{name: 'AdminDashboard'}" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-[var(--primary-color)] hover:text-white transition-colors"
            active-class="bg-[var(--primary-color)] text-white"
            @click="closeSidebarOnMobile"
          >
            <i class="fas fa-chart-pie w-5"></i>
            <span>Dashboard</span>
          </router-link>
        </li>
        
        <!-- Quản lý tài khoản - chỉ admin -->
        <li v-if="adminUIStore.isAdmin">
          <router-link 
            :to="{name: 'AdminUsers'}" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-[var(--primary-color)] hover:text-white transition-colors"
            active-class="bg-[var(--primary-color)] text-white"
            @click="closeSidebarOnMobile"
          >
            <i class="fas fa-users w-5"></i>
            <span>Quản lý tài khoản</span>
          </router-link>
        </li>
        
    

        <!-- Quản lý sản phẩm -->
        <li>
          <router-link 
            :to="{name: 'AdminProducts'}" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-[var(--primary-color)] hover:text-white transition-colors"
            active-class="bg-[var(--primary-color)] text-white"
            @click="closeSidebarOnMobile"
          >
            <i class="fas fa-box w-5"></i>
            <span>Quản lý sản phẩm</span>
          </router-link>
        </li>

        <!-- Quản lý đơn hàng -->
        <li>
          <router-link 
            :to="{name: 'AdminOrders'}" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-[var(--primary-color)] hover:text-white transition-colors"
            active-class="bg-[var(--primary-color)] text-white"
            @click="closeSidebarOnMobile"
          >
            <i class="fas fa-shopping-cart w-5"></i>
            <span>Quản lý đơn hàng</span>
          </router-link>
        </li>

        <!-- Thống kê -->
        <li>
          <div class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed">
            <i class="fas fa-chart-line w-5"></i>
            <span>Thống kê</span>
          </div>
        </li>

        <!-- Cài đặt -->
        <li class="pt-4 mt-4 border-t">
          <div class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed">
            <i class="fas fa-cog w-5"></i>
            <span>Cài đặt</span>
          </div>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { useAdminUIStore } from '@/stores/admin/adminUIStore'

const adminUIStore = useAdminUIStore()

const closeSidebarOnMobile = () => {
  // Chỉ đóng sidebar trên mobile
  if (window.innerWidth < 1024) {
    adminUIStore.closeSidebar()
  }
}
</script>

<style scoped>
</style>
