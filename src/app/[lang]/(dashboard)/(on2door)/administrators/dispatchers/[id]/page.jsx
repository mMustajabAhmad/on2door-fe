'use client'

// React Imports
import { useParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import DispatcherOverview from '@/views/on2door/administrators/dispatchers/show'
import DispatcherTeams from '@/views/on2door/administrators/dispatchers/show/children/DispatcherTeams'

// API Imports
import { getDispatcherApi } from '@/app/api/on2door/actions'

const DispatcherViewPage = () => {
  const { id } = useParams()

  const { data: dispatcherData, isLoading, error } = useQuery({
    queryKey: ['dispatcher', id],
    queryFn: () => getDispatcherApi(id),
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-loader-4-line text-6xl text-blue-500 mb-4 animate-spin'></i>
          <h2 className='text-xl font-semibold mb-2'>Loading Dispatcher...</h2>
        </div>
      </div>
    )
  }

  if (error || !dispatcherData) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-error-warning-line text-6xl text-red-500 mb-4'></i>
          <h2 className='text-xl font-semibold mb-2'>Failed to load dispatcher</h2>
          <p className='text-gray-600'>Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 6, md: 6 }}>
        <DispatcherOverview dispatcherData={dispatcherData} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6, md: 6 }}>
        <DispatcherTeams dispatcherData={dispatcherData} />
      </Grid>
    </Grid>
  )
}

export default DispatcherViewPage
