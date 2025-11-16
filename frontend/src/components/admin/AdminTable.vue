<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key"
              :class="column.align === 'right' ? 'text-right' : 'text-left'"
              class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr 
            v-for="(item, index) in data" 
            :key="index"
            class="hover:bg-gray-50 transition-colors"
          >
            <td 
              v-for="column in columns" 
              :key="column.key"
              :class="column.align === 'right' ? 'text-right' : 'text-left'"
              class="px-6 py-4 whitespace-nowrap"
            >
              <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
                {{ item[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Empty State -->
    <div v-if="data.length === 0" class="text-center py-12">
      <i :class="emptyIcon" class="text-5xl text-gray-300 mb-4"></i>
      <p class="text-gray-500">{{ emptyText }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  columns: {
    type: Array,
    required: true
    // Format: [{ key: 'id', label: 'ID', align: 'left' }]
  },
  data: {
    type: Array,
    default: () => []
  },
  emptyText: {
    type: String,
    default: 'Không có dữ liệu'
  },
  emptyIcon: {
    type: String,
    default: 'fas fa-inbox'
  }
})
</script>

<style scoped>
</style>
