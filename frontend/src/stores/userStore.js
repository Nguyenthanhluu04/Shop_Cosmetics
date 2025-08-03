import { defineStore } from "pinia";
import api from '@/services/api.js'
import { computed, ref } from "vue";
import { jwtDecode } from 'jwt-decode'

    export const useUserStore = defineStore('userStore' , () => {

        const accessToken = ref(localStorage.getItem('accessToken') || null)  
        const refreshToken = ref(localStorage.getItem('refreshToken') || null)
        
        const error = ref(null)  
      
    const userInfo = computed(() =>{
      if(!accessToken.value){
        return null 
      }
      try {
        return jwtDecode(accessToken.value)
      } catch {
        return null
      }
    })
    
      const login  =  async (email,password) => {
        try{

            const res = await api.post('/api/auth/login',{email,password})

             accessToken.value = res.data.accessToken
             refreshToken.value = res.data.refreshToken
             console.log('ac',res.data.accessToken)
             console.log('rf',res.data.refreshToken)
            localStorage.setItem('accessToken',accessToken.value)
            localStorage.setItem('refreshToken', refreshToken.value)
            
        } catch (err) {
             error.value = 'Sai tài khoản hoặc mật khẩu !!'
        }
      }

      const register = async (username,email,password) => {
         try{
          console.log('Gửi đăng ký:', username, password)

           const res = await api.post('/api/auth/register',{username,email,password})

             accessToken.value = res.data.accessToken
             refreshToken.value = res.data.refreshToken
             console.log('ac',res.data.accessToken)
             console.log('rf',res.data.refreshToken)
            localStorage.setItem('accessToken',accessToken.value)
            localStorage.setItem('refreshToken', refreshToken.value)
         } catch (err){
           error.value = ' đăng ký thất bại !!'
         }
      }

      const logOut = () => {
        accessToken.value = null ,
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }

   return {accessToken,error,userInfo,login,register,logOut}
    })