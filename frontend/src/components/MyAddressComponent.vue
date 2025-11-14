<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserProfileStore } from '@/stores/userProfileStore';

const profileStore = useUserProfileStore();

const showAddressForm = ref(false);
const isEditing = ref(false);
const editingAddressId = ref(null);

// Form data - Mapping theo cấu trúc database
const formData = ref({
  userName: '',
  phoneNumber: '',
  userAddress: ''
});

// Computed properties from store
const addresses = computed(() => profileStore.addresses);
const isLoading = computed(() => profileStore.isLoading);

// Load addresses from store
onMounted(() => {
  profileStore.fetchAddresses();
});

const handleAddNew = () => {
  showAddressForm.value = true;
  isEditing.value = false;
  resetForm();
};

const handleEdit = (address) => {
  isEditing.value = true;
  editingAddressId.value = address.id;
  showAddressForm.value = true;
  formData.value = {
    userName: address.userName,
    phoneNumber: address.phoneNumber.toString(),
    userAddress: address.userAddress
  };
};

const handleDelete = async (addressId) => {
  if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
    return;
  }

  const result = await profileStore.deleteAddress(addressId);
  
  if (result.success) {
    alert(result.message);
  } else {
    alert(result.error);
  }
};

const handleCancel = () => {
  showAddressForm.value = false;
  isEditing.value = false;
  editingAddressId.value = null;
  resetForm();
};

const handleSave = async () => {
  let result;

  if (isEditing.value) {
    // Update existing address
    result = await profileStore.updateAddress(editingAddressId.value, formData.value);
  } else {
    // Add new address
    result = await profileStore.addAddress(formData.value);
  }

  if (result.success) {
    alert(result.message);
    handleCancel();
  } else {
    alert(result.error);
  }
};

const resetForm = () => {
  formData.value = {
    userName: '',
    phoneNumber: '',
    userAddress: ''
  };
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 pb-4 border-b">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Địa Chỉ Của Tôi</h2>
        <p class="text-sm text-gray-500 mt-1">Quản lý địa chỉ giao hàng của bạn</p>
      </div>
      <button 
        v-if="!showAddressForm"
        @click="handleAddNew"
        class="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
      >
        <i class="fas fa-plus"></i>
        Thêm địa chỉ mới
      </button>
    </div>

    <!-- Address Form -->
    <div v-if="showAddressForm" class="mb-6 p-6 border rounded-lg bg-gray-50">
      <h3 class="text-lg font-semibold mb-4 text-gray-800">
        {{ isEditing ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới' }}
      </h3>
      
      <div class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="formData.userName"
            type="text" 
            placeholder="Nhập họ và tên người nhận"
            :disabled="isLoading"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] disabled:bg-gray-100"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="formData.phoneNumber"
            type="tel" 
            placeholder="Nhập số điện thoại (10-11 số)"
            maxlength="11"
            :disabled="isLoading"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] disabled:bg-gray-100"
          />
        </div>

        <!-- Address Detail -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ đầy đủ <span class="text-red-500">*</span>
          </label>
          <textarea 
            v-model="formData.userAddress"
            rows="4" 
            placeholder="Nhập địa chỉ đầy đủ (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
            :disabled="isLoading"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] disabled:bg-gray-100"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Ví dụ: 123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
          </p>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex gap-3 mt-6">
        <button 
          @click="handleSave"
          :disabled="isLoading"
          class="px-6 py-2 bg-[var(--primary-color)] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Lưu địa chỉ') }}
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

    <!-- Address List -->
    <div v-if="!showAddressForm">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
      </div>

      <!-- Address Cards -->
      <div v-else-if="addresses.length > 0" class="space-y-4">
        <div 
          v-for="address in addresses" 
          :key="address.id"
          class="p-4 border rounded-lg hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="font-semibold text-gray-800">{{ address.userName }}</h3>
              </div>
              <p class="text-gray-600 mb-1">
                <span class="font-medium">Điện thoại:</span> {{ address.phoneNumber }}
              </p>
              <p class="text-gray-600">
                <span class="font-medium">Địa chỉ:</span> {{ address.userAddress }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button 
                @click="handleEdit(address)"
                :disabled="isLoading"
                class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sửa
              </button>
              <button 
                @click="handleDelete(address.id)"
                :disabled="isLoading"
                class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <i class="fas fa-map-marked-alt text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">Chưa có địa chỉ nào</p>
        <p class="text-sm text-gray-400 mt-1">Thêm địa chỉ mới để sử dụng khi đặt hàng</p>
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
