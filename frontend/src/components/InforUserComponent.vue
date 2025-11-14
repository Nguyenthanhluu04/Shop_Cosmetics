<script setup>
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const handleLouOut =  () => {
  userStore.handleLogOut();
};

const goToProfile = () => {
  router.push('/UserProfile');
};

const goToAddress = () => {
  router.push({ name: 'UserProfilePage', query: { tab: 'address' } });
};
</script>

<template>
    <div>
        <li class=" relative flex items-center gap-2 cursor-pointer group ">
                                <img class="w-[22px] h-[22px] rounded-[50%] " src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-260nw-1913928688.jpg" alt="ảnh avatar">
                                <span class="font-medium text-[16px] group-hover:opacity-70 ">{{ userStore?.userInfor?.userName }}</span>

                                <div class=" opacity-0  group-hover:opacity-100 before:absolute before:content-[''] before:border-[18px] before:border-x-transparent before:border-t-transparent before:border-b-[#fff]  before:right-5 before:top-[6px]"></div>
                                <div class="after:absolute after:block after:content-[''] after:w-full after:h-4  after:right-0 after:top-5"></div>
                                <ul class="hidden z-10 group-hover:block absolute rounded-sm w-[160px] bg-[var(--white-color)] text-[#666] top-9 right-0">
                                  <li @click="goToProfile" class="px-3 py-1 font-normal hover:text-[var(--primary-color)] cursor-pointer">Tài khoản của tôi</li>
                                  <li @click="goToAddress" class="px-3 py-1 font-normal hover:text-[var(--primary-color)] cursor-pointer">Địa chỉ của tôi</li>
                                  <li class="px-3 py-1 font-normal hover:text-[var(--primary-color)] cursor-pointer">Đơn hàng của tôi</li>
                                  <li class="pt-1 border-t-[1px] border-black/10"></li>
                                  <li @click="handleLouOut" class="px-3 py-1 font-normal hover:text-[var(--primary-color)] cursor-pointer">Đăng xuất</li>
                                </ul>
        </li>
    </div>
</template>