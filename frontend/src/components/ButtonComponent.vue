<script setup>

defineProps({
    customClass: {
        type: String,
        default:" bg-[#21b1b1] text-white"
    }
})

</script>

<template>
    <div>
    <button :class="['py-2 px-3 rounded-md ' ,customClass ]"><slot>Button</slot></button> 
    </div>
</template>