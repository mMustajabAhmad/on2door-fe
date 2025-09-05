'use client'

// React Imports
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

// Component Imports
import TaskList from '@/views/on2door/tasks/list'

// API Imports
import { getTasksApi } from '@/app/api/on2door/actions'

const TaskListPage = () => {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [state, setState] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks', page, perPage, searchQuery, state],
    queryFn: () => {
      const payload = { page, per_page: perPage }
      if (searchQuery) payload['q[state_or_driver_id_or_team_id_or_recipient_id_eq]'] = searchQuery
      if (state) payload['q[state_eq]'] = state

      return getTasksApi(payload)
    }
  })

  const handlePageChange = newPage => setPage(newPage)

  const handlePerPageChange = newPerPage => {
    setPage(1)
    setPerPage(newPerPage)
  }

  const handleSearchChange = value => {
    setPage(1)
    setSearchQuery(value)
  }

  const handleStateChange = value => {
    setPage(1)
    setState(value)
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-loader-4-line text-6xl text-blue-500 mb-4 animate-spin'></i>
          <h2 className='text-xl font-semibold mb-2'>Loading Tasks...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-error-warning-line text-6xl text-red-500 mb-4'></i>
          <h2 className='text-xl font-semibold mb-2'>Failed to load tasks</h2>
          <p className='text-gray-600'>Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <TaskList
      taskData={data}
      page={page}
      perPage={perPage}
      onPageChange={handlePageChange}
      onPerPageChange={handlePerPageChange}
      searchQuery={searchQuery}
      setSearchQuery={handleSearchChange}
      state={state}
      onStateChange={handleStateChange}
    />
  )
}

export default TaskListPage
