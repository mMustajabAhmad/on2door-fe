'use client'

// React Imports
import { useState } from 'react'

import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

import { useQuery } from '@tanstack/react-query'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import DriverOverview from '@/views/on2door/drivers/show'
import DriverTabs from '@/views/on2door/drivers/show/children/DriverTabs'

// API Imports
import { getDriverApi } from '@/app/api/on2door/actions'

// Dynamic imports for tabs
const DriverTeams = dynamic(() => import('@/views/on2door/drivers/show/children/DriverTeams'))
const ScheduleTab = dynamic(() => import('@/views/on2door/drivers/show/children/ScheduleTab'))
const SubschedulesTab = dynamic(() => import('@/views/on2door/drivers/show/children/SubschedulesTab'))

const DriverViewPage = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('teams')

  const {
    data: driverData,
    isLoading,
    error
  } = useQuery({
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

  const tabContentList = {
    teams: <DriverTeams driverData={driverData} />,
    schedule: <ScheduleTab driverData={driverData} />,
    subschedules: <SubschedulesTab driverData={driverData} />
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 4, md: 4 }}>
        <DriverOverview driverData={driverData} />
      </Grid>
      <Grid size={{ xs: 12, lg: 8, md: 8 }}>
        <DriverTabs activeTab={activeTab} setActiveTab={setActiveTab} tabContentList={tabContentList} />
      </Grid>
    </Grid>
  )
}

export default DriverViewPage
