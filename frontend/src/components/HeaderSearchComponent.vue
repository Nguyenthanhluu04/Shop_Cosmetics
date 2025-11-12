<script setup>

</script>

<template>
       <div class=" flex items-center group h-10 bg-white rounded-sm flex-1">
            <div class="flex-1 relative">                
                <input type="text" class=" relative pl-2 border-none rounded-sm w-full h-full  text-[var(--text-color)] placeholder-[#777] " placeholder=" Tìm kiếm sản phẩm trong shop">     
                <div class="absolute hidden group-focus-within:block w-[calc(100%-16px)] top-[calc(100%+5px)] bg-white rounded-sm z-10 shadow-md ">
                    <div class="text-[#999] my-2 pl-3 ">Lịch sử tìm kiếm</div>
                    <ul class="block ">
                        <li class="py-2 pl-3 hover:bg-[#f5f4f4] cursor-pointer ">Kem dưỡng da chính hãng</li>
                        <li class="py-2 pl-3 hover:bg-[#f5f4f4] cursor-pointer  "> Son môi chính hãng</li>
                    </ul>
                </div>
            </div>
            <button class="bg-[var(--primary-color)] w-[60px] h-[34px] border-none rounded-sm mr-[3px]">
            <i class=" text-white fa-solid fa-magnifying-glass" ></i>  
            </button>
        </div> 
</template>