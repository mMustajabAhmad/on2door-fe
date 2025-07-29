'use client'

import axios from 'axios'
import Qs from 'qs'
import { i18n } from '@/configs/i18n'

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN
export const API_URL = process.env.NEXT_PUBLIC_API_URL
export const AUTH_TOKEN = 'authToken'

function getAuthToken() {
  if (typeof window !== 'undefined') return localStorage.getItem(AUTH_TOKEN)
  return null
}

// Axios global interceptors (only set once in browser)
if (typeof window !== 'undefined') {
  axios.interceptors.request.use(config => {
    return config
  })

  axios.interceptors.response.use(
    response => {
      return response
    },
    error => {
      console.error('Request failed with error:', error)
      return Promise.reject(error)
    }
  )
}

const client = (apiURL = API_URL) => {
  const locale = i18n?.locale ?? 'en'

  return axios.create({
    baseURL: `${API_DOMAIN}${apiURL}`,
    paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'brackets' }),

    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthToken() ? `Bearer ${getAuthToken()}` : undefined
    }
  })
}

export default client
