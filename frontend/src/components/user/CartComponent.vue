<script setup>
import { useCartStore } from '@/stores/user/cartStore';
import { computed, onMounted } from 'vue';

const cartStore = useCartStore();

// Tính số sản phẩm (số loại sản phẩm khác nhau) trong giỏ hàng
const totalItems = computed(() => {
  return cartStore.listCartItems.length;
});

// Load giỏ hàng khi component được mount
onMounted(() => {
  cartStore.getCartItems();
});
</script>

<template>
   <router-link :to="{name: 'CartPage'}" class="flex justify-center place-items-center ">
        <div class="w-[150px] flex justify-center cursor-pointer">
            <div class="relative">
                <i class=" text-white text-[24px] fa-solid fa-cart-shopping"></i>
                <span class="absolute  bg-white text-[var(--primary-color)] text-[1rem] top-[-14px] right-[-17px] border-[#EE4D2D] border-[2px]  py-[1px] px-[7px] rounded-[10px] leading-[1rem]">{{ totalItems }}</span>
            </div>
        </div>
        
   </router-link> 
</template> 