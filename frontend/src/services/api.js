import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  // Lấy currentUserId từ sessionStorage của tab này
  const currentUserId = sessionStorage.getItem('currentUserId');
  const token = currentUserId ? localStorage.getItem(`user_${currentUserId}_accessToken`) : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config

    // Nếu accessToken hết hạn và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const currentUserId = sessionStorage.getItem('currentUserId')
      const refreshToken = currentUserId ? localStorage.getItem(`user_${currentUserId}_refreshToken`) : null
      console.log('refreshToken', refreshToken)

      // Chỉ redirect nếu đã có refreshToken (tức là đã đăng nhập trước đó)
      if (!refreshToken || !currentUserId) {
        // Không redirect, chỉ reject error
        return Promise.reject(error)
      }

      try {
        const res = await axios.post('http://localhost:3000/api/user/auth/refresh',{refreshToken})

        const newAccessToken = res.data.accessToken
        console.log('newAC', res.data.accessToken)
        localStorage.setItem(`user_${currentUserId}_accessToken`, newAccessToken)
             
        // Retry request cũ với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (err) {
        // Refresh thất bại → xóa token của user này và redirect
        if (currentUserId) {
          localStorage.removeItem(`user_${currentUserId}_accessToken`)
          localStorage.removeItem(`user_${currentUserId}_refreshToken`)
        }
        sessionStorage.removeItem('currentUserId')
        window.location.href = '/LoginPage'
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default api;