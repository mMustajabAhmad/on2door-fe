'use client'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'

const TaskDetails = ({ taskData }) => {
  const router = useRouter()
  const task = taskData?.task?.data?.attributes || {}
  const taskId = taskData?.task?.data?.id

  // Get status color based on task state
  const getStatusColor = state => {
    switch (state) {
      case 'unassigned':
        return 'warning'
      case 'assigned':
        return 'info'
      case 'active':
        return 'primary'
      case 'completed':
        return 'success'
      default:
        return 'default'
    }
  }

  // Format date
  const formatDate = dateString => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card>
      <CardContent className='flex flex-col pbs-12 gap-6'>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-center flex-col gap-4'>
            <div className='flex flex-col items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary' size={120}>
                <i className='ri-task-line text-4xl' />
              </CustomAvatar>
              <Typography variant='h5'>Task # {task.short_id || taskId}</Typography>
            </div>
            <Chip
              label={task.state?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
              color={getStatusColor(task.state)}
              size='small'
              variant='tonal'
            />
          </div>

          <div className='flex items-center justify-around flex-wrap gap-4'>
            <div className='flex items-center gap-2'>
              <CustomAvatar variant='rounded' skin='light' color='primary' size={50}>
                <i className='ri-team-line' />
              </CustomAvatar>
              <Typography variant='h6'>Team {task.team_id || 'N/A'}</Typography>
            </div>
            <div className='flex items-center gap-2'>
              <CustomAvatar variant='rounded' skin='light' color='secondary' size={50}>
                <i className='ri-steering-2-line' />
              </CustomAvatar>
              <Typography variant='h6'>{task.driver_id ? `Driver ${task.driver_id}` : 'Unassigned'}</Typography>
            </div>
          </div>
        </div>

        <div>
          <Typography variant='h5'>Task Information</Typography>
          <Divider className='mlb-4' />
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <Typography variant='body2' color='text.secondary'>
                Task ID:
              </Typography>
              <Typography variant='body2' fontWeight='medium'>
                #{taskId}
              </Typography>
            </div>
            <div className='flex items-center gap-2'>
              <Typography variant='body2' color='text.secondary'>
                Short ID:
              </Typography>
              <Typography variant='body2' fontWeight='medium'>
                {task.short_id || 'N/A'}
              </Typography>
            </div>
            <div className='flex items-center gap-2'>
              <Typography variant='body2' color='text.secondary'>
                State:
              </Typography>
              <Typography variant='body2' fontWeight='medium'>
                {task.state?.replace('_', ' ').toUpperCase() || 'N/A'}
              </Typography>
            </div>
            <div className='flex items-center gap-2'>
              <Typography variant='body2' color='text.secondary'>
                Created:
              </Typography>
              <Typography variant='body2' fontWeight='medium'>
                {formatDate(task.created_at)}
              </Typography>
            </div>
            <div className='flex items-center gap-2'>
              <Typography variant='body2' color='text.secondary'>
                Pickup Task:
              </Typography>
              <Typography variant='body2' fontWeight='medium'>
                {task.pickup_task ? 'Yes' : 'No'}
              </Typography>
            </div>
          </div>
        </div>

        <Box className='flex justify-center'>
          <Button
            variant='contained'
            color='primary'
            startIcon={<i className='ri-edit-line' />}
            onClick={() => router.push(`/tasks/update/${taskId}`)}
          >
            Edit Task
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default TaskDetails
