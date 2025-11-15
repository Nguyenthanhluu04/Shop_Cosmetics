<script setup>
import { ref, watch } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useRouter } from 'vue-router'

const productStore = useProductStore()
const router = useRouter()

const searchInput = ref('')
const showDropdown = ref(false)
const isInputFocused = ref(false)

let debounceTimeout = null

// gọi api tìm kiếm khi người dùng ngừng gõ 300ms
watch(searchInput, (newValue) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  
  debounceTimeout = setTimeout(() => {
    if (newValue && newValue.trim()) {
      productStore.handleSearchProducts(newValue)
    } else {
      productStore.searchResults = []
    }
  }, 300)
})

const handleSearch = () => {
  if (searchInput.value && searchInput.value.trim()) {
    productStore.addSearchHistory(searchInput.value)
    showDropdown.value = false
  }
}

const handleHistoryClick = async (query) => {
  searchInput.value = query
  await productStore.handleSearchProducts(query)
  productStore.addSearchHistory(query)
  // Giữ dropdown mở để hiển thị kết quả
  showDropdown.value = true
}

const handleResultClick = (productId) => {
  if (searchInput.value && searchInput.value.trim()) {
    productStore.addSearchHistory(searchInput.value)
  }
  showDropdown.value = false
  router.push(`/ProductDetails/${productId}`)
}

const removeHistory = (query, event) => {
  event.stopPropagation()
  productStore.removeSearchHistoryItem(query)
}

const clearAllHistory = () => {
  productStore.clearSearchHistory()
}

const handleFocus = () => {
  isInputFocused.value = true
  showDropdown.value = true
}

const handleBlur = () => {
  // Delay để click event có thể được xử lý
  setTimeout(() => {
    isInputFocused.value = false
    showDropdown.value = false
  }, 200)
}
</script>

<template>
  <div class="flex items-center group h-10 bg-white rounded-sm flex-1">
    <div class="flex-1 relative">
      <input 
        v-model="searchInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="handleSearch"
        type="text" 
        class="relative pl-2 border-none rounded-sm w-full h-full text-[var(--text-color)] placeholder-[#777]" 
        placeholder="Tìm kiếm sản phẩm trong shop"
      >
      
      <!-- Dropdown -->
      <div 
        v-if="showDropdown" 
        @mousedown.prevent
        class="absolute w-[calc(100%-16px)] top-[calc(100%+5px)] bg-white rounded-sm z-10 shadow-md max-h-[400px] overflow-y-auto"
      >
        <!-- Kết quả tìm kiếm -->
        <div v-if="searchInput && productStore.searchResults.length > 0">
          <div class="text-[#999] my-2 pl-3 font-semibold">Kết quả tìm kiếm</div>
          <ul class="block">
            <li 
              v-for="product in productStore.searchResults" 
              :key="product.id"
              @click="handleResultClick(product.id)"
              class="py-2 pl-3 hover:bg-[#f5f4f4] cursor-pointer flex items-center gap-2"
            >
              <img 
                v-if="product.urlImg" 
                :src="product.urlImg" 
                :alt="product.title"
                class="w-10 h-10 object-cover rounded"
              >
              <div class="flex-1">
                <div class="text-sm font-medium">{{ product.title }}</div>
                <div class="text-xs text-[var(--primary-color)] font-semibold">
                  {{ product.priceNew }}₫
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Thông báo không tìm thấy -->
        <div v-else-if="searchInput && productStore.searchResults.length === 0" class="py-4 text-center text-[#999]">
          Không tìm thấy sản phẩm phù hợp
        </div>

        <!-- Lịch sử tìm kiếm -->
        <div v-else-if="productStore.searchHistory.length > 0">
          <div class="flex justify-between items-center my-2 pl-3 pr-3">
            <span class="text-[#999]">Lịch sử tìm kiếm</span>
            <button 
              @click="clearAllHistory"
              class="text-xs text-[var(--primary-color)] "
            >
              Xóa tất cả
            </button>
          </div>
          <ul class="block">
            <li 
              v-for="(query, index) in productStore.searchHistory" 
              :key="index"
              @click="handleHistoryClick(query)"
              class="py-2 pl-3 pr-3 hover:bg-[#f5f4f4] cursor-pointer flex justify-between items-center group/item">
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-clock-rotate-left text-[#999] text-sm"></i>
                {{ query }}
              </span>
              <button 
                @click="removeHistory(query, $event)"
                class="opacity-0 group-hover/item:opacity-100  text-[#999] hover:text-red-500 transition-opacity">
                <i class="fa-solid fa-xmark text-[20px]"></i>
              </button>
            </li>
          </ul>
        </div>

        <!-- Không có lịch sử -->
        <div v-else class="py-4 text-center text-[#999]">
          Chưa có lịch sử tìm kiếm
        </div>
      </div>
    </div>
    
    <button 
      @click="handleSearch"
      class="bg-[var(--primary-color)] w-[60px] h-[34px] border-none rounded-sm mr-[3px] hover:opacity-90 transition-opacity"
    >
      <i class="text-white fa-solid fa-magnifying-glass"></i>
    </button>
  </div>
</template>