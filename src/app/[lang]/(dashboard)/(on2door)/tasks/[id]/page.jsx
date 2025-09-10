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
import TaskOverview from '@/views/on2door/tasks/show'
import TaskTabs from '@/views/on2door/tasks/show/children/TaskTabs'

// API Imports
import { getTaskApi } from '@/app/api/on2door/actions'

// Dynamic imports for tabs
const AssignmentTab = dynamic(() => import('@/views/on2door/tasks/show/children/AssignmentTab'))
const RequirementsTab = dynamic(() => import('@/views/on2door/tasks/show/children/RequirementsTab'))

const TaskViewPage = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('assignment')

  const { data: taskData, isLoading, error} = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskApi(id)
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-loader-4-line text-6xl text-blue-500 mb-4 animate-spin'></i>
          <h2 className='text-xl font-semibold mb-2'>Loading Task...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-error-warning-line text-6xl text-red-500 mb-4'></i>
          <h2 className='text-xl font-semibold mb-2'>Failed to load task</h2>
          <p className='text-gray-600'>Please try again later</p>
        </div>
      </div>
    )
  }

  const tabContentList = {
    assignment: <AssignmentTab taskData={taskData} />,
    requirements: <RequirementsTab taskData={taskData} />
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 4, md: 5 }}>
        <TaskOverview taskData={taskData} />
      </Grid>
      <Grid size={{ xs: 12, lg: 8, md: 7 }}>
        <TaskTabs activeTab={activeTab} setActiveTab={setActiveTab} tabContentList={tabContentList} />
      </Grid>
    </Grid>
  )
}

export default TaskViewPage
