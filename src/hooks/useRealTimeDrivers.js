'use client'

import { useEffect, useState, useCallback } from 'react'
import { useActionCable } from '@/contexts/ActionCableContext'
import { getTasksApi } from '@/app/api/on2door/actions'

export const useRealTimeDrivers = () => {
  const { cable, isConnected } = useActionCable()
  const [drivers, setDrivers] = useState(new Map())
  const [activeTaskIds, setActiveTaskIds] = useState(new Set())
  const [subscriptions, setSubscriptions] = useState(new Map())
  const [hasInitialized, setHasInitialized] = useState(false)

  // Update driver location
  const updateDriverLocation = useCallback(data => {
    setDrivers(prev => {
      const newMap = new Map(prev)
      const driverData = {
        id: data.driver_id,
        name: data.driver_name || `Driver ${data.driver_id}`,
        latitude: data.lat,
        longitude: data.lng,
        timestamp: data.updated_at,
        status: 'active',
        task_id: parseInt(data.task_id)
      }
      newMap.set(data.driver_id, driverData)
      return newMap
    })
  }, [])

  // when task is completed
  const removeDriver = useCallback(driverId => {
    setDrivers(prev => {
      const newMap = new Map(prev)
      newMap.delete(driverId)
      return newMap
    })
  }, [])

  // Subscribe to a task channel
  const subscribeToTask = useCallback(
    taskId => {
      if (!cable || subscriptions.has(taskId)) return

      const subscription = cable.subscriptions.create(
        { channel: 'TaskChannel', task_id: taskId },
        {
          received: data => {
            if (data.type === 'location_update') {
              updateDriverLocation(data)
            } else if (data.type === 'task_completed') {
              if (data.driver_id) {
                removeDriver(data.driver_id)
              }
            }
          },
          connected: () => {
            console.log(`Subscribed to Task ${taskId}`)
          },
          disconnected: () => {
            console.log(`Disconnected from Task ${taskId}`)
          },
          rejected: () => {
            console.log(`Task ${taskId} subscription rejected`)
          }
        }
      )

      setSubscriptions(prev => new Map([...prev, [taskId, subscription]]))
    },
    [cable, subscriptions, updateDriverLocation, removeDriver]
  )

  // Fetch active tasks and subscribe to them
  const initializeActiveTasks = useCallback(async () => {
    if (!cable || hasInitialized) return

    // console.log('Fetching active tasks')
    getTasksApi({ 'q[state_eq]': '2' }).then(response => {
      if (response?.tasks?.data) {
        const activeTasks = response.tasks.data.map(task => parseInt(task.id))
        // console.log('Found active tasks:', activeTasks)

        setActiveTaskIds(new Set(activeTasks))

        activeTasks.forEach(taskId => {
          subscribeToTask(taskId)
        })

        setHasInitialized(true)
      }
    })
  }, [cable, hasInitialized, subscribeToTask])

  // Initialize when cable is ready
  useEffect(() => {
    if (cable && isConnected && !hasInitialized) {
      initializeActiveTasks()
    }
  }, [cable, isConnected, hasInitialized, initializeActiveTasks])

  useEffect(() => {
    if (!cable || !isConnected) return

    const pollNewActiveTasks = async () => {
      getTasksApi({ 'q[state_eq]': '2' }).then(response => {
        const activeIds = (response?.tasks?.data || []).map(task => parseInt(task.id))

        activeIds.forEach(id => {
          if (!subscriptions.has(id)) {
            subscribeToTask(id)
          }
        })

        setActiveTaskIds(new Set(activeIds))
      })
    }

    const pollMs = 60000 // fetch active tasks every 60s
    const interval = setInterval(pollNewActiveTasks, pollMs)
    pollNewActiveTasks()

    return () => clearInterval(interval)
  }, [cable, isConnected, subscriptions, subscribeToTask])

  //check for completed tasks and remove drivers
  useEffect(() => {
    if (!hasInitialized) return

    const checkCompletedTasks = async () => {
      getTasksApi({ 'q[state_eq]': '2' }).then(response => {
        const currentActiveTaskIds = new Set(response?.tasks?.data?.map(task => parseInt(task.id)) || [])

        setDrivers(prev => {
          const newMap = new Map()
          let removedCount = 0

          prev.forEach((driver, driverId) => {
            if (currentActiveTaskIds.has(driver.task_id)) {
              newMap.set(driverId, driver)
            } else {
              removedCount++
            }
          })

          return newMap
        })
      })
    }

    const interval = setInterval(checkCompletedTasks, 30000)

    return () => clearInterval(interval)
  }, [hasInitialized])

  useEffect(() => {
    return () => {
      if (cable) {
        subscriptions.forEach((sub, taskId) => {
          cable.subscriptions.remove(sub)
        })
      }
    }
  }, [cable, subscriptions])

  return {
    drivers: Array.from(drivers.values()),
    isConnected: isConnected
  }
}
