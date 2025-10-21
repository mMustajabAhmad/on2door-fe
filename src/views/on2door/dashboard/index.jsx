'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'

// Third-party Imports
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

// API Imports
import { getDriversApi, getTasksApi, getHubsApi } from '@/app/api/on2door/actions'

// Component Imports
import StatisticsCard from './children/StatisticsCard'
import ActiveTasksTable from './children/ActiveTasksTable'
import ActiveDriversList from './children/ActiveDriversList'
import TaskStatusChart from './children/TaskStatusChart'
import HubOverview from './children/HubOverview'

const On2DoorDashboard = () => {
  const router = useRouter()

  // Fetch dashboard data
  const { data: driversData, isLoading: driversLoading } = useQuery({
    queryKey: ['drivers', 'dashboard'],
    queryFn: () => getDriversApi()
  })

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', 'dashboard'],
    queryFn: () => getTasksApi()
  })

  const { data: hubsData, isLoading: hubsLoading } = useQuery({
    queryKey: ['hubs', 'dashboard'],
    queryFn: () => getHubsApi()
  })

  const isLoading = driversLoading || tasksLoading || hubsLoading

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <CircularProgress />
      </Box>
    )
  }

  const drivers = driversData?.drivers?.data || []
  const tasks = tasksData?.tasks?.data || []
  const hubs = hubsData?.hubs?.data || []

  // Calculate statistics
  const activeDrivers = drivers.filter(driver => driver.attributes?.is_active).length
  const totalTasks = typeof tasksData?.total_count === 'number' ? tasksData.total_count : tasks.length
  const completedTasks = tasks.filter(task => task.attributes?.state === 'completed').length
  const activeTasks = tasks.filter(task => task.attributes?.state === 'active').length
  const failedTasks = tasks.filter(task => task.attributes?.state === 'failed').length
  const assignedTasksCount = tasks.filter(task => task.attributes?.state === 'assigned').length
  const unassignedTasks = tasks.filter(task => task.attributes?.state === 'unassigned').length

  const statistics = [
    {
      title: 'Active Drivers',
      value: activeDrivers,
      total: drivers.length,
      icon: 'ri-user-line',
      color: 'primary'
    },
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: 'ri-task-line',
      color: 'info'
    },
    {
      title: 'Completed Tasks',
      value: completedTasks,
      total: totalTasks,
      icon: 'ri-check-line',
      color: 'success'
    },
    {
      title: 'Active Tasks',
      value: activeTasks,
      icon: 'ri-play-circle-line',
      color: 'warning'
    }
  ]

  return (
    <Grid container spacing={4}>
      {/* Statistics Cards */}
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={3}>
          {statistics.map((stat, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <StatisticsCard {...stat} />
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Active Tasks Table */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <Card sx={{ height: 360, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
            <Box className='flex items-center justify-between mb-4'>
              <Typography variant='h6' className='font-semibold'>
                Active Tasks
              </Typography>
              <Button variant='outlined' size='small' onClick={() => router.push('/tasks')} sx={{ borderRadius: 2 }}>
                View All
              </Button>
            </Box>
            <ActiveTasksTable tasks={tasks.filter(task => task.attributes?.state === 'active')} />
          </CardContent>
        </Card>
      </Grid>

      {/* Active Drivers */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <Card sx={{ height: 360, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
            <Box className='flex items-center justify-between mb-4'>
              <Typography variant='h6' className='font-semibold'>
                Active Drivers
              </Typography>
              <Button variant='outlined' size='small' onClick={() => router.push('/drivers')} sx={{ borderRadius: 2 }}>
                View All
              </Button>
            </Box>
            <ActiveDriversList drivers={drivers.filter(driver => driver.attributes?.is_active)} />
          </CardContent>
        </Card>
      </Grid>

      {/* Task Status Chart */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant='h6' className='mb-4 font-semibold'>
              Task Status Overview
            </Typography>
            <TaskStatusChart
              total={totalTasks}
              data={[
                { status: 'Active', count: activeTasks, color: '#56CA01' },
                { status: 'Assigned', count: assignedTasksCount, color: '#2196f3' },
                { status: 'Unassigned', count: unassignedTasks, color: '#9c27b0' },
                { status: 'Completed', count: completedTasks, color: '#009688' },
                { status: 'Failed', count: failedTasks, color: '#f44336' }
              ]}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Hub Overview */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: 360, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
            <Box className='flex items-center justify-between mb-4'>
              <Typography variant='h6' className='font-semibold'>
                Hub Overview
              </Typography>
              <Button variant='outlined' size='small' onClick={() => router.push('/hubs')} sx={{ borderRadius: 2 }}>
                View All
              </Button>
            </Box>
            <HubOverview hubs={hubs} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default On2DoorDashboard
