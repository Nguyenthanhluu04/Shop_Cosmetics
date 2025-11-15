<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useUserProfileStore } from '@/stores/userProfileStore';

const userStore = useUserStore();
const profileStore = useUserProfileStore();

const isEditing = ref(false);

// Form data - sử dụng computed để sync với store
const formData = ref({
  tenKH: '',
  email: ''
});

// Computed properties from store
const isLoading = computed(() => profileStore.isLoading);
const userProfile = computed(() => profileStore.userProfile);

// Lấy thông tin người dùng từ store
const loadUserInfo = async () => {
  if (userStore.accessToken) {
    const result = await profileStore.fetchUserProfile();
    if (result.success) {
      formData.value = {
        tenKH: userProfile.value.tenKH || '',
        email: userProfile.value.email || ''
      };
    }
  } else {
    
    formData.value = {
      tenKH: userStore?.userInfor?.userName || '',
      email: userStore?.userInfor?.email || ''
    };
  }
};

onMounted(() => {
  loadUserInfo();
});

const handleEdit = () => {
  isEditing.value = true;
};

const handleCancel = () => {
  isEditing.value = false;
  // Reset về dữ liệu gốc từ store
  formData.value = {
    tenKH: userProfile.value.tenKH || '',
    email: userProfile.value.email || ''
  };
};

const handleSave = async () => {
  const result = await profileStore.updateUserProfile({
    tenKH: formData.value.tenKH,
    email: formData.value.email
  });

  if (result.success) {
    isEditing.value = false;
    // alert(result.message);
  } else {
    alert(result.error);
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 pb-4 border-b">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Hồ Sơ Của Tôi</h2>
        <p class="text-sm text-gray-500 mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>
      <button 
        v-if="!isEditing"
        @click="handleEdit"
        class="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:opacity-90 transition-opacity"
      >
        Chỉnh sửa
      </button>
    </div>

    <!-- User Info Form -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Form Fields -->
      <div class="md:col-span-2 space-y-5">
        <!-- Username -->
        <div class="flex items-center">
          <label class="w-40 text-gray-600 text-sm font-medium">Tên khách hàng</label>
          <div class="flex-1">
            <input 
              v-model="formData.tenKH"
              type="text" 
              :disabled="!isEditing"
              placeholder="Nhập tên khách hàng"
              class="w-full px-4 py-2 border rounded-md focus:border-[var(--primary-color)] disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>

        <!-- Email -->
        <div class="flex items-center">
          <label class="w-40 text-gray-600 text-sm font-medium">Email</label>
          <div class="flex-1">
            <input 
              v-model="formData.email"
              type="email" 
              :disabled="!isEditing"
              placeholder="Nhập email"
              class="w-full px-4 py-2 border rounded-md  focus:border-[var(--primary-color)] disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="isEditing" class="flex gap-3 pt-4">
          <button 
            @click="handleSave"
            :disabled="isLoading"
            class="px-6 py-2 bg-[var(--primary-color)] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Đang lưu...' : 'Lưu thay đổi' }}
          </button>
          <button 
            @click="handleCancel"
            :disabled="isLoading"
            class="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
        </div>
      </div>

      <!-- Avatar Section -->
      <div class="flex flex-col items-center justify-center md:border-l md:pl-6">
        <div class="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-200">
          <img 
            class="w-full h-full object-cover" 
            src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-260nw-1913928688.jpg" 
            alt="Avatar"
          />
        </div>
        <p class="text-sm text-gray-600 font-medium">{{ formData.tenKH || 'Khách hàng' }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ formData.email || 'email@example.com' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
