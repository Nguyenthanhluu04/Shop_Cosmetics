import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user/userStore'

/**
 * Admin UI Store
 * Quản lý state của admin UI (sidebar, etc.)
 * Không cần truyền props giữa các components
 */
export const useAdminUIStore = defineStore('adminUI', () => {
  const userStore = useUserStore()
  
  // Sidebar state
  const sidebarOpen = ref(false)
  
  // Computed
  const userName = computed(() => 
    userStore.userInfor?.userName || 'Admin'
  )
  
  const userRole = computed(() => 
    userStore.userInfor?.role || 'staff'
  )
  
  const isAdmin = computed(() => 
    userStore.userInfor?.role === 'admin'
  )
  
  const isStaff = computed(() => 
    userStore.userInfor?.role === 'staff'
  )
  
  // Actions
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }
  
  const closeSidebar = () => {
    sidebarOpen.value = false
  }
  
  const openSidebar = () => {
    sidebarOpen.value = true
  }
  
  return {
    // State
    sidebarOpen,
    
    // Computed
    userName,
    userRole,
    isAdmin,
    isStaff,
    
    // Actions
    toggleSidebar,
    closeSidebar,
    openSidebar
  }
})
