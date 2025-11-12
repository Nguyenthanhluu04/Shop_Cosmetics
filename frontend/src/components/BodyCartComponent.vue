<script setup>
import { useCartStore } from '@/stores/cartStore';
import { onMounted } from 'vue';

const cartStore = useCartStore();

onMounted(() => {
    cartStore.getCartItems();
})

const handleIncrease = async (productId) => {
  await cartStore.increaseQuantity(productId);
}

const handleDecrease = async (productId) => {
  await cartStore.decreaseQuantity(productId);
}

const handleRemove = async (productId) => {
  await cartStore.removeCartItem(productId);
}

</script>

<template>
 <div class="bg-white  py-10">

  <div class="bg-white rounded-lg shadow-sm p-4 mx-auto max-w-6xl">
    <div class="flex justify-between text-gray-500 font-medium border-b pb-2">
      <div class="w-1/3">Sản Phẩm</div>
      <div class="w-1/6 text-center">Đơn Giá</div>
      <div class="w-1/6 text-center">Số Lượng</div>
      <div class="w-1/6 text-center">Tổng Tiền</div>
      <div class="w-1/6 text-center">Thao Tác</div>
    </div>

    <div v-for="(item) in cartStore.listCartItems" :key="item.id" class="flex items-center justify-between py-4 border-b">

      <div class="flex items-center gap-4 w-1/3">
        <img
          :src= "item.urlImg"
          alt="product"
          class="w-14 h-20 object-contain"
        />
        <span class="text-gray-800 text-sm font-medium leading-snug">
         {{ item.title }}
        </span>
      </div>

      <div class="w-1/6 text-center text-gray-800 font-medium">
        {{ item.priceNew }}
      </div>

      <div class="w-1/6 flex justify-center">
        <div class="border border-[#cecaca] h-[28px] w-[114px]">
                <div class="relative h-[28px] flex  justify-center items-center">
                    <button @click="handleDecrease(item.product_id)" class="flex-1 justify-center items-center cursor-pointer bg-none border-none ">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    <span class="flex-2 mx-5  text-[14px]relative before:content-[''] before:absolute before:border-l before:border-[#cecaca] before:h-[28px] before:left-[30px] before:-top-[1px]  
                    after:content-[''] after:absolute after:border-l after:border-[#cecaca] after:h-[28px] after:-top-[1px] after:right-[30px]"> {{ item.quantity }}</span>
                    <button @click="handleIncrease(item.product_id)" class="flex-1 cursor-pointer bg-none border-none ">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
      </div>

      <div class="w-1/6 text-center text-red-500 font-semibold">{{ item.totalPrice }}đ</div>

      <div class="w-1/6 text-center">
        <button @click="handleRemove(item.product_id)" class="text-red-500 hover:text-red-700 font-medium">Xóa</button>
      </div>
    </div>

    
        <div class="flex justify-center items-center pt-6">
            <div class="flex items-center justify-around gap-10">
                <span class="text-gray-700 text-lg font-medium">Tổng thanh toán :</span>
                <span class="text-xl font-bold text-red-500">{{ cartStore.totalAmount }}đ</span>
                <button
                class="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition">Mua Ngay</button>
            </div>
        </div>
  </div>
</div>


</template>