'use client'

// React Imports
import { useParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import HubOverview from '@/views/on2door/hubs/show'

// API Imports
import { getHubApi } from '@/app/api/on2door/actions'

const HubViewPage = () => {
  const { id } = useParams()

  const { data: hubData, isLoading, error } = useQuery({
    queryKey: ['hub', id],
    queryFn: () => getHubApi(id),
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-loader-4-line text-6xl text-blue-500 mb-4 animate-spin'></i>
          <h2 className='text-xl font-semibold mb-2'>Loading Hub...</h2>
        </div>
      </div>
    )
  }

  if (error || !hubData) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-error-warning-line text-6xl text-red-500 mb-4'></i>
          <h2 className='text-xl font-semibold mb-2'>Failed to load hub</h2>
          <p className='text-gray-600'>Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <HubOverview hubData={hubData} />
      </Grid>
    </Grid>
  )
}

export default HubViewPage
