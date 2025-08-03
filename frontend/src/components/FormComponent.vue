<script setup>
import { onUpdated, ref } from "vue";
import AddFormComponent from "./AddFormComponent.vue";
import ButtonComponent from "./ButtonComponent.vue";
import { useFormStore } from '@/stores/useFormStore';
import { useTodoStore } from "@/stores/todoStore";
import { computed } from "vue";

const formStore = useFormStore();
const todoStore = useTodoStore();

const taskName = ref('')
const level = ref('Small')

const resetForm = () => {
   taskName.value= '',
   level.value ='Small'
}

const cancelForm = () => {
  resetForm();
  formStore.isShowForm = !formStore.isShowForm;
}

const createTodo = async () =>{
 await todoStore.createTodo(taskName.value.trim(),level.value);
    resetForm();
}

const taskEdit = computed({
  get: () => todoStore.todoEditing?.task || ' ',
  set: (newValue) => {
    if (todoStore.todoEditing) {
      todoStore.todoEditing.task = newValue
    }
  }
})  

const levelEdit = computed({
  get: () => todoStore.todoEditing?.level || ' ',
  set: (newValue) => {
    if(todoStore.todoEditing){
      todoStore.todoEditing.level = newValue;
    }
  },
})


const cancelFormEdit = () => { 
  todoStore.todoEditing = null;
  formStore.isEdit = false;
}

const updateTodo = async () =>{

 const idTodo = todoStore.todoEditing.id
 const taskEdit = todoStore.todoEditing.task.trim()
 const levelEdit = todoStore.todoEditing.level

 await todoStore.updateTodo(idTodo,taskEdit,levelEdit);

  todoStore.todoEditing = null;
  formStore.isEdit = false;
  
}

</script>

<template>
    <div>
        <add-form-component/>
         <div v-if="formStore.isShowForm" class="flex justify-between">
          <form class=" flex justify-between">
              <input v-if="formStore.isEdit" v-model="taskEdit" type="text" class="mr-4 rounded-md border-gray-300 focus:border-gray-400 text-gray-600 h-[40px] w-[170px] lg:w-full"  >
              <input v-else-if="!formStore.isEdit" v-model="taskName" type="text" class="mr-4 rounded-md border-gray-300 focus:border-gray-400 text-gray-600 h-[40px] w-[170px] lg:w-full" placeholder="Nhập Task ..."  >
              <select v-if="formStore.isEdit" v-model="levelEdit" class="rounded-md  border-gray-300 text-gray-600 h-[40px]   " >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
               <select v-else-if="!formStore.isEdit" v-model="level" class="rounded-md  border-gray-300 text-gray-600  h-[40px] " >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </form>
            <button-component v-if="formStore.isEdit" @click="updateTodo"  customClass="bg-[#21b1b1] text-white">Save</button-component>
            <button-component v-else-if="!formStore.isEdit" @click="createTodo"  customClass="bg-[#21b1b1] text-white">Submit</button-component>
            <button-component v-if="formStore.isEdit" @click="cancelFormEdit" customClass="bg-[#777] text-white">Cancel </button-component>
            <button-component v-else-if="!formStore.isEdit" @click="cancelForm" customClass="bg-[#777] text-white">Cancel</button-component>
       </div>
    </div>
</template>