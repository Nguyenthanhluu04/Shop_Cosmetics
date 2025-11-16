<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border-l-4" :class="borderColorClass">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-600 mb-1">{{ title }}</p>
        <p class="text-3xl font-bold" :class="textColorClass">{{ value }}</p>
      </div>
      <div class="rounded-full p-3" :class="bgColorClass">
        <i :class="['fas', `fa-${icon}`, iconColorClass, 'text-2xl']"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['pink', 'blue', 'green', 'yellow', 'purple', 'red'].includes(value)
  }
})

const colorClasses = {
  pink: {
    border: 'border-pink-500',
    text: 'text-pink-500',
    bg: 'bg-pink-100',
    icon: 'text-pink-500'
  },
  blue: {
    border: 'border-blue-500',
    text: 'text-blue-500',
    bg: 'bg-blue-100',
    icon: 'text-blue-500'
  },
  green: {
    border: 'border-green-500',
    text: 'text-green-500',
    bg: 'bg-green-100',
    icon: 'text-green-500'
  },
  yellow: {
    border: 'border-yellow-500',
    text: 'text-yellow-500',
    bg: 'bg-yellow-100',
    icon: 'text-yellow-500'
  },
  purple: {
    border: 'border-purple-500',
    text: 'text-purple-500',
    bg: 'bg-purple-100',
    icon: 'text-purple-500'
  },
  red: {
    border: 'border-red-500',
    text: 'text-red-500',
    bg: 'bg-red-100',
    icon: 'text-red-500'
  }
}

const borderColorClass = computed(() => colorClasses[props.color]?.border || colorClasses.blue.border)
const textColorClass = computed(() => colorClasses[props.color]?.text || colorClasses.blue.text)
const bgColorClass = computed(() => colorClasses[props.color]?.bg || colorClasses.blue.bg)
const iconColorClass = computed(() => colorClasses[props.color]?.icon || colorClasses.blue.icon)
</script>

<style scoped>
</style>
