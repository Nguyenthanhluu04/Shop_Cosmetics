<script setup>
import { useUserStore } from '@/stores/userStore';
import ButtonComponent from './ButtonComponent.vue';
import { useRouter } from 'vue-router';
import LoginView from '@/views/LoginView.vue';

const router = useRouter();
const userStore = useUserStore();

const username = userStore.userInfo?.username?.toUpperCase() || ''

const handleLogOut = () =>{
    userStore.logOut();
    router.push({name: 'LoginView'}) 
}
  
</script>


<template>
    <div >
        <div class="flex items-center text-[#26a926] md:justify-center ">
            <h1 class=" text-[20px] md:text-[26px] lg:text-[40px]">TODOLIST - PROJECT</h1>
             <h1 v-if="userStore.userInfo" class="text-[20px] md:text-[26px] lg:text-[40px] "> - OF - {{ username }}</h1> 
            <button-component @click="handleLogOut" customClass="bg-red-500 text-white ml-5">LogOut</button-component>
        </div>
        <div class="w-full border-b border-gray-300 mt-2"></div>
    </div>
</template>
