'use client'

// MUI
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'

const RequirementsTab = ({ taskData }) => {
  const task = taskData?.task?.data?.attributes || {}
  const requirements = task.task_completion_requirements || {}

  const getRequirementIcon = requirement => {
    switch (requirement) {
      case 'add_notes':
        return 'ri-file-text-line'
      case 'photo_of_delivery':
        return 'ri-camera-line'
      case 'customer_signature':
        return 'ri-edit-line'
      default:
        return 'ri-checkbox-line'
    }
  }

  const requirementsList = [
    { key: 'add_notes', value: requirements.add_notes, label: 'Add Notes' },
    { key: 'photo_of_delivery', value: requirements.photo_of_delivery, label: 'Photo of Delivery' },
    { key: 'customer_signature', value: requirements.customer_signature, label: 'Customer Signature' }
  ]

  return (
    <Card>
      <CardHeader title='Task Completion Requirements' />
      <CardContent>
        <Typography variant='body1' color='text.secondary' className='mb-4'>
          These are the requirements that must be completed before the task can be marked as finished.
        </Typography>

        <List>
          {requirementsList.map((req, index) => (
            <div key={req.key}>
              <ListItem>
                <ListItemIcon>
                  <i
                    className={`${getRequirementIcon(req.key)} text-xl ${req.value ? 'text-green-500' : 'text-gray-400'}`}
                  />
                </ListItemIcon>
                <ListItemText primary={req.label} secondary={req.value ? 'Required' : 'Not Required'} />
                <Chip
                  label={req.value ? 'Required' : 'Optional'}
                  color={req.value ? 'success' : 'default'}
                  size='small'
                  variant='outlined'
                />
              </ListItem>
              {index < requirementsList.length - 1 && <Divider />}
            </div>
          ))}
        </List>

        {/* Additional Task Information */}
        <Box className='mt-6'>
          <Typography variant='h6' gutterBottom>
            Additional Information
          </Typography>
          <Divider className='mb-4' />

          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Typography variant='body2' color='text.secondary'>
                Service Time:
              </Typography>
              <Typography variant='body2' fontWeight='medium'>
                {task.service_time ? `${task.service_time} minutes` : 'Not specified'}
              </Typography>
            </div>

            <div className='flex items-center gap-2'>
              <Typography variant='body2' color='text.secondary'>
                Quantity:
              </Typography>
              <Typography variant='body2' fontWeight='medium'>
                {task.quantity || 'Not specified'}
              </Typography>
            </div>

            <div className='flex items-center gap-2'>
              <Typography variant='body2' color='text.secondary'>
                Complete After:
              </Typography>
              <Typography variant='body2' fontWeight='medium'>
                {task.complete_after ? new Date(task.complete_after).toLocaleString() : 'No restriction'}
              </Typography>
            </div>

            <div className='flex items-center gap-2'>
              <Typography variant='body2' color='text.secondary'>
                Complete Before:
              </Typography>
              <Typography variant='body2' fontWeight='medium'>
                {task.complete_before ? new Date(task.complete_before).toLocaleString() : 'No restriction'}
              </Typography>
            </div>
          </div>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RequirementsTab
