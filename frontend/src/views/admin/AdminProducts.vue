<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
      <button 
        @click="openCreateModal"
        class="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        <i class="fas fa-plus mr-2"></i>
        Thêm sản phẩm
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input 
            v-model="searchQuery"
            @input="handleSearch"
            type="text" 
            placeholder="Tìm kiếm sản phẩm..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
          >
        </div>
        <div>
          <select 
            v-model="selectedCategory"
            @change="handleFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
          >
            <option value="">Tất cả danh mục</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.loaisanpham }}
            </option>
          </select>
        </div>
        <div>
          <select 
            v-model="itemsPerPage"
            @change="handleFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
          >
            <option :value="10">10 sản phẩm/trang</option>
            <option :value="20">20 sản phẩm/trang</option>
            <option :value="50">50 sản phẩm/trang</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
        <p class="mt-2 text-gray-500">Đang tải...</p>
      </div>

      <div v-else-if="products.length === 0" class="p-8 text-center text-gray-500">
        Không có sản phẩm nào
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đã bán</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Có sẵn</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <img 
                  :src="product.urlImg || '/placeholder.png'" 
                  :alt="product.title"
                  class="w-12 h-12 object-cover rounded"
                  @error="e => e.target.src = '/placeholder.png'"
                >
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{{ product.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ product.categoryName || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  <div class="font-semibold text-[var(--primary-color)]">{{ product.priceNew }}đ</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ product.sold || 0 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-green-100 text-green-700': product.quantity > 0,
                    'bg-red-100 text-red-700': product.quantity <= 0
                  }"
                >
                  {{ product.available || (product.quantity > 0 ? 'Còn hàng' : 'Hết hàng') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="openEditModal(product)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                  title="Sửa"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  @click="confirmDelete(product)"
                  class="text-red-600 hover:text-red-900"
                  title="Xóa"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Hiển thị {{ (pagination.page - 1) * pagination.limit + 1 }} - 
            {{ Math.min(pagination.page * pagination.limit, pagination.total) }} 
            trong tổng số {{ pagination.total }} sản phẩm
          </div>
          <div class="flex gap-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="changePage(page)"
                class="px-3 py-1 border rounded"
                :class="page === pagination.page ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]' : 'border-gray-300 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
              <span v-else class="px-3 py-1">...</span>
            </template>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page === pagination.totalPages"
              class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Create/Edit Product -->
    <AdminModal v-if="showModal" @close="closeModal">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-800">
          {{ isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}
        </h3>
      </template>
      <template #body>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm <span class="text-red-500">*</span></label>
              <input 
                v-model="formData.title"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              >
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">URL hình ảnh</label>
              <input 
                v-model="formData.urlImg"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giá gốc</label>
              <input 
                v-model="formData.priceOld"
                type="text" 
                placeholder="Ví dụ: 100000 hoặc 100.000"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giá bán <span class="text-red-500">*</span></label>
              <input 
                v-model="formData.priceNew"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng <span class="text-red-500">*</span></label>
              <input 
                v-model="formData.quantity"
                type="number" 
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Đã bán</label>
              <input 
                v-model="formData.sold"
                type="number" 
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục <span class="text-red-500">*</span></label>
              <select 
                v-model="formData.iddm"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              >
                <option value="">Chọn danh mục</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.loaisanpham }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
              <input 
                v-model="formData.brand"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Xuất xứ</label>
              <input 
                v-model="formData.nation"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kích cỡ</label>
              <input 
                v-model="formData.size"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giảm giá (%)</label>
              <input 
                v-model="formData.discount"
                type="number" 
                min="0"
                max="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Đánh giá</label>
              <input 
                v-model="formData.evaluate"
                type="number" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              >
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <input 
                v-model="formData.available"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary-color)]"
              >
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button 
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              <i v-if="submitting" class="fas fa-spinner fa-spin mr-2"></i>
              {{ isEditMode ? 'Cập nhật' : 'Tạo mới' }}
            </button>
          </div>
        </form>
      </template>
    </AdminModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminProductStore } from '@/stores/admin/adminProductStore'
import AdminModal from '@/components/admin/AdminModal.vue'

const productStore = useAdminProductStore()

const loading = computed(() => productStore.loading)
const products = computed(() => productStore.products)
const categories = computed(() => productStore.categories)
const pagination = computed(() => productStore.pagination)

const searchQuery = ref('')
const selectedCategory = ref('')
const itemsPerPage = ref(10)
const showModal = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)

const formData = ref({
  id: null,
  title: '',
  urlImg: '',
  priceOld: '',
  priceNew: '',
  quantity: 0,
  sold: 0,
  brand: '',
  nation: '',
  evaluate: 0,
  discount: 0,
  size: '',
  available: '0',
  iddm: ''
})

const visiblePages = computed(() => {
  const pages = []
  const total = pagination.value.totalPages
  const current = pagination.value.page
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})



let searchTimeout = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadProducts()
  }, 500)
}

const handleFilter = () => {
  loadProducts()
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    loadProducts(page)
  }
}

const loadProducts = async (page = 1) => {
  await productStore.fetchProducts({
    page,
    limit: itemsPerPage.value,
    search: searchQuery.value,
    category: selectedCategory.value
  })
}

const openCreateModal = () => {
  isEditMode.value = false
  resetForm()
  showModal.value = true
  console.log('Opening create modal, form data:', formData.value)
}

const openEditModal = (product) => {
  isEditMode.value = true
  console.log('Opening edit modal for product:', product)
  formData.value = {
    id: product.id,
    title: product.title,
    urlImg: product.urlImg || '',
    priceOld: product.priceOld || '',
    priceNew: product.priceNew,
    quantity: product.quantity,
    sold: product.sold || 0,
    brand: product.brand || '',
    nation: product.nation || '',
    evaluate: product.evaluate || 0,
    discount: product.discount || 0,
    size: product.size || '',
    available: product.available || '',
    iddm: product.iddm
  }
  showModal.value = true
  console.log('Form data set to:', formData.value)
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    urlImg: '',
    priceOld: '',
    priceNew: '',
    quantity: 0,
    sold: 0,
    brand: '',
    nation: '',
    evaluate: 0,
    discount: 0,
    size: '',
    available: '',
    iddm: ''
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    // Chuẩn hóa dữ liệu trước khi gửi - giữ giá dưới dạng string
    const payload = {
      title: formData.value.title,
      urlImg: formData.value.urlImg || null,
      priceOld: formData.value.priceOld || null,
      priceNew: formData.value.priceNew,
      quantity: Number(formData.value.quantity),
      sold: formData.value.sold || '0',
      brand: formData.value.brand || null,
      nation: formData.value.nation || null,
      evaluate: formData.value.evaluate || '0',
      discount: formData.value.discount || '0',
      size: formData.value.size || null,
      available: formData.value.available || 'Còn hàng',
      iddm: Number(formData.value.iddm)
    }

    console.log('Submitting product:', payload)

    if (isEditMode.value) {
      await productStore.updateProduct(formData.value.id, payload)
      alert('Cập nhật sản phẩm thành công!')
      await loadProducts(pagination.value.page) // Reload lại trang hiện tại
    } else {
      await productStore.createProduct(payload)
      alert('Thêm sản phẩm thành công!')
      await loadProducts(1) // Load lại từ trang 1
    }
    closeModal()
  } catch (err) {
    alert(err.message || 'Có lỗi xảy ra!')
    console.error('Submit error:', err)
  } finally {
    submitting.value = false
  }
}

const confirmDelete = async (product) => {
  if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.title}"?`)) {
    try {
      await productStore.deleteProduct(product.id)
      alert('Xóa sản phẩm thành công!')
      await loadProducts(pagination.value.page) // Reload lại trang hiện tại
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra khi xóa sản phẩm!')
      console.error('Delete error:', err)
    }
  }
}

onMounted(async () => {
  await productStore.fetchCategories()
  await loadProducts()
})
</script>

<style scoped>
:root {
  --primary-color: #ec4899;
}
</style>
