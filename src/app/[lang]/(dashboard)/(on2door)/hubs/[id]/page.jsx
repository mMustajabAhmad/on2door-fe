'use client'

// React Imports
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import HubOverview from '@/views/on2door/hubs/view'

// API Imports
import { getHubByIdApi } from '@/app/api/on2door/actions'

const HubViewPage = () => {
  const { id } = useParams()

  const {
    data: userData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['hub', id],
    queryFn: () => getHubByIdApi(id),
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

  if (error || !userData) {
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
        <HubOverview userData={userData} />
      </Grid>
    </Grid>
  )
}

export default HubViewPage
