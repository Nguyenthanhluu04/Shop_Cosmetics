<script setup>
import { useProductStore } from '@/stores/user/productStore';

const productStore = useProductStore();

const  handleSort = (sortType) => {
    productStore.handleSort(sortType)
}

</script>

<template>
    <div class=" flex justify-evenly items-center w-[450px] ">
        <div class="  py-1   px-2 text-[#555]">Sắp xếp theo</div>
        <div @click="handleSort('newest')" class="rounded-sm py-[6px] px-2 shadow-sm cursor-pointer" :class="[productStore.sortType === 'newest'? 'bg-[var(--primary-color)] text-white' : 'hover:text-[var(--primary-color)] text-[var(--text-color)] bg-white']">Mới Nhất</div>
        <div @click="handleSort('lowest')" class="rounded-sm py-[6px] px-2 shadow-sm cursor-pointer" :class="[productStore.sortType === 'lowest'? 'bg-[var(--primary-color)] text-white' : 'hover:text-[var(--primary-color)] text-[var(--text-color)] bg-white']">Giá Tăng Dần</div>
        <div @click="handleSort('highest')" class="rounded-sm py-[6px] px-2 shadow-sm cursor-pointer" :class="[productStore.sortType === 'highest'? 'bg-[var(--primary-color)] text-white' : 'hover:text-[var(--primary-color)] text-[var(--text-color)] bg-white']">Giá Giảm Dần</div>
    </div>
</template>