'use client'

// React Imports
import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'

// Component Imports
import DispatcherList from '@views/on2door/administrators/dispatchers/list'

// API Imports
import { getDispatchersApi } from '@/app/api/on2door/actions'

const DispatcherListPage = () => {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [status, setStatus] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['dispatchers', page, perPage, searchQuery, status],
    queryFn: () => {
      const payload = { administrator_type: 'dispatcher', page, per_page: perPage }

      if (searchQuery) payload['q[email_or_first_name_or_last_name_or_phone_number_cont]'] = searchQuery 
      if (status) payload['q[is_active_eq]'] = status === 'active' ? true : false

      return getDispatchersApi(payload)
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

  const handleStatusChange = value => {
    setPage(1)
    setStatus(value)
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-loader-4-line text-6xl text-blue-500 mb-4 animate-spin'></i>
          <h2 className='text-xl font-semibold mb-2'>Loading Dispatchers...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-error-warning-line text-6xl text-red-500 mb-4'></i>
          <h2 className='text-xl font-semibold mb-2'>Failed to load dispatchers</h2>
        </div>
      </div>
    )
  }

  return (
    <DispatcherList
      userData={data}
      page={page}
      perPage={perPage}
      onPageChange={handlePageChange}
      onPerPageChange={handlePerPageChange}
      searchQuery={searchQuery}
      setSearchQuery={handleSearchChange}
      status={status}
      onStatusChange={handleStatusChange}
    />
  )
}

export default DispatcherListPage
