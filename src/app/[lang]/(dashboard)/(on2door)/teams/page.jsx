'use client'

// React Imports
import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'

// Component Imports
import TeamList from '@/views/on2door/teams/list'

// API Imports
import { getTeamsApi } from '@/app/api/on2door/actions'

const TeamListPage = () => {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [hubFilter, setHubFilter] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['teams', page, perPage, searchQuery, hubFilter],
    queryFn: () => {
      const payload = { page, per_page: perPage }

      if (searchQuery) payload['q[name_cont]'] = searchQuery
      if (hubFilter) payload['q[hub_id_eq]'] = hubFilter

      return getTeamsApi(payload)
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

  const handleHubFilterChange = value => {
    setPage(1)
    setHubFilter(value)
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-loader-4-line text-6xl text-blue-500 mb-4 animate-spin'></i>
          <h2 className='text-xl font-semibold mb-2'>Loading Teams...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-error-warning-line text-6xl text-red-500 mb-4'></i>
          <h2 className='text-xl font-semibold mb-2'>Failed to load teams</h2>
          <p className='text-gray-600'>Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <TeamList
      teamData={data}
      page={page}
      perPage={perPage}
      onPageChange={handlePageChange}
      onPerPageChange={handlePerPageChange}
      searchQuery={searchQuery}
      setSearchQuery={handleSearchChange}
      hubFilter={hubFilter}
      onHubFilterChange={handleHubFilterChange}
    />
  )
}

export default TeamListPage
