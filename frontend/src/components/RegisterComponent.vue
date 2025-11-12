<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const router = useRouter();

const userName = ref('')
const email = ref('')
const password = ref('')

const handleRegister = async () => {
 const ok =  await userStore.handleRegister(userName.value,email.value,password.value)
   if(ok) {
   router.push({name:'HomePage'})
   }
}

</script>

<template>
    <div class=" flex min-h-screen items-center justify-around">

        <form @submit.prevent="handleRegister" class=" w-[500px] rounded-md overflow-hidden bg-[#f2e6eb]" >
                <div class="py-0 px-8">
                    <div class="flex justify-between items-center pt-[10px] py-3 pb-0 ">
                    <h3 class="text-[1.6rem] font-medium text-[var(--text-color)]">Đăng ký</h3>
                    <router-link :to="{name: 'LoginPage'}" class=" text-[1.2rem] text-[var(--primary-color)] cursor-pointer" >Đăng nhập</router-link>
                    </div>
                <div class="mt-5">
                        <input type="text" v-model="userName" class="w-full mb-3 border-[var(--border-color)] text-[var(--text-color)] hover:border-[#999]" placeholder="Nhập tên tài khoản của bạn">
                        <input type="email" v-model="email" class="w-full mb-3 border-[var(--border-color)] text-[var(--text-color)] hover:border-[#999]" placeholder="Nhập Email của bạn">
                        <input type="password" v-model="password" class="w-full  border-[var(--border-color)] text-[var(--text-color)]" placeholder="Nhập mật khẩu của bạn">
                </div>
                <div class="flex justify-end mt-4">
                    <span class="text-[#777] ">Bạn đã có tài khoản?</span>
                    <span class="border-r-[1px] border-[#999] h-4 mx-2 mt-1 "></span>
                    <router-link :to="{name: 'LoginPage'}" class=" text-[var(--primary-color)] font-medium cursor-pointer">Đăng Nhập</router-link>
                </div>
                <div class="flex justify-end my-10">
                    <router-link :to="{name: 'HomePage'}" class="w-[120px] py-1 px-2 bg-white rounded-sm text-center cursor-pointer hover:bg-[#cbcbcb]" >TRỞ LẠI</router-link>

                    <button type="submit" class="w-[120px] py-1 px-2 bg-[var(--primary-color)] rounded-sm text-white ml-3">ĐĂNG KÝ </button>                 
                </div>
            </div>
            <div class=" flex justify-between p-8 w-full bg-[#e1dfdf] py-3">
                <a href="https://www.facebook.com/manh.luu.127648?mibextid=LQQJ4d" class=" w-[180px] flex items-center py-1 px-2 rounded-sm bg-[#3A5A98] text-white hover:bg-[#3A5A98]">
                    <i class="fa-brands fa-square-facebook text-xl mr-2"></i>
                    <span class="">
                        Kết nối với Facebook
                    </span>      
                </a>
                <a href="" class="flex items-center py-1 px-2 rounded-sm bg-[#f2e6eb] w-[180px] hover:bg-[#f2e6eb]">
                    <i class=" fa-brands fa-google text-xl text-[var(--primary-color)]  mr-2"></i>
                    <span class="text-[#333]">
                        Kết nối với Google
                    </span>
                </a>
        </div>
        </form> 
    </div>
   
</template>

<style>

</style>