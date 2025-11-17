<template>
  <header class="bg-white shadow-sm border-b sticky top-0 z-10">
    <div class="px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button 
          @click="adminUIStore.toggleSidebar()" 
          class="lg:hidden text-gray-600 hover:text-gray-800"
        >
          <i class="fas fa-bars text-xl"></i>
        </button>
        <h1 class="text-xl font-bold text-[var(--primary-color)]">
          <i class="fas fa-store mr-2"></i>TL-Shop Admin
        </h1>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- User Menu -->
        <div class="relative group">
          <button class="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <div class="w-8 h-8 bg-[var(--primary-color)] rounded-full flex items-center justify-center text-white">
              <i class="fas fa-user-shield"></i>
            </div>
            <span class="hidden md:block font-medium">{{ adminUIStore.userName }}</span>
            <i class="fas fa-chevron-down text-xs"></i>
          </button>
          
          <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <router-link 
              :to="{name: 'HomePage'}" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <i class="fas fa-home mr-2"></i>Về trang chủ
            </router-link>
            <button 
              @click="handleLogout" 
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <i class="fas fa-sign-out-alt mr-2"></i>Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAdminUIStore } from '@/stores/admin/adminUIStore'
import { useUserStore } from '@/stores/user/userStore'
import { useRouter } from 'vue-router'

const adminUIStore = useAdminUIStore()
const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.handleLogOut()
  router.push({ name: 'LoginPage' })
}
</script>

<style scoped>
</style>
