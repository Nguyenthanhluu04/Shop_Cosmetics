<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Admin Header Component -->
    <AdminHeader />

    <div class="flex">
      <!-- Admin Sidebar Component -->
      <AdminSidebar />

      <!-- Overlay for mobile -->
      <div 
        v-if="adminUIStore.sidebarOpen" 
        @click="adminUIStore.closeSidebar()"
        class="fixed inset-0 bg-black/50 z-10 lg:hidden"
      ></div>

      <!-- Main Content -->
      <main class="flex-1 p-6 lg:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAdminUIStore } from '@/stores/admin/adminUIStore'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'

const adminUIStore = useAdminUIStore()
</script>

<style scoped>
</style>
