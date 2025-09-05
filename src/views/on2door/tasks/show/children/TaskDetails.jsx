'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'

// Component Imports
import EditTaskDialog from '@/components/on2door/dialogs/task/update'
import OpenDialogOnElementClick from '@/components/on2door/dialogs/OpenDialogOnElementClick'
import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'

const TaskDetails = ({ taskData }) => {
  const task = taskData?.task?.data?.attributes || {}
  const taskId = taskData?.task?.data?.id
  const dispatchersCount = task.dispatchers_count || 0
  const driversCount = task.drivers_count || 0

  return (
    <Card>
      <CardContent className='flex flex-col pbs-12 gap-6'>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-center flex-col gap-4'>
            <div className='flex flex-col items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary' size={120}>
                <Typography variant='h5'>{getInitials(task.name || 'Task')}</Typography>
              </CustomAvatar>
              <Typography variant='h5'>{task.name}</Typography>
            </div>
            <Chip label='Active Task' color='success' size='small' variant='tonal' />
          </div>
          <div className='flex items-center justify-around flex-wrap gap-4'>
            <div className='flex items-center gap-2'>
              <CustomAvatar variant='rounded' skin='light' color='primary' size={50}>
                <i className='ri-user-3-line' />
              </CustomAvatar>
              <Typography variant='h6'>{dispatchersCount} Dispatchers</Typography>
            </div>
            <div className='flex items-center gap-2'>
              <CustomAvatar variant='rounded' skin='light' color='secondary' size={50}>
                <i className='ri-steering-2-line' />
              </CustomAvatar>
              <Typography variant='h6'>{driversCount} Drivers</Typography>
            </div>
          </div>
        </div>

        <div>
          <Typography variant='h5'>Task Details</Typography>
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
                Organization ID:
              </Typography>
              <Typography variant='body2' fontWeight='medium'>
                #{task.organization_id}
              </Typography>
            </div>
            <div className='flex items-center gap-2'>
              <Typography variant='body2' color='text.secondary'>
                Hub:
              </Typography>
              <Typography variant='body2' fontWeight='medium'>
                {task.hub_id ? task.hub?.name || `Hub ${task.hub_id}` : 'No Hub Assigned'}
              </Typography>
            </div>
          </div>
        </div>

        <Box className='flex justify-center'>
          <OpenDialogOnElementClick
            element={Button}
            elementProps={{
              children: 'Edit Task',
              variant: 'contained',
              color: 'primary',
              startIcon: <i className='ri-edit-line' />
            }}
            dialog={EditTaskDialog}
            dialogProps={{
              currentTask: {
                id: taskId,
                name: task.name,
                hub_id: task.hub_id,
                administrator_ids: task.administrators || []
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default TaskDetails
