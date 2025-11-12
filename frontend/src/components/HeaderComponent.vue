<script setup>
import HeaderSearchComponent from './HeaderSearchComponent.vue';
import CartComponent from './CartComponent.vue';
import InforUserComponent from './InforUserComponent.vue';
import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();

</script>

<template>
    <div>
        <header class="h-[120px] bg-[var(--header-color)]">
               <div class="w-[var(--width-base)] max-w-full mx-auto">
                  <div class="flex justify-between items-center  h-[var(--navbar-height)] text-white ">
                      <ul class="flex items-center gap-3 text-[14px] font-light mt-2 ">
                          <li class="relative group cursor-pointer hover:text-white/70">Tải ngay ứng dụng TL-shop

                            <div class="after:absolute after:block after:content-[''] after:w-full after:h-4  after:right-0 after:top-5"></div>
                            <div class="absolute top-7 pointer-events-none group-hover:pointer-events-auto  opacity-0  group-hover:opacity-100 duration-500 transition-opacity    ">
                                <a href="" > <img class="w-full" src="../assets/img/img-QR.png" alt="QR-app"></a>
                                <div class="flex items-center gap-3 py-1 px-3 bg-[var(--white-color)] rounded-bl-sm rounded-br-sm shadow-md">
                                    <a href="" ><img class="" src="../assets/img/img-ggplay.png" alt=""></a>
                                    <a href=""><img src="../assets/img/img-appstore.png" alt=""></a>
                                </div>
                            </div>

                          </li>
                          <li class="border-r-[1px] border-[#FB9086] h-4  mt-1 "></li>
                          <li class="flex items-center gap-3 ">
                              <span class="text-[14px]" >Kết Nối</span>
                              <a href="#" class="hover:opacity-70 "><i class="mt-[4px] text-[18px]  fa-brands fa-facebook"></i></a>
                              <a href="#" class="hover:opacity-70"><i class=" mt-[4px] text-[18px] fa-brands fa-instagram"></i></a>
                          </li>
                        
                      </ul>
                      <ul class="flex items-center gap-3 mt-2 ">
                          <li>
                            <a href="" class="hover:opacity-70 font-light text-[14px]"> 
                              <i class="  translate-y-[2px]  mr-[2px] text-[18px] fa-solid fa-bell"></i> 
                              Thông Báo
                            </a>
                          </li>
                          <li>
                            <a href="" class="font-light hover:opacity-70 text-[14px]"> <i class=" translate-y-[2px]  mr-[2px]  text-[18px] fa-solid fa-circle-question"></i> Trợ Giúp </a>
                          </li>
                          <li v-if="userStore?.userInfor">
                            <infor-user-component ></infor-user-component>                 
                          </li>
                          <div v-else-if="!userStore?.userInfor" class="flex gap-3">
                              <router-link :to="{name: 'RegisterPage'}" class="font-medium cursor-pointer hover:opacity-70">Đăng Ký</router-link>
                              <li class="border-r-[1px] border-[#FB9086] h-4  mt-1 "></li>
                              <router-link :to="{name: 'LoginPage'}" class="font-medium cursor-pointer hover:opacity-70">Đăng Nhập</router-link>
                          </div>
                      
                      </ul>
                  </div>
               </div>
               <div class=" flex   items-center w-[var(--width-base)] max-w-full h-[var(--header-with-search-height)] mx-auto ">              
                      <router-link :to="{name: 'HomePage'}" class="w-[200px]">
                         <img src="../assets/img/logobeauty.png" class="  h-[120px] w-[170px] pr-[10px] mb-8 " alt="logo">
                      </router-link >  
                      <header-search-component></header-search-component>                  
                    <cart-component></cart-component>
               </div>
        </header>
    </div>
</template>

