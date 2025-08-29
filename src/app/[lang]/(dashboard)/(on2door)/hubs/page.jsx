'use client'

// React Imports
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

// Component Imports
import HubList from '@/views/on2door/hubs/list'

// API Imports
import { getHubsApi } from '@/app/api/on2door/actions'

const HubsPage = () => {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['hubs', page, perPage, searchQuery, city, state, country],
    queryFn: () => {
      const payload = { page, per_page: perPage }

      if (searchQuery) payload['q[name_cont]'] = searchQuery
      if (city) payload['q[address_city_eq]'] = city
      if (state) payload['q[address_state_eq]'] = state

      return getHubsApi(payload)
    }
  })

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  const handlePerPageChange = newPerPage => {
    setPage(1)
    setPerPage(newPerPage)
  }

  const handleSearchChange = value => {
    setPage(1)
    setSearchQuery(value)
  }

  const handleCityChange = value => {
    setPage(1)
    setCity(value)
  }

  const handleStateChange = value => {
    setPage(1)
    setState(value)
  }

  const handleCountryChange = value => {
    setPage(1)
    setCountry(value)
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-loader-4-line text-6xl text-blue-500 mb-4 animate-spin'></i>
          <h2 className='text-xl font-semibold mb-2'>Loading Hubs...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-error-warning-line text-6xl text-red-500 mb-4'></i>
          <h2 className='text-xl font-semibold mb-2'>Failed to load hubs</h2>
          <p className='text-gray-600'>Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <HubList
      hubData={data}
      page={page}
      perPage={perPage}
      onPageChange={handlePageChange}
      onPerPageChange={handlePerPageChange}
      searchQuery={searchQuery}
      setSearchQuery={handleSearchChange}
      city={city}
      onCityChange={handleCityChange}
      state={state}
      onStateChange={handleStateChange}
      country={country}
      onCountryChange={handleCountryChange}
    />
  )
}

export default HubsPage
