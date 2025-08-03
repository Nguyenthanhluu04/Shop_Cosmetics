<script setup>
import { onMounted } from 'vue';
import ButtonComponent from './ButtonComponent.vue';
import { useTodoStore } from '@/stores/todoStore';

import { useFormStore } from '@/stores/useFormStore';

const formStore = useFormStore();
const todoStore = useTodoStore();

onMounted(()=>{
todoStore.getTodos();

})

const hanldeDeleteTodo = async (idTodo) =>{

   await todoStore.deleteTodo(idTodo);
}

const setEdit = (todo) =>{
    formStore.isShowForm = true;
    formStore.isEdit = true;
    todoStore.setEditTodo(todo)
}

</script>

<template>
    <div class="mt-10" >
        <table class=" w-[450px] md:w-[600px] lg:w-[1000px] border ">
            <thead >
                    <tr class="font-bold">
                        <th style="width: 10%" >Id</th> 
                        <th>Task</th>
                        <th style="width: 20%" >Level</th> 
                        <th style="width: 20%" >Action</th>
                    </tr>
            </thead>
            <tbody v-if="todoStore.fillteredTodos.length > 0">
                    <tr v-for="todo in todoStore.fillteredTodos" :key="todo.id">
                        <th class="border-t-[1px] px-4 py-2">{{ todo.id }}</th>
                        <th class="border-t-[1px] px-4 py-2">{{ todo.task }}</th>
                        <th class="border-t-[1px] px-4 py-2"> {{ todo.level }}</th>
                        <th class="border-t-[1px] px-4 py-2 flex justify-around ">
                            <button-component @click="setEdit(todo)" customClass="bg-[#FFCC00] text-white ">Edit</button-component>
                            <button-component @click="hanldeDeleteTodo(todo.id)" customClass="bg-red-500 text-white ml-4  ">Delete</button-component>
                         </th>
                    </tr>
            </tbody>
            <tbody v-else-if="todoStore.fillteredTodos.length === 0 ">
                    <tr>
                        <th  class="border-t-[1px] px-4 py-2" colspan="4"> CHƯA CÓ TASK , VUI LÒNG THÊM TASK </th>                     
                    </tr>
            </tbody>
        </table>
    </div>
</template>