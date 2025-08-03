import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from "@/services/api";


export const useTodoStore = defineStore('todos', ()=> {

    const todos = ref([])
    const error = ref('')
    const token = localStorage.getItem('accessToken');

    const getTodos = async () => {

        
        if(!token){
            console.log('Không tìm thấy token , kiểm tra đăng nhập');
             return
        }

        try {
            const res = await api.get('/api/todo/gettodos')
         
        todos.value = res.data 
            
        } catch (err) {
        error.value = 'Lỗi lấy todo !'
        }
    }

    const createTodo = async (taskName,level) => {

       if(!token){
            console.log('Không tìm thấy token , kiểm tra đăng nhập');
             return
        }

        if(taskName == ''){
            confirm('Vui lòng nhập nội dung task !')
            return
        }

        try {
            await api.post('/api/todo/createtodo',{taskName,level})

            await getTodos();

        } catch (err) {
            error.value = 'Lỗi khi nhận todo !'
        }

    }

    const deleteTodo = async (idTodo) => {

          if(!token){
            console.log('Không tìm thấy token , kiểm tra đăng nhập');
             return
        }

        try{
             await api.delete('/api/todo/deletetodo',{
                
                data: {
                    idTodo
                }
            })
            await getTodos();

        } catch(err){
          error.value = 'Lỗi khi xóa todo !'
        }

    }

    
    const todoEditing = ref(null)

    const setEditTodo = (todo) => {

      todoEditing.value = { ...todo}

    }

    const updateTodo = async (idTodo,taskEdit,levelEdit) => {
        
     
           if(!token){
            console.log('Không tìm thấy token , kiểm tra đăng nhập');
             return
        }
         
        if(taskEdit == ''){
            confirm("Nhập nội dung cập nhật !")
            return
        }

        try {
            await api.put('/api/todo/updatetodo',{idTodo,taskEdit,levelEdit})

            await getTodos()
            
        } catch (err) {

          error.value = 'Lỗi khi update todo !'
            
        }

    }

    const sortTodo = async (sortBy,order) => {
       
        if(!token){
          console.log('Không tìm thấy token , kiểm tra đăng nhập');
          return;
        }    
        
      try {
        const res = await api.get(`/api/todo/sorttodo?sortBy=${sortBy}&order=${order}`)

        todos.value = res.data;
        
      } catch (err) {
        error.value = 'Lỗi khi sort Todo !'
      }

    }

    const searchText = ref('')

    const fillteredTodos = computed( () =>{

        if(!searchText.value.trim()){
            return todos.value
        }
      return todos.value.filter(todo => todo.task.toLowerCase().includes(searchText.value.trim().toLowerCase()))

    })
    
    const setSearchText = (text) => {  
        searchText.value = text
    }


    return {todos,error,todoEditing,searchText,fillteredTodos,getTodos,createTodo,deleteTodo,setEditTodo,updateTodo,sortTodo,setSearchText}
})