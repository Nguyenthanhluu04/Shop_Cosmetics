<script setup>
import { useProductStore } from '@/stores/productStore';
import { onMounted } from 'vue';

const productStore = useProductStore();

onMounted( () => {
    productStore.handleGetCategory();
}

)

const getCategory = (category) => {

   productStore.handleGetProductCategory(category);
}


</script>

<template>
    <nav class=" shadow-sm rounded-sm bg-white">
        <h3 class="flex  items-center py-3 px-4 text-[1.2rem] text-[var(--text-color)] font-bold border-b-[1px] border-black/10">
         <i class=" text-[16px]  mt-[3px] mr-2 fas fa-list"></i>
             Danh mục
        </h3>
      <ul v-for="(category, index) in productStore.listCategory" :key="index" class="px-4 text-[1rem] ">
        <li @click="getCategory(category.id)" class="py-2 cursor-pointer transition-transform  duration-300 hover:translate-x-1 hover:text-[var(--primary-color)]" :class="[productStore.categorys === category.id ? 'text-[var(--primary-color)]  ' : ' ' ]">
          {{ category.loaisanpham }}</li>
      </ul>
    </nav>
</template>