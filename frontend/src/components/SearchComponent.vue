<script setup>
import { ref, watch } from 'vue';
import { useTodoStore } from '@/stores/todoStore';

const todoStore = useTodoStore();

const searchText = ref('')

const handleClearText = () => {
searchText.value = '';
}

watch(searchText,(newValue) => {
  todoStore.setSearchText(newValue)
})

</script>

<template>
    <div class="flex items-end">
      <input v-model="searchText" type="text" class="w-[390px] sm:w-[400px] rounded-md border-gray-300 focus:border-gray-400 text-gray-600  " placeholder="Searching ... !">
      <button @click="handleClearText" class="border-t-2 border-[#21b1b1] rounded-tr-md rounded-br-md ml-[-4px] py-[9px] px-3 bg-[#21b1b1] text-white">Clear!</button>
    </div>
</template>