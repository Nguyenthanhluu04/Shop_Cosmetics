<script setup>
import { useProductStore } from '@/stores/productStore';

const productStore = useProductStore();


const handleGoToPage = (page) => {
    productStore.handleGoToPage(page);
}

const handlePrePage = () => {
    productStore.handlePrePage();
}

const handlenextPage = () => {
    productStore.handleNextPage();
}  


</script>

<template>
        <ul  class="flex gap-7  justify-center ">
            <li v-if="productStore.pageCurrent !== 1" @click="handlePrePage" class="hover:text-[var(--primary-color)] h-[30px] min-w-10 text-center text-[1.4rem] text-[#939393] cursor-pointer"><i class=" fa-solid fa-chevron-left"></i></li>
            <li v-for="(page, index) in productStore.totalPages" :key="index" @click="handleGoToPage(page)" 
            :class="[page === productStore.pageCurrent ? 'h-[30px] min-w-10 text-center text-white leading-[28px] text-[1.4rem] rounded-sm bg-[var(--primary-color)] cursor-pointer' 
            : 'hover:text-[var(--primary-color)] h-[30px] min-w-7 text-center  text-[1.4rem] text-[#939393] cursor-pointer' ]">{{ page }}</li>       
            <li v-if="productStore.pageCurrent !== productStore.totalPages" @click="handlenextPage" class="hover:text-[var(--primary-color)] h-[30px] min-w-10 text-center text-[1.4rem] text-[#939393] cursor-pointer"><i class=" fa-solid fa-chevron-right"></i></li>
        </ul>
</template>
