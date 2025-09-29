'use client'

// React Imports
import { createContext, useContext, useEffect, useState } from 'react'

// Third-party Imports
import { createConsumer } from '@rails/actioncable'

const ActionCableContext = createContext()

export const useActionCable = () => {
  const context = useContext(ActionCableContext)
  if (!context) {
    throw new Error('useActionCable must be used within an ActionCableProvider')
  }
  return context
}

export const ActionCableProvider = ({ children }) => {
  const [cable, setCable] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState(null)

  useEffect(() => {

    const getAuthToken = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken')
        return token
      }
      return null
    }

    const initConnection = () => {
      const authToken = getAuthToken()

      if (!authToken) {
        setConnectionError('No authentication token available')
        return
      }

      try {
        // Create connection with auth token
        const baseUrl = process.env.NEXT_PUBLIC_ACTION_CABLE_URL || 'ws://localhost:3000/cable'
        const consumer = createConsumer(`${baseUrl}?auth_token=${authToken}`)

        setIsConnected(true)
        setConnectionError(null)

        setCable(consumer)
      } catch (error) {
        setConnectionError(error.message)
        setIsConnected(false)
      }
    }

    const timer = setTimeout(initConnection, 100)

    // Cleanup
    return () => {
      clearTimeout(timer)
      if (cable) {
        cable.disconnect()
      }
    }
  }, [])

  const value = {
    cable,
    isConnected,
    connectionError
  }

  return <ActionCableContext.Provider value={value}>{children}</ActionCableContext.Provider>
}
