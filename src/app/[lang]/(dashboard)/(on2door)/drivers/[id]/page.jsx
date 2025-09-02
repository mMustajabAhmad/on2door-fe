'use client'

// React Imports
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import DriverOverview from '@/views/on2door/drivers/show'
import DriverTeams from '@/views/on2door/drivers/show/children/DriverTeams'

// API Imports
import { getDriverApi } from '@/app/api/on2door/actions'

const DriverViewPage = () => {
  const { id } = useParams()

  const { data: driverData, isLoading, error } = useQuery({
    queryKey: ['driver', id],
    queryFn: () => getDriverApi(id),
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-loader-4-line text-6xl text-blue-500 mb-4 animate-spin'></i>
          <h2 className='text-xl font-semibold mb-2'>Loading Driver...</h2>
        </div>
      </div>
    )
  }

  if (error || !driverData) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-error-warning-line text-6xl text-red-500 mb-4'></i>
          <h2 className='text-xl font-semibold mb-2'>Failed to load driver</h2>
          <p className='text-gray-600'>Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 6, md: 6 }}>
        <DriverOverview driverData={driverData} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6, md: 6 }}>
        <DriverTeams driverData={driverData} />
      </Grid>
    </Grid>
  )
}

export default DriverViewPage
