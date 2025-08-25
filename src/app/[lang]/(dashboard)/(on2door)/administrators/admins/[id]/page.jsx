'use client'

// React Imports
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AdminOverview from '@/views/on2door/administrators/admins/view'

// API Imports
import { getAdministratorByIdApi } from '@/app/api/on2door/actions'

const AdminViewPage = () => {
  const { id } = useParams()

  const {
    data: userData, isLoading, error } = useQuery({
    queryKey: ['administrator', id],
    queryFn: () => getAdministratorByIdApi(id),
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-loader-4-line text-6xl text-blue-500 mb-4 animate-spin'></i>
          <h2 className='text-xl font-semibold mb-2'>Loading Admin...</h2>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-error-warning-line text-6xl text-red-500 mb-4'></i>
          <h2 className='text-xl font-semibold mb-2'>Failed to load administrator</h2>
          <p className='text-gray-600'>Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AdminOverview userData={userData} />
      </Grid>
    </Grid>
  )
}

export default AdminViewPage
