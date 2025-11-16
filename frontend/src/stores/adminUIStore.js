import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user/userStore'

/**
 * Admin UI Store
 * Quản lý state của admin UI (sidebar, notifications, etc.)
 * Không cần truyền props giữa các components
 */
export const useAdminUIStore = defineStore('adminUI', () => {
  const userStore = useUserStore()
  
  // Sidebar state
  const sidebarOpen = ref(false)
  
  // Notification state
  const notifications = ref([
    { id: 1, message: 'User mới đăng ký', time: '5 phút trước', read: false },
    { id: 2, message: 'Đơn hàng mới #123', time: '10 phút trước', read: false },
    { id: 3, message: 'Sản phẩm sắp hết hàng', time: '1 giờ trước', read: true }
  ])
  
  // Computed
  const notificationCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )
  
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
  
  const markNotificationAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }
  
  const markAllNotificationsAsRead = () => {
    notifications.value.forEach(n => n.read = true)
  }
  
  const addNotification = (message) => {
    const newId = Math.max(...notifications.value.map(n => n.id), 0) + 1
    notifications.value.unshift({
      id: newId,
      message,
      time: 'Vừa xong',
      read: false
    })
  }
  
  return {
    // State
    sidebarOpen,
    notifications,
    
    // Computed
    notificationCount,
    userName,
    userRole,
    isAdmin,
    isStaff,
    
    // Actions
    toggleSidebar,
    closeSidebar,
    openSidebar,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addNotification
  }
})
