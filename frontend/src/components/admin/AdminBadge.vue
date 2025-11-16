<template>
  <span 
    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
    :class="badgeClass"
  >
    <i v-if="icon" :class="icon" class="mr-1 text-xs"></i>
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(value)
  },
  customClass: {
    type: String,
    default: ''
  }
})

const badgeClass = computed(() => {
  if (props.customClass) return props.customClass

  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-cyan-100 text-cyan-700'
  }
  
  return variants[props.variant]
})
</script>

<style scoped>
</style>
