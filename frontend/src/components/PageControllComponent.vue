<script setup>

import { useProductStore } from '@/stores/productStore';

const productStore = useProductStore();

const handlePrePage = () => {
    productStore.handlePrePage();
}

const handlenextPage = () => {
    productStore.handleNextPage();
}  

</script>

<template>
    <div class=" flex justify-center items-center w-[72px] h-[36px] bg-white rounded-sm">
        <i  v-if="productStore.pageCurrent === 1" @click="handlenextPage" class=" hover:text-[var(--primary-color)] text-[#555] w-[72px] text-center  text-[1.2rem] fa-solid fa-angle-right"></i>
        
        <template v-if="productStore.pageCurrent !== 1 && productStore.pageCurrent !== productStore.totalPages">
            <div @click="handlePrePage" class="flex ">
                <i class=" hover:text-[var(--primary-color)] text-[#555]  text-[1.2rem] fa-solid fa-angle-left"></i>
            </div>
            <span class="border-r-[1px] border-[#EEE] h-full mx-3"></span>
            <div @click="handlenextPage" class="flex  ">
                <i class=" hover:text-[var(--primary-color)] text-[#555]  text-[1.2rem] fa-solid fa-angle-right"></i>
            </div>  
        </template>
        
        <i v-if="productStore.pageCurrent === productStore.totalPages" @click="handlePrePage" class=" hover:text-[var(--primary-color)]  text-[#555]  w-[72px] text-center text-[1.2rem] fa-solid fa-angle-left"></i>

    </div>
</template>