<script setup>
import { ref } from 'vue';

import { useTodoStore } from '@/stores/todoStore';

const todoStore = useTodoStore();


const isOpen = ref(false)
const currentSortText = ref('RANDOM')


const handleSortTodo = async (sortBy,order) => {

   await todoStore.sortTodo(sortBy,order);

   if(sortBy == 'task'){
    currentSortText.value = `NAME - ${order}`
   }else if(sortBy == 'level'){
    currentSortText.value = `LEVEL - ${order}`
   }
 
}

</script>

<template>
    <div class="relative mb-4">
        <button @click="isOpen = !isOpen" class="py-[7px] px-3 bg-[#777] text-white rounded-md font-bold "> Sort By </button>
        <span class="py-2 px-3 bg-[#28aa28] text-white rounded-md font-bold ml-3  "> {{ currentSortText }}</span>

        <div v-if="isOpen" class=" absolute mt-2 w-[200px] rounded-md shadow-lg bg-white ring-1 ring-gray-100 z-10">
                <div class="py-1 cursor-pointer">
                    <div @click="handleSortTodo('task','ASC')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">NAME ASC</div>
                    <div @click="handleSortTodo('task','DESC')" class="block  px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">NAME DESC</div>
                    <div class="border-t-[1px] border-gray-200"></div>
                    <div @click="handleSortTodo('level','DESC')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">LEVEL ASC</div>
                    <div @click="handleSortTodo('level','ASC')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">LEVEL DESC</div>
                </div>
        </div>

    </div>
</template>