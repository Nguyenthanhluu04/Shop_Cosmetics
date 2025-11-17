import { defineStore } from "pinia";
import api from '@/services/api.js'
import { ref } from "vue";
import { jwtDecode } from "jwt-decode";

export const useUserStore = defineStore('userStore', () => {

  // Lấy currentUserId của tab này
  const currentUserId = ref(sessionStorage.getItem('currentUserId') || null)
  
  // Lấy token theo userId từ localStorage
  const getTokenByUserId = (userId) => {
    if (!userId) return { accessToken: null, refreshToken: null }
    return {
      accessToken: localStorage.getItem(`user_${userId}_accessToken`),
      refreshToken: localStorage.getItem(`user_${userId}_refreshToken`)
    }
  }

  const tokens = currentUserId.value ? getTokenByUserId(currentUserId.value) : { accessToken: null, refreshToken: null }
  
  const accessToken = ref(tokens.accessToken)
  const refreshToken = ref(tokens.refreshToken)
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
   
      // giải mã token  dùng khi mới đăng nhập hoặc đăng ký
      try {
        if(token){
          userInfor.value = jwtDecode(token)
          const userId = userInfor.value.id
          
          // Lưu token theo userId vào localStorage
          localStorage.setItem(`user_${userId}_accessToken`, token)
          localStorage.setItem(`user_${userId}_refreshToken`, refresh)
          
          // Lưu currentUserId vào sessionStorage (riêng cho mỗi tab)
          currentUserId.value = userId
          sessionStorage.setItem('currentUserId', userId)
        }
      } catch (error) {
        userInfor.value = null
      }
}



  const handleLogin = async (email,password) => {

    try {
      const res = await api.post('/api/user/auth/login',{email,password})

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
      const res = await api.post('/api/user/auth/register', {userName,email,password})
  
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
    // Xóa token của user hiện tại
    if (currentUserId.value) {
      localStorage.removeItem(`user_${currentUserId.value}_accessToken`)
      localStorage.removeItem(`user_${currentUserId.value}_refreshToken`)
    }
    
    accessToken.value = null
    refreshToken.value = null
    userInfor.value = null
    currentUserId.value = null
    sessionStorage.removeItem('currentUserId')
    
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