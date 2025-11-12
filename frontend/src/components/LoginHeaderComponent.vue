<script setup>

</script>

<template>
    <div>
         <header class="h-[82px] bg-white">
               <div class="w-[var(--width-base)] max-w-full mx-auto">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center  ">
                            <router-link :to="{name: 'HomePage'}" >
                                <img class="w-[90px] h-[90px] cursor-pointer" src="../assets/img/logo.png" alt="logo">
                            </router-link>
                            <h1 class="font-medium text-[1.6rem] text-[var(--primary-color)]">Beauty Shop</h1>
                        </div>
                        <div>
                             <h1 class="font-medium text-[1.6rem] text-[var(--primary-color)]">Đăng Nhập</h1>
                        </div>
                    </div>
               </div>
         
        </header>
    </div>
</template>