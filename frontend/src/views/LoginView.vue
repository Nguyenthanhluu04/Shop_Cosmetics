<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

import { useRouter } from 'vue-router'

const router = useRouter();

const email = ref('')
const password = ref('')
const userStore = useUserStore()

const handleLogin = async () => {
  await userStore.login(email.value, password.value)
  
  if (!userStore.error) {
    router.push( {name: 'HomeView' }) 
  }
}
</script>

<template>
  <div class="w-[1280px]  flex justify-center">
    <div class=" flex flex-col items-center w-[350px] p-5 border rounded-md bg-gray-100 border-gray-200 shadow-md ">
        <h1 class="text-center text-2xl font-bold mb-4">Đăng Nhập</h1>
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4 w-80">
          <input v-model="email" placeholder="Nhập Email example@gmail.com" class="border p-2" />
          <input v-model="password" type="password" placeholder=" Nhập Mật khẩu" class="border p-2" />
          <button type="submit" class="bg-[#28aa28]  text-white py-2 rounded hover:bg-[#259325]">Đăng Nhập</button>
          <router-link :to="{name: 'RegisterView'}" class="bg-[#21b1b1] text-white py-2 rounded hover:bg-[#259f9f] text-center"> Đăng Ký</router-link>
        </form>
        <p v-if="userStore.error" class="text-red-500 mt-2">{{ userStore.error }}</p>
    </div>
  </div>
</template>


