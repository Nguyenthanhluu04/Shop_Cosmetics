<script setup>
import CategoryComponent from './CategoryComponent.vue';
import BodySortComponent from './BodySortComponent.vue';
import PageControllComponent from './PageControllComponent.vue';
import ProductComponent from './ProductComponent.vue';
import PaginationComponent from './PaginationComponent.vue';
</script>

<template>
   <main class=" flex w-[1350px] max-w-full mx-auto pt-9">
            <div class="w-2/12 pr-[5px]">
                <CategoryComponent></CategoryComponent>
            </div>
            <div class="w-10/12 pl-[5px] ">
                <div class="flex rounded-sm justify-between px-3 py-3 bg-black/5">
                    <BodySortComponent></BodySortComponent>
                    <PageControllComponent></PageControllComponent>
                </div>
                <div class=" mt-[10px]">
                    <ProductComponent></ProductComponent>
                    <div class="my-10">
                        <PaginationComponent></PaginationComponent>
                    </div>
                </div>
            </div>
   </main>
</template>