<script setup>
import LoginComponent from '@/components/LoginComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import LoginHeaderComponent from '@/components/LoginHeaderComponent.vue';

</script>

<template>
    <div>
        <LoginHeaderComponent></LoginHeaderComponent>
        <div class=" flex justify-center items-center h-[600px]  bg-[#f52e6a] ">
            <img class="w-600px] h-[600px] rounded-[50%] -mr-44 " src="https://media.istockphoto.com/id/986427374/vi/vec-to/%C6%B0u-%C4%91%C3%A3i-%C4%91%E1%BA%B7c-bi%E1%BB%87t-gi%E1%BA%A3m-gi%C3%A1-50-cho-l%E1%BB%97-trong-h%C3%ACnh-%E1%BA%A3nh-vector-n%E1%BB%81n-gi%E1%BA%A5y-m%C3%A0u-h%E1%BB%93ng.jpg?s=1024x1024&w=is&k=20&c=DDiPZod_GHlombitnYmWwuMzZ1srrpvSSX9b9xzo2fA=" alt="">
                      <LoginComponent></LoginComponent>
        </div>
         <FooterComponent></FooterComponent>
    </div>
</template>