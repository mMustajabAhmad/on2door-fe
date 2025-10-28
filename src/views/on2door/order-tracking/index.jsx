'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid2'
import CircularProgress from '@mui/material/CircularProgress'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

// React Query
import { useQuery } from '@tanstack/react-query'

// API
import { getPublicTaskApi } from '@/app/api/on2door/actions'

const OrderTracking = ({ taskShortId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trackOrder', taskShortId],

    queryFn: () => getPublicTaskApi(taskShortId),
    enabled: !!taskShortId,
  })

  const taskData = data?.task?.data
  const task = taskData?.attributes
  const recipient = task?.recipient_attributes
  const address = task?.address_attributes

  const steps = [
    { label: 'Order Placed', icon: 'ri-shopping-bag-line' },
    { label: 'Assigned to Driver', icon: 'ri-user-follow-line' },
    { label: 'Out for Delivery', icon: 'ri-truck-line' },
    { label: 'Delivered', icon: 'ri-check-line' }
  ]

  const getStatusColor = status => {
    if (status === 'completed') return 'success'
    if (status === 'active') return 'primary'
    if (status === 'assigned') return 'info'
    if (status === 'failed' || status === 'cancelled') return 'error'

    return 'default'
  }

  const getStatusIcon = status => {
    if (status === 'completed') return 'ri-check-double-line'
    if (status === 'active') return 'ri-truck-line'
    if (status === 'assigned') return 'ri-user-follow-line'
    if (status === 'failed' || status === 'cancelled') return 'ri-close-circle-line'

    return 'ri-inbox-line'
  }

  const getActiveStep = state => {
    if (state === 'completed') return 3
    if (state === 'active') return 2
    if (state === 'assigned') return 1

    return 0
  }

  const activeStep = getActiveStep(task?.state)

  if (isLoading) {
    return (
      <Box className='flex items-center justify-center min-h-screen'>
        <Box className='text-center'>
          <CircularProgress size={60} color='primary' />
          <Typography variant='h6' className='mt-4' color='primary'>
            Loading your order...
          </Typography>
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box className='flex items-center justify-center min-h-screen p-6'>
        <Card className='max-w-[600px] w-full'>
          <CardContent className='text-center p-8'>
            <i className='ri-error-warning-line text-6xl text-error mb-4'></i>
            <Typography variant='h5' className='mb-2' color='error'>
              Order Not Found
            </Typography>
            <Typography color='text.secondary' className='mb-4'>
              {error?.response?.data?.errors?.[0]?.detail ||
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "We couldn't find your order. Please check the tracking link and try again."}
            </Typography>
            <Alert severity='info' className='mt-4'>
              If you believe this is an error, please contact our support team.
            </Alert>
          </CardContent>
        </Card>
      </Box>
    )
  }

  if (!task) {
    return (
      <Box className='flex items-center justify-center min-h-screen p-6'>
        <Card className='max-w-[600px] w-full'>
          <CardContent className='text-center p-8'>
            <Typography variant='h5' color='text.secondary'>
              No tracking information available
            </Typography>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box className='flex flex-col gap-6 max-w-[900px] mx-auto p-6'>
      <Box className='text-center'>
        <Typography variant='h4' className='font-bold mb-2' color='primary'>
          Track Your Order
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Order ID: <strong>{task.short_id || taskData?.id}</strong>
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box className='flex items-center justify-between mb-4'>
            <Typography variant='h5' className='font-semibold'>
              Order Status
            </Typography>
            <Chip
              label={task.state?.toUpperCase() || 'UNKNOWN'}
              color={getStatusColor(task.state)}
              icon={<i className={getStatusIcon(task.state)} />}
              size='medium'
            />
          </Box>

          <Divider className='my-4' />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography variant='caption' color='text.primary' className='font-bold'>
                  Delivery Window
                </Typography>
                <Typography variant='body1' className='mt-1'>
                  {task.complete_after ? new Date(task.complete_after).toLocaleString() : '—'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  to
                </Typography>
                <Typography variant='body1'>
                  {task.complete_before ? new Date(task.complete_before).toLocaleString() : '—'}
                </Typography>
              </Box>
            </Grid>

            {task.destination_notes && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                  <Typography variant='caption' color='text.primary' className='font-bold'>
                    Special Instructions
                  </Typography>
                  <Typography variant='body1' className='mt-1'>
                    {task.destination_notes}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant='h6' className='font-semibold mb-4'>
            Order Timeline
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.label} completed={index < activeStep}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      className='flex items-center justify-center rounded-full'
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: index <= activeStep ? 'primary.main' : 'action.disabled',
                        color: 'white'
                      }}
                    >
                      <i className={step.icon}></i>
                    </Box>
                  )}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        {/* Delivery Contact Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className='h-full'>
            <CardContent>
              <Box className='flex items-center mb-3'>
                <i className='ri-contacts-line text-2xl mr-2 text-primary'></i>
                <Typography variant='h6' className='font-semibold'>
                  Delivery Contact
                </Typography>
              </Box>

              <Divider className='my-3' />

              {recipient && (
                <Box className='space-y-3'>
                  <Box className='flex items-start'>
                    <i className='ri-user-line text-lg mr-2 mt-1 text-gray-600'></i>
                    <Box>
                      <Typography variant='caption' color='text.secondary'>
                        Name
                      </Typography>
                      <Typography variant='body1'>{recipient.name || '—'}</Typography>
                    </Box>
                  </Box>

                  <Box className='flex items-start'>
                    <i className='ri-phone-line text-lg mr-2 mt-1 text-gray-600'></i>
                    <Box>
                      <Typography variant='caption' color='text.secondary'>
                        Phone
                      </Typography>
                      <Typography variant='body1'>{recipient.phone_number || '—'}</Typography>
                    </Box>
                  </Box>

                  {recipient.email && (
                    <Box className='flex items-start'>
                      <i className='ri-mail-line text-lg mr-2 mt-1 text-gray-600'></i>
                      <Box>
                        <Typography variant='caption' color='text.secondary'>
                          Email
                        </Typography>
                        <Typography variant='body1'>{recipient.email}</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Delivery Address Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className='h-full'>
            <CardContent>
              <Box className='flex items-center mb-3'>
                <i className='ri-map-pin-line text-2xl mr-2 text-primary'></i>
                <Typography variant='h6' className='font-semibold'>
                  Delivery Address
                </Typography>
              </Box>

              <Divider className='my-3' />

              {address && (
                <Box>
                  <Typography variant='body1' className='font-medium'>
                    {address.name || 'Delivery Location'}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' className='mt-2'>
                    {address.street_number} {address.street}
                    {address.appartment && `, Apt ${address.appartment}`}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {address.city}, {address.state} {address.postal_code}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {address.country}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box className='text-center mt-4'>
        <Typography variant='body2' color='text.secondary'>
          Thank you for choosing <strong>On2Door</strong>
        </Typography>
        <Typography variant='caption' color='text.secondary'>
          Need help? Contact our support team
        </Typography>
      </Box>
    </Box>
  )
}

export default OrderTracking
