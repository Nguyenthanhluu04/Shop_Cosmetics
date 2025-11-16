<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">
            <i v-if="icon" :class="icon" class="mr-2"></i>
            {{ title }}
          </h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="px-6 py-4">
        <slot></slot>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t bg-gray-50 rounded-b-lg flex justify-end gap-3">
        <button 
          v-if="showCancelButton"
          @click="$emit('cancel')" 
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
        >
          <i class="fas fa-times mr-1"></i>{{ cancelText }}
        </button>
        <button 
          v-if="showConfirmButton"
          @click="$emit('confirm')" 
          :class="confirmButtonClass"
          class="px-4 py-2 rounded-lg transition-opacity font-medium"
        >
          <i :class="confirmIcon" class="mr-1"></i>{{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  showConfirmButton: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: 'Hủy'
  },
  confirmText: {
    type: String,
    default: 'Xác nhận'
  },
  confirmIcon: {
    type: String,
    default: 'fas fa-check'
  },
  confirmButtonClass: {
    type: String,
    default: 'bg-[var(--primary-color)] text-white hover:opacity-90'
  }
})

defineEmits(['close', 'cancel', 'confirm'])
</script>

<style scoped>
</style>
