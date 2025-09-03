'use client'

// React Imports
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

// Next Imports
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import TeamOverview from '@/views/on2door/teams/show'
import TeamTabs from '@/views/on2door/teams/show/children/TeamTabs'

// API Imports
import { getTeamApi } from '@/app/api/on2door/actions'

// Dynamic imports for tabs
const HubTab = dynamic(() => import('@/views/on2door/teams/show/children/hub'))
const DispatchersTab = dynamic(() => import('@/views/on2door/teams/show/children/dispatcher'))
const DriversTab = dynamic(() => import('@/views/on2door/teams/show/children/driver'))

const TeamsViewPage = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('hub')

  const {
    data: teamData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['team', id],
    queryFn: () => getTeamApi(id)
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-loader-4-line text-6xl text-blue-500 mb-4 animate-spin'></i>
          <h2 className='text-xl font-semibold mb-2'>Loading Team...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-error-warning-line text-6xl text-red-500 mb-4'></i>
          <h2 className='text-xl font-semibold mb-2'>Failed to load team</h2>
          <p className='text-gray-600'>Please try again later</p>
        </div>
      </div>
    )
  }

  const tabContentList = {
    hub: <HubTab teamData={teamData} />,
    dispatchers: <DispatchersTab teamData={teamData} />,
    drivers: <DriversTab teamData={teamData} />
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 4, md: 5 }}>
        <TeamOverview teamData={teamData} />
      </Grid>
      <Grid size={{ xs: 12, lg: 8, md: 7 }}>
        <TeamTabs activeTab={activeTab} setActiveTab={setActiveTab} tabContentList={tabContentList} />
      </Grid>
    </Grid>
  )
}

export default TeamsViewPage
