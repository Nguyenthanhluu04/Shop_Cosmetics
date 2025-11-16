<script setup>

import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/user/productStore';
import { onMounted } from 'vue';

const router = useRouter();

const productStore = useProductStore();

onMounted(() => {
    productStore.handleGetProduct();

})

const goToDetails = (id) => {
  const ok =  productStore.handleProductDetails(id);
    
  console.log('ok:',ok);
  
  if(ok) {
    router.push(`ProductDetails/${id}`)
  }
} 

</script>

<template>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 lg:gap-4 ">
            <div v-for="(product) in productStore.listProduct" :key="product.id" @click="goToDetails(product.id)" class=" product__container relative w-full cursor-pointer border   bg-white rounded-br-md rounded-bl-md hover:shadow-md shadow-sm">
                <div class=" pt-[100%] bg-contain bg-no-repeat bg-center" :style="{backgroundImage: `url(${product.urlImg })`}"></div>
                    <div class="pt-2 px-2">
                        <span class=" overflow-hidden line-clamp-2 leading-5 text-[var(--text-color)] ">{{ product.title  }}</span>
                        <div class="flex flex-wrap items-baseline my-1  ">
                            <span class="text-[#767676] text-[1rem] mr-2 line-through">
                                {{ product.priceOld }}
                            </span>
                            <span class="text-[var(--primary-color)] text-[1.1rem]">
                                {{ product.priceNew }}

                            </span>
                        </div>
                        <div class=" flex items-baseline">
                            <span class="flex-1 text-[12px] text-[var(--primary-color)] "> <i class="  fa-solid fa-heart"></i></span>
                            <div class="flex items-center">
                            <i class=" text-[10px] mr-[2px] text-[var(--star-gold-color)] fa-solid fa-star"></i>
                            <i class=" text-[10px] mr-[2px] text-[var(--star-gold-color)] fa-solid fa-star"></i>
                            <i class=" text-[10px] mr-[2px] text-[var(--star-gold-color)] fa-solid fa-star"></i>
                            <i class=" text-[10px] mr-[2px] text-[var(--star-gold-color)] fa-solid fa-star"></i>
                            <i class=" text-[10px] text-[var(--star-gold-color)] fa-solid fa-star"></i>
                            <span class="text-[12px]  ml-[6px] text-[var(--text-color)]"> {{ product.sold }} đã bán</span>
                            </div>
                        </div>
                        <div class="flex justify-between mt-1 items-center text-[#595959] text-[12px]">
                            <span>{{ product.brand }}</span>
                            <span>{{ product.nation }}</span>
                        </div>
                    </div>

                    <div class=" flex  items-baseline absolute pb-[1px] top-[10px] -left-1 rounded-tr-[4px] rounded-br-[4px]  leading-4 font-medium  bg-[var(--primary-color)] text-white pr-1">
                     <i class=" text-[10px] ml-1 mr-[6px] fa-solid fa-check"></i>
                     <span class="text-[12px]">Yêu thích</span>
                     <div class="before:absolute before:content-[''] before:left-0 before:-bottom-[2px] before:border-t-[3px] before:border-l-[3px] before:border-l-transparent    before:border-t-[#a22456] "></div>
                    </div> 
                    <div class=" flex flex-col absolute text-center w-10 h-9 bg-[#FFD840]/95 top-0 right-0 ">
                        <span class="text-[#EE4D2D] text-[14px] font-medium">{{Math.round( product.priceDiscount)}}%</span>
                        <span class="block leading-3 text-white text-[14px] font-bold">SALE</span>
                        <div class="before:absolute before:content-[''] before:-bottom-1 before:left-0 before:border-y-[4px] before:border-x-[20px] before:border-y-transparent before:border-x-[#FFD840]/95"></div>
                    </div>
            </div>

    </div>
</template>

<style scoped>
.product__container:hover {
    transform: translateY(-2px);
    transition: all 0.2s ease-in-out;
}
</style>