<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b flex-shrink-0">
        <div class="flex items-center justify-between">
          <slot name="header">
            <h3 class="text-lg font-semibold text-gray-800">Modal</h3>
          </slot>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="px-6 py-4 overflow-y-auto flex-1">
        <slot name="body">
          <slot></slot>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style scoped>
/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
