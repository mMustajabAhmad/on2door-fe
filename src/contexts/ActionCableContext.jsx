'use client'

// React Imports
import { createContext, useContext, useEffect, useState } from 'react'

// Third-party Imports
import { createConsumer } from '@rails/actioncable'

const ActionCableContext = createContext()
// console.log('ActionCableContext: Context created')

export const useActionCable = () => {
  // console.log('useActionCable: Hook called')
  const context = useContext(ActionCableContext)
  // console.log('useActionCable: context:', context ? 'EXISTS' : 'NULL')
  if (!context) {
    // console.error('useActionCable: No context found - not within ActionCableProvider')
    throw new Error('useActionCable must be used within an ActionCableProvider')
  }
  return context
}

export const ActionCableProvider = ({ children }) => {
  // console.log('ActionCableProvider: Component rendered')
  const [cable, setCable] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState(null)

  useEffect(() => {
    // console.log('ActionCableContext: useEffect triggered')

    const getAuthToken = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken')

        // console.log('ActionCableContext: token:', token ? 'YES' : 'NO')

        return token
      }
      // console.log('ActionCableContext: Window not available')
      return null
    }

    const initConnection = () => {
      // console.log('ActionCableContext: Initializing connection...')
      const authToken = getAuthToken()

      if (!authToken) {
        setConnectionError('No authentication token available')
        return
      }

      try {
        // Create connection with auth token
        const baseUrl = process.env.NEXT_PUBLIC_ACTION_CABLE_URL || 'ws://localhost:3000/cable'
        const consumer = createConsumer(`${baseUrl}?auth_token=${authToken}`)

        // console.log('ActionCableContext: Action Cable consumer created:', consumer)
        // console.log('ActionCableContext: Action Cable connection established')
        setIsConnected(true)
        setConnectionError(null)

        setCable(consumer)
      } catch (error) {
        // console.error('ActionCableContext: Connection failed:', error)
        setConnectionError(error.message)
        setIsConnected(false)
      }
    }

    const timer = setTimeout(initConnection, 100)

    // Cleanup
    return () => {
      // console.log('ActionCableContext: Cleaning up...')
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
