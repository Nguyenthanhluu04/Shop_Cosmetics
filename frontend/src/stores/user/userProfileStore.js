import { defineStore } from "pinia";
import api from '@/services/api.js';
import { ref } from "vue";
import { useUserStore } from './userStore';

export const useUserProfileStore = defineStore('userProfileStore', () => {

  const userProfile = ref({
    tenKH: '',
    email: ''
  });
  
  const addresses = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchUserProfile = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await api.get('/api/profile/info');
      userProfile.value = response.data;
      
      return { success: true };
    } catch (err) {
      console.error('Lỗi khi lấy thông tin người dùng:', err);
      error.value = err.response?.data?.message || 'Không thể tải thông tin người dùng';
      
      // Fallback to userStore if API fails
      const userStore = useUserStore();
      if (userStore.userInfor) {
        userProfile.value = {
          tenKH: userStore.userInfor.userName || '',
          email: userStore.userInfor.email || ''
        };
      }
      
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const updateUserProfile = async (data) => {
    try {
      isLoading.value = true;
      error.value = null;

      if (!data.tenKH || !data.email) {
        throw new Error('Vui lòng điền đầy đủ thông tin!');
      }

      // Validate email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(data.email)) {
        throw new Error('Email không hợp lệ!');
      }

      await api.put('/api/profile/info', {
        tenKH: data.tenKH,
        email: data.email
      });

      // Update local state
      userProfile.value.tenKH = data.tenKH;
      userProfile.value.email = data.email;

      return { success: true, message: 'Cập nhật thông tin thành công!' };
    } catch (err) {
      console.error('Lỗi khi cập nhật thông tin:', err);
      error.value = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi cập nhật thông tin!';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Actions - Addresses
  const fetchAddresses = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await api.get('/api/profile/addresses');
      addresses.value = response.data;
      
      return { success: true };
    } catch (err) {
      console.error('Lỗi khi lấy danh sách địa chỉ:', err);
      error.value = err.response?.data?.message || 'Không thể tải danh sách địa chỉ';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const addAddress = async (addressData) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Validation
      if (!addressData.userName || !addressData.phoneNumber || !addressData.userAddress) {
        throw new Error('Vui lòng điền đầy đủ thông tin!');
      }

      // Validate phone number
      const phonePattern = /^[0-9]{10,11}$/;
      if (!phonePattern.test(addressData.phoneNumber.toString())) {
        throw new Error('Số điện thoại không hợp lệ! Vui lòng nhập 10-11 chữ số.');
      }

      const response = await api.post('/api/profile/addresses', {
        userName: addressData.userName,
        phoneNumber: parseInt(addressData.phoneNumber),
        userAddress: addressData.userAddress
      });

      // Refresh addresses list
      await fetchAddresses();

      return { success: true, message: 'Thêm địa chỉ thành công!', data: response.data };
    } catch (err) {
      console.error('Lỗi khi thêm địa chỉ:', err);
      error.value = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi thêm địa chỉ!';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Validation
      if (!addressData.userName || !addressData.phoneNumber || !addressData.userAddress) {
        throw new Error('Vui lòng điền đầy đủ thông tin!');
      }

      // Validate phone number
      const phonePattern = /^[0-9]{10,11}$/;
      if (!phonePattern.test(addressData.phoneNumber.toString())) {
        throw new Error('Số điện thoại không hợp lệ! Vui lòng nhập 10-11 chữ số.');
      }

      await api.put(`/api/profile/addresses/${addressId}`, {
        userName: addressData.userName,
        phoneNumber: parseInt(addressData.phoneNumber),
        userAddress: addressData.userAddress
      });

      // Refresh addresses list
      await fetchAddresses();

      return { success: true, message: 'Cập nhật địa chỉ thành công!' };
    } catch (err) {
      console.error('Lỗi khi cập nhật địa chỉ:', err);
      error.value = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi cập nhật địa chỉ!';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      isLoading.value = true;
      error.value = null;

      await api.delete(`/api/profile/addresses/${addressId}`);

      // Remove from local state
      addresses.value = addresses.value.filter(addr => addr.id !== addressId);

      return { success: true, message: 'Xóa địa chỉ thành công!' };
    } catch (err) {
      console.error('Lỗi khi xóa địa chỉ:', err);
      error.value = err.response?.data?.message || 'Có lỗi xảy ra khi xóa địa chỉ!';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Getters
  const hasAddresses = () => addresses.value.length > 0;

  // Reset state (useful for logout)
  const resetState = () => {
    userProfile.value = {
      tenKH: '',
      email: ''
    };
    addresses.value = [];
    error.value = null;
    isLoading.value = false;
  };

  return {

    userProfile,
    addresses,
    isLoading,
    error,

    fetchUserProfile,
    updateUserProfile,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,

    hasAddresses,
    resetState
  };
});
