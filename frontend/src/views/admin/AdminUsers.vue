<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Quản lý tài khoản</h1>
      <p class="text-gray-600">Quản lý người dùng, nhân viên và phân quyền hệ thống</p>
    </div>

    <!-- Filters & Actions -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex flex-wrap gap-2">
          <button 
            @click="loadAll" 
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              activeFilter === 'all' 
                ? 'bg-[var(--primary-color)] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <i class="fas fa-users mr-2"></i>Tất cả
            <span v-if="activeFilter === 'all'" class="ml-1">({{ adminStore.users.length }})</span>
          </button>
          <button 
            @click="loadUsers" 
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              activeFilter === 'user' 
                ? 'bg-[var(--primary-color)] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <i class="fas fa-user mr-2"></i>Khách hàng
            <span v-if="activeFilter === 'user'" class="ml-1">({{ adminStore.users.length }})</span>
          </button>
          <button 
            @click="loadStaff" 
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              activeFilter === 'staff' 
                ? 'bg-[var(--primary-color)] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <i class="fas fa-user-tie mr-2"></i>Nhân viên
            <span v-if="activeFilter === 'staff'" class="ml-1">({{ adminStore.users.length }})</span>
          </button>
        </div>
        
        <button 
          @click="openCreate" 
          class="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          <i class="fas fa-plus mr-2"></i>Tạo nhân viên
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="adminStore.loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
      <i class="fas fa-spinner fa-spin text-3xl text-[var(--primary-color)] mb-4"></i>
      <p class="text-gray-600">Đang tải dữ liệu...</p>
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Người dùng</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vai trò</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in adminStore.users" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br  from-[var(--primary-color)]  to-pink-400 flex items-center justify-center text-white font-semibold">
                    {{ user.tenKH?.charAt(0)?.toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ user.tenKH }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-700': user.role === 'user',
                    'bg-green-100 text-green-700': user.role === 'staff',
                    'bg-yellow-100 text-yellow-700': user.role === 'admin'
                  }"
                >
                  <i 
                    :class="{
                      'fas fa-user': user.role === 'user',
                      'fas fa-user-tie': user.role === 'staff',
                      'fas fa-user-shield': user.role === 'admin'
                    }"
                    class="mr-1 text-xs"
                  ></i>
                  {{ user.role === 'user' ? 'Khách hàng' : user.role === 'staff' ? 'Nhân viên' : 'Quản trị' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button 
                  @click="openEdit(user)" 
                  class="text-blue-600 hover:text-blue-800 mr-3 font-medium"
                >
                  <i class="fas fa-edit mr-1"></i>Sửa
                </button>
                <button 
                  @click="removeUser(user.id)" 
                  class="text-red-600 hover:text-red-800 font-medium"
                >
                  <i class="fas fa-trash mr-1"></i>Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="adminStore.users.length === 0" class="text-center py-12">
        <i class="fas fa-users text-5xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">Không có người dùng nào</p>
      </div>
    </div>

    <!-- Modal create/edit -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800">
              <i :class="editMode ? 'fas fa-edit' : 'fas fa-user-plus'" class="mr-2"></i>
              {{ editMode ? 'Sửa người dùng' : 'Tạo nhân viên mới' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-user mr-1"></i>Họ và tên
            </label>
            <input 
              v-model="form.tenKH" 
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all" 
              placeholder="Nhập họ và tên"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-envelope mr-1"></i>Email
            </label>
            <input 
              v-model="form.email" 
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all" 
              placeholder="example@email.com"
            />
          </div>

          <div v-if="!editMode">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-lock mr-1"></i>Mật khẩu
            </label>
            <input 
              v-model="form.password" 
              type="password" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all" 
              placeholder="Nhập mật khẩu"
            />
          </div>

          <div v-if="editMode">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-lock mr-1"></i>Mật khẩu mới (để trống nếu không đổi)
            </label>
            <input 
              v-model="form.password" 
              type="password" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all" 
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <div v-if="editMode">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-user-tag mr-1"></i>Vai trò
            </label>
            <select 
              v-model="form.role" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all"
            >
              <option value="user">Khách hàng</option>
              <option value="staff">Nhân viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <button 
            @click="closeModal" 
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            <i class="fas fa-times mr-1"></i>Hủy
          </button>
          <button 
            @click="submit" 
            class="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            <i class="fas fa-save mr-1"></i>{{ editMode ? 'Cập nhật' : 'Tạo mới' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAdminStore } from '@/stores/admin/adminStore'

const adminStore = useAdminStore()
const showModal = ref(false)
const editMode = ref(false)
const form = ref({ tenKH: '', email: '', password: '' })
const activeFilter = ref('all')

const loadAll = () => {
  activeFilter.value = 'all'
  adminStore.fetchUsers('')
}

const loadUsers = () => {
  activeFilter.value = 'user'
  adminStore.fetchUsers('user')
}

const loadStaff = () => {
  activeFilter.value = 'staff'
  adminStore.fetchUsers('staff')
}

const openCreate = () => {
  editMode.value = false
  form.value = { tenKH: '', email: '', password: '' }
  showModal.value = true
}

const openEdit = (user) => {
  editMode.value = true
  form.value = { tenKH: user.tenKH, email: user.email, password: '', role: user.role }
  form.value.id = user.id
  showModal.value = true
}

const closeModal = () => (showModal.value = false)

const submit = async () => {
  try {
    if (editMode.value) {
      const payload = { 
        tenKH: form.value.tenKH, 
        email: form.value.email, 
        role: form.value.role
      }
      if (form.value.password) {
        payload.password = form.value.password
      }
      await adminStore.updateUser(form.value.id, payload)
    } else {
      await adminStore.createStaff({ tenKH: form.value.tenKH, email: form.value.email, password: form.value.password })
    }
    showModal.value = false
    adminStore.fetchUsers()
  } catch (err) {
    alert('Lỗi: ' + (err?.response?.data?.message || err.message))
  }
}

const removeUser = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa?')) return
  try {
    await adminStore.deleteUser(id)
    adminStore.fetchUsers()
  } catch (err) {
    alert('Xóa thất bại')
  }
}

// initial load
adminStore.fetchUsers()
</script>

<style scoped>
</style>
