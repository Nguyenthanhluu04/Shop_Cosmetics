<script setup>
import { useProductStore } from '@/stores/productStore';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { useCartStore } from '@/stores/cartStore'; 
import { useRouter } from 'vue-router';

const router = useRouter();

const route = useRoute();

const productStore = useProductStore();
const cartStore = useCartStore();


const id = route.params.id;
const quantity = ref(1);


onMounted( ()=>{
    productStore.handleProductDetails(id);
})


const increase = () => {
    quantity.value++;
}

const decrease = () => {
    if(quantity.value > 1){
        quantity.value--;
    }
}

const addToCart = async (productId,styleAdd) => {

  const ok =  await cartStore.handleAddToCart(productId,quantity.value) 

  if(ok) {
    cartStore.getCartItems();
    router.push({name: 'CartPage'})
  }

}


</script>

<template>
  
        <div class="flex justify-center">
            <div v-for="(product) in productStore.productDetails" :key="product.id" class="relative  w-[1000px] h-[650px] bg-white rounded-md my-8 flex justify-center">
                
                    <div class=" mt-[-15px] ml-[20px] w-[40%] h-[500px] bg-center bg-no-repeat bg-contain"
                    :style="{backgroundImage: `url(${product.urlImg })`}"></div>

                    <div class="w-[52%] h-[500px] float-right mt-5 mr-[30px]">
                        <h2 class="text-[22px] text-black font-light leading-6 m-0">{{ product.title }}</h2>
                        <div class="flex mt-4">
                            <div class="flex items-center">
                                <span class="text-[16px] text-red-600 mr-1 mt-[1px]">5</span>
                                <div class="text-[13px] relative">
                                    <i class="fa-solid fa-star text-yellow-400"></i>
                                    <i class="fa-solid fa-star text-yellow-400"></i>
                                    <i class="fa-solid fa-star text-yellow-400"></i>
                                    <i class="fa-solid fa-star text-yellow-400"></i>
                                    <i class="fa-solid fa-star text-yellow-400"></i>
                                    <div class="absolute border-r border-gray-400 h-6 right-[-20px] top-[-5px]"></div>
                                </div>
                            </div>

                            <div class="flex ml-10 items-baseline">
                                <span class="text-[16px] text-red-600 mr-1">{{ product.evaluate }}</span>
                                <span class="text-[15px] text-gray-500 relative after:content-[''] after:absolute after:border-r after:border-gray-400 after:h-6 after:right-[-20px] after:top-[-5px]">
                                    Đánh Giá
                                </span>
                            </div>

                            <div class="flex ml-10 items-baseline">
                                <span class="text-[16px] text-red-600 mr-1">{{ product.sold }}</span>
                                <span class="text-[15px] text-gray-500">Đã Bán</span>
                            </div>
                        </div>

                        <div class="flex items-center flex-wrap mt-4 bg-[#fafafa] h-[50px] px-2">
                            <span class="text-[15px] line-through text-gray-500 mr-2">{{product.priceOld}}đ</span>
                            <span class="text-[26px] text-red-600">{{product.priceNew}}đ</span>
                            <span class="bg-[#d0011b] text-white text-[14px] font-medium px-2 ml-5 rounded-sm h-[20px] leading-5">{{Math.round(product.priceDiscount)}}% GIẢM</span>
                        </div>

                        <div class="flex items-center mt-6">
                            <span class=" w-[150px] text-[16px] font-light text-black">Mã Giảm của Shop</span>
                            <ul class="flex  list-none ">
                                <li class="bg-[rgba(208,1,27,0.09)] text-[#d0011b] mr-3 text-[16px] p-1 rounded-sm cursor-pointer">
                                    Giảm {{product.discount}}k
                                </li>
                            </ul>
                        </div>

                        <div class="flex items-center mt-5">
                            <span class="  w-[150px] text-[16px] font-light text-black">Deal sốc</span>
                            <span class="bg-[rgba(208,1,27,0.09)] text-[#d0011b] text-[16px] p-1 rounded-sm cursor-pointer"> Mua kèm Deal Sốc</span>
                        </div>

                        <div class="flex items-center mt-[18px]">
                            <span class="text-[16px] font-light text-black  w-[150px]">Kích Cỡ</span>
                            <ul class="flex flex-wrap list-none my-[6px]">
                                <li class="flex items-center border border-[#eeeaea] h-[40px] cursor-pointer  hover:border-[#cecaca]">
                                    <div class="flex justify-center items-center relative px-4">
                                        <div
                                            class="absolute w-[20%] h-[24px] bg-contain bg-center bg-no-repeat left-1"
                                           :style="{backgroundImage: `url(${product.urlImg})`}" >
                                        </div>
                                        <span class="text-[16px] ml-6 font-light text-black"> Kích Cỡ - {{product.size}}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div class="flex items-center mt-[18px]">
                            <span class=" w-[150px] text-[16px] font-light text-black">Số Lượng</span>
                            <div class="border border-[#cecaca] h-[28px] w-[114px]">
                                <div class="relative h-[28px] flex  justify-center items-center">
                                    <button @click="decrease()" class="flex-1 justify-center items-center cursor-pointer bg-none border-none ">
                                        <i class="fa-solid fa-minus"></i>
                                    </button>
                                    <span class="flex-2 mx-5  text-[14px]relative before:content-[''] before:absolute before:border-l before:border-[#cecaca] before:h-[28px] before:left-[30px] before:-top-[1px]  
                                    after:content-[''] after:absolute after:border-l after:border-[#cecaca] after:h-[28px] after:-top-[1px] after:right-[30px]"> {{ quantity }}</span>
                                    <button @click="increase" class="flex-1 cursor-pointer bg-none border-none ">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <span class="text-[14px] text-gray-500 ml-2"> {{product.available}} sản phẩm có sẵn</span>
                        </div>

                        <div class="flex items-center mt-8">
                            <button
                             @click="addToCart(product.id,'addToCart')"
                            class="flex justify-center items-center bg-[rgba(208,1,27,0.09)] border border-[#d0011b] text-[#d0011b] text-[16px] font-light px-2 py-2 rounded-sm cursor-pointer no-underline">
                            <i class="fa-solid fa-cart-shopping mr-2"></i>
                            Thêm Vào Giỏ Hàng
                            </button>
                            <button
                             @click="addToCart(product.id,'buyNow')"
                            class="bg-[#d0011b] text-white text-[16px] px-10 py-2 ml-4 rounded-sm no-underline">
                            Mua Ngay
                            </button>
                        </div>
                </div>
        </div>
    </div>
    

</template>