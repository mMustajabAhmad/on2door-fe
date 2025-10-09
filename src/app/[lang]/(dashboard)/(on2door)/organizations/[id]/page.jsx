'use client'

// React Imports
import { useParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import OrganizationOverview from '@/views/on2door/organizations/show'

// Data Imports
import { getOrganizationApi } from '@/app/api/on2door/actions'

const OrganizationViewPage = () => {
  const { id } = useParams()

  const { data: organizationData, isLoading, error } = useQuery({
    queryKey: ['organization', id],
    queryFn: () => getOrganizationApi(id),
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-loader-4-line text-6xl text-blue-500 mb-4 animate-spin'></i>
          <h2 className='text-xl font-semibold mb-2'>Loading Organization...</h2>
        </div>
      </div>
    )
  }

  if (error || !organizationData) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-error-warning-line text-6xl text-red-500 mb-4'></i>
          <h2 className='text-xl font-semibold mb-2'>Failed to load organization</h2>
          <p className='text-gray-600'>Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <OrganizationOverview organizationData={organizationData} />
      </Grid>
    </Grid>
  )
}

export default OrganizationViewPage
