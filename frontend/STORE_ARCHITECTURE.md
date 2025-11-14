# User Profile Store - Hướng Dẫn Sử Dụng

## 📦 Store: `userProfileStore.js`

Store này quản lý tất cả dữ liệu và logic liên quan đến thông tin người dùng và địa chỉ.

## 🎯 Cấu Trúc Store

### State

```javascript
{
  userProfile: {
    id: null,
    tenKH: '',
    email: '',
    role: ''
  },
  addresses: [],
  isLoading: false,
  error: null
}
```

### Actions

#### 1. User Profile Actions

**`fetchUserProfile()`**

- Lấy thông tin người dùng từ API
- Tự động fallback về `userStore` nếu API thất bại
- Return: `{ success: boolean, error?: string }`

**`updateUserProfile(data)`**

- Cập nhật thông tin người dùng
- Validation: email format, required fields
- Parameters: `{ tenKH: string, email: string }`
- Return: `{ success: boolean, message?: string, error?: string }`

#### 2. Address Actions

**`fetchAddresses()`**

- Lấy danh sách địa chỉ từ API
- Return: `{ success: boolean, error?: string }`

**`addAddress(addressData)`**

- Thêm địa chỉ mới
- Validation: required fields, phone number format
- Parameters: `{ userName: string, phoneNumber: string, userAddress: string }`
- Return: `{ success: boolean, message?: string, error?: string }`

**`updateAddress(addressId, addressData)`**

- Cập nhật địa chỉ hiện có
- Validation: required fields, phone number format
- Parameters: `addressId: number, addressData: object`
- Return: `{ success: boolean, message?: string, error?: string }`

**`deleteAddress(addressId)`**

- Xóa địa chỉ
- Tự động cập nhật local state
- Parameters: `addressId: number`
- Return: `{ success: boolean, message?: string, error?: string }`

#### 3. Utility Actions

**`hasAddresses()`**

- Kiểm tra xem có địa chỉ nào không
- Return: `boolean`

**`resetState()`**

- Reset toàn bộ state về giá trị ban đầu
- Được gọi tự động khi logout

## 🚀 Cách Sử Dụng

### Trong Component

```vue
<script setup>
import { computed, onMounted } from "vue";
import { useUserProfileStore } from "@/stores/userProfileStore";

const profileStore = useUserProfileStore();

// Computed properties
const isLoading = computed(() => profileStore.isLoading);
const addresses = computed(() => profileStore.addresses);
const userProfile = computed(() => profileStore.userProfile);

// Load data
onMounted(async () => {
  await profileStore.fetchUserProfile();
  await profileStore.fetchAddresses();
});

// Update user info
const updateProfile = async () => {
  const result = await profileStore.updateUserProfile({
    tenKH: "Nguyễn Văn A",
    email: "email@example.com",
  });

  if (result.success) {
    alert(result.message);
  } else {
    alert(result.error);
  }
};

// Add address
const addNewAddress = async () => {
  const result = await profileStore.addAddress({
    userName: "Nguyễn Văn A",
    phoneNumber: "0123456789",
    userAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  });

  if (result.success) {
    alert(result.message);
  } else {
    alert(result.error);
  }
};
</script>
```

## ✅ Ưu Điểm Của Kiến Trúc Này

### 1. **Centralized State Management**

- Tất cả state được quản lý tập trung trong store
- Dễ dàng truy cập từ bất kỳ component nào
- Tránh prop drilling

### 2. **Reusability**

- Logic có thể tái sử dụng ở nhiều component
- Không cần viết lại code fetch/update

### 3. **Validation Tập Trung**

- Tất cả validation logic ở một nơi
- Đảm bảo tính nhất quán
- Dễ maintain và update

### 4. **Error Handling**

- Xử lý lỗi thống nhất
- Error state được quản lý trong store
- Component chỉ cần hiển thị

### 5. **Loading State**

- Loading state tự động
- Không cần quản lý loading ở từng component

### 6. **Type Safety** (nếu dùng TypeScript)

- Dễ dàng thêm types cho store
- IntelliSense hỗ trợ tốt hơn

## 📋 Component Responsibilities

### MyAccountComponent

- ✅ Hiển thị UI
- ✅ Handle user interactions
- ✅ Gọi store actions
- ❌ KHÔNG trực tiếp call API
- ❌ KHÔNG validate data (store làm việc này)

### MyAddressComponent

- ✅ Hiển thị danh sách địa chỉ
- ✅ Handle form interactions
- ✅ Gọi store actions
- ❌ KHÔNG trực tiếp call API
- ❌ KHÔNG validate data

## 🔄 Data Flow

```
User Action → Component Method → Store Action → API Call → Update Store State → Component Re-renders
```

## 🎨 Best Practices

1. **Luôn sử dụng computed properties** khi lấy data từ store
2. **Không mutate store state trực tiếp** - luôn dùng actions
3. **Handle errors** từ store actions
4. **Show loading states** khi call actions
5. **Reset state** khi logout

## 🔧 Maintenance

Khi cần thêm tính năng mới:

1. Thêm action vào store
2. Thêm validation nếu cần
3. Update component để sử dụng action mới
4. Test thoroughly

## 📝 Notes

- Store tự động reset khi user logout
- Validation được thực hiện ở store level
- Error messages được return từ actions, không throw
- Loading state tự động quản lý cho mọi action
