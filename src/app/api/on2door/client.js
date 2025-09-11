'use client'

import axios from 'axios'
import Qs from 'qs'

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN
export const API_URL = process.env.NEXT_PUBLIC_API_URL
export const AUTH_TOKEN = 'authToken'

function getAuthToken() {
  if (typeof window !== 'undefined') return localStorage.getItem('authToken')
  return null
}

function handleTokenExpiration() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    localStorage.setItem('showSessionExpiredToast', 'true')
    window.location.replace('/login')
  }
}

const client = (apiURL = API_URL) => {
  const axiosInstance = axios.create({
    baseURL: `${API_DOMAIN}${apiURL}`,
    paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'brackets' }),

    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthToken() ? `Bearer ${getAuthToken()}` : undefined
    }
  })

  if (typeof window !== 'undefined') {
    // Request interceptor
    axiosInstance.interceptors.request.use(
      config => {
        const token = getAuthToken()
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    axiosInstance.interceptors.response.use(
      response => {
        return response
      },
      error => {
        const status = error.response?.status
        if (status === 401) handleTokenExpiration()

        return Promise.reject(error)
      }
    )
  }

  return axiosInstance
}

export default client
