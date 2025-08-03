<script setup>

import { useFormStore } from '@/stores/useFormStore';

const formStore = useFormStore();

</script>

<template>
    <div class="mt-4 lg:mt-0 mb-4">
        <button v-if="formStore.isShowForm == false" @click="formStore.handleIsShowForm" class="w-[449px] sm:w-[459px]  lg:w-[500px] py-2 rounded-md bg-[#28aa28] text-white text-5"> Add Task</button>
        <button v-if="formStore.isShowForm == true" @click="formStore.handleIsShowForm"  class="w-[449px] sm:w-[459px]  lg:w-[500px] py-2 rounded-md bg-[#21b1b1] text-white text-5"> Close Task</button>
    </div>
</template>