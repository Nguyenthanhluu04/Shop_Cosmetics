import axios from 'axios'


const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
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

      const refreshToken = localStorage.getItem('refreshToken')
      console.log('refreshToken', refreshToken)

      if (!refreshToken) {
        localStorage.clear()
        window.location.href = '/'
        return Promise.reject(error)
      }

      try {
        const res = await axios.post('http://localhost:3000/api/auth/refresh',{refreshToken})

        const newAccessToken = res.data.accessToken
        console.log('newAC', res.data.accessToken)
        localStorage.setItem('accessToken', newAccessToken)

        // Retry request cũ với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (err) {
        // Refresh thất bại → logout
        localStorage.clear()
        window.location.href = '/'
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default api;