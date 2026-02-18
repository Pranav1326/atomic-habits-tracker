import axios from 'axios'
import type { AxiosResponse } from 'axios'
import toast from 'react-hot-toast'

interface ApiResponse<T> {
  success: boolean
  data: T
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const body = response.data as ApiResponse<unknown>
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      response.data = body.data
    }
    return response
  },
  (error) => {
    const message: string =
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      'An unexpected error occurred'

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      toast.error('Session expired. Please log in again.')
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.response?.status !== 404) {
      toast.error(message)
    }

    return Promise.reject(error)
  },
)

export default apiClient
