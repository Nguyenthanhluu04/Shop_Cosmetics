import { defineStore } from "pinia";
import api from '@/services/api.js'
import { ref } from "vue";
import { jwtDecode } from "jwt-decode";

export const useUserStore = defineStore('userStore', () => {

  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  console.log('ac',accessToken.value)
  console.log('rf',refreshToken.value)
   

  // giải mã token khi refresh token
   const userInfor = ref(null)

 if(accessToken.value){
    try {
      userInfor.value = jwtDecode( accessToken.value)
    } catch (error) {
      userInfor.value = null
    }
 }
  


const setToken = (token,refresh) => {
      accessToken.value = token
      refreshToken.value = refresh

      localStorage.setItem('accessToken',token)
      localStorage.setItem('refreshToken',refresh)
   
      // giải mã token  dùng khi mới đăng nhập hoặc đăng ký
         try {
        if(token){
          userInfor.value = jwtDecode(token)
        }
        
       } catch (error) {
        userInfor.value = null
       }
}



  const handleLogin = async (email,password) => {

    try {
      const res = await api.post('/api/auth/login',{email,password})

      accessToken.value = res.data.accessToken
       refreshToken.value = res.data.refreshToken
       
     
      setToken(accessToken.value ,refreshToken.value);

       return true

    } catch (error) {

      return false
    }
  }

  const handleRegister = async (userName,email,password) => {

    try {   
      const res = await api.post('/api/auth/register', {userName,email,password})
  
       accessToken.value = res.data.accessToken
       refreshToken.value = res.data.refreshToken
         console.log('ac',res.data.accessToken)
         console.log('rf',res.data.refreshToken)

       setToken(accessToken.value ,refreshToken.value);
       
      
      return true;
    } catch (error) {
      return false
    }
     
  }

  const handleLogOut = () => {
    accessToken.value = null
    refreshToken.value = null
    userInfor.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    
    // Reset userProfileStore khi logout
    try {
      import('./userProfileStore.js').then(({ useUserProfileStore }) => {
        const profileStore = useUserProfileStore();
        profileStore.resetState();
      });
    } catch (error) {
      console.error('Error resetting profile store:', error);
    }
  }

  return {accessToken, refreshToken, userInfor,setToken, handleLogin, handleRegister, handleLogOut}
})

























// import { defineStore } from "pinia";
// import api from '@/services/api.js'
// import { computed, ref } from "vue";
// import { jwtDecode } from 'jwt-decode'

//     export const useUserStore = defineStore('userStore' , () => {

//         const accessToken = ref(localStorage.getItem('accessToken') || null)  
//         const refreshToken = ref(localStorage.getItem('refreshToken') || null)
        
//         const error = ref(null)  
      
//     const userInfo = computed(() =>{
//       if(!accessToken.value){
//         return null 
//       }
//       try {
//         return jwtDecode(accessToken.value)
//       } catch {
//         return null
//       }
//     })
    
//       const login  =  async (email,password) => {
//         try{

//             const res = await api.post('/api/auth/login',{email,password})

//              accessToken.value = res.data.accessToken
//              refreshToken.value = res.data.refreshToken
//              console.log('ac',res.data.accessToken)
//              console.log('rf',res.data.refreshToken)
//             localStorage.setItem('accessToken',accessToken.value)
//             localStorage.setItem('refreshToken', refreshToken.value)
            
//         } catch (err) {
//              error.value = 'Sai tài khoản hoặc mật khẩu !!'
//         }
//       }

//       const register = async (username,email,password) => {
//          try{
//           console.log('Gửi đăng ký:', username, password)

//            const res = await api.post('/api/auth/register',{username,email,password})

//              accessToken.value = res.data.accessToken
//              refreshToken.value = res.data.refreshToken
//              console.log('ac',res.data.accessToken)
//              console.log('rf',res.data.refreshToken)
//             localStorage.setItem('accessToken',accessToken.value)
//             localStorage.setItem('refreshToken', refreshToken.value)
//          } catch (err){
//            error.value = ' đăng ký thất bại !!'
//          }
//       }

//       const logOut = () => {
//         accessToken.value = null ,
//         localStorage.removeItem('accessToken')
//         localStorage.removeItem('refreshToken')
//       }

//    return {accessToken,error,userInfo,login,register,logOut}
//     })