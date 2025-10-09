'use client'

// React Imports
import { useState, useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, pipe, nonEmpty } from 'valibot'
import { toast } from 'react-toastify'

// API Imports
import { createScheduleApi, createSubscheduleApi, getSchedulesApi } from '@/app/api/on2door/actions'

const scheduleSchema = object({
  date: pipe(string(), nonEmpty('Date is required'))
})

const ScheduleTab = ({ driverData }) => {
  const [selectedDate, setSelectedDate] = useState('')
  const [createdScheduleId, setCreatedScheduleId] = useState(null)
  const [errorState, setErrorState] = useState(null)
  const [timeSlots, setTimeSlots] = useState([{ start: '', end: '' }])
  const [isSaving, setIsSaving] = useState(false)
  const queryClient = useQueryClient()

  // minimum 1 hour duration
  const validateShiftDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return true

    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)

    if (end <= start) {
      return 'End time must be after start time'
    }

    const diffInHours = (end - start) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Shift must be at least 1 hour long'
    }

    return true
  }

  const driver = driverData?.driver?.data?.attributes || {}
  const driverId = driver.id

  // Schedule form
  const {
    control: scheduleControl,
    handleSubmit: handleScheduleSubmit,
    reset: resetSchedule,
    formState: { errors: scheduleErrors }
  } = useForm({
    resolver: valibotResolver(scheduleSchema),
    defaultValues: {
      date: ''
    }
  })

  // Fetch existing schedules
  const { data: schedulesData, refetch: refetchSchedules } = useQuery({
    queryKey: ['schedules', driverId],
    queryFn: () => getSchedulesApi({ 'q[driver_id_eq]': driverId }),
    enabled: !!driverId
  })

  // Function to check for existing schedule for selected date
  const checkExistingSchedule = date => {
    if (!schedulesData?.schedules?.data || !date) return

    const existingSchedule = schedulesData.schedules.data.find(schedule => {
      const scheduleDate = new Date(schedule.attributes.date).toISOString().split('T')[0]

      
return scheduleDate === date
    })

    if (existingSchedule) {
      setCreatedScheduleId(existingSchedule.id)
    } else {
      setCreatedScheduleId(null)
    }
  }

  // Create schedule mutation
  const { mutate: createSchedule, isPending: isCreatingSchedule } = useMutation({
    mutationFn: createScheduleApi,
    onMutate: () => setErrorState(null),
    onSuccess: response => {
      toast.success('Schedule created successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      setCreatedScheduleId(response.schedule.data.id)
      queryClient.invalidateQueries({ queryKey: ['schedules', driverId] })
      resetSchedule()
    },
    onError: err => {
      setErrorState(err)
    }
  })

  const onScheduleSubmit = data => {
    const payload = {
      schedule: {
        date: data.date,
        driver_id: parseInt(driverId)
      }
    }

    createSchedule(payload)
  }

  const handleDateChange = date => {
    setSelectedDate(date)
    checkExistingSchedule(date)
    setTimeSlots([{ start: '', end: '' }])
  }

  const addTimeSlot = () => {
    const newSlots = timeSlots.concat([{ start: '', end: '' }])

    setTimeSlots(newSlots)
  }

  const removeTimeSlot = index => {
    if (timeSlots.length > 1) {
      const newSlots = timeSlots.filter((slot, i) => i !== index)

      setTimeSlots(newSlots)
    }
  }

  const updateTimeSlot = (index, field, value) => {
    const newSlots = timeSlots.map((slot, i) => {
      if (i === index) {
        return Object.assign({}, slot, { [field]: value })
      }

      
return slot
    })

    setTimeSlots(newSlots)
  }

  const saveAllSubschedules = async () => {
    if (!createdScheduleId) {
      toast.error('Please create a schedule first!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      
return
    }

    const validSlots = timeSlots.filter(slot => slot.start && slot.end)

    if (validSlots.length === 0) {
      toast.error('Please add at least one time slot!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      
return
    }

    for (const slot of validSlots) {
      const validation = validateShiftDuration(slot.start, slot.end)

      if (validation !== true) {
        toast.error(validation, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
        
return
      }
    }

    setIsSaving(true)

    try {
      // Create all subschedules
      const promises = validSlots.map(slot =>
        createSubscheduleApi({
          subschedule: {
            schedule_id: parseInt(createdScheduleId),
            shift_start: slot.start,
            shift_end: slot.end
          }
        })
      )

      await Promise.all(promises)

      toast.success(`${validSlots.length} subschedule(s) created successfully!`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      queryClient.invalidateQueries({ queryKey: ['schedules', driverId] })
      setTimeSlots([{ start: '', end: '' }])

      // Refresh schedules data
      setTimeout(() => {
        refetchSchedules().then(() => {
          checkExistingSchedule(selectedDate)
        })
      }, 500)
    } catch (error) {
      console.error('Error creating subschedules:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Check for existing schedules
  useEffect(() => {
    if (schedulesData && selectedDate) {
      checkExistingSchedule(selectedDate)
    }
  }, [schedulesData, selectedDate])

  return (
    <Grid container spacing={4}>
      {/* Main Schedule Card */}
      <Grid size={{ xs: 12 }}>
        <Card elevation={3} sx={{ maxWidth: 600, mx: 'auto' }}>
          <CardHeader
            title='Driver Schedule Management'
            titleTypographyProps={{ variant: 'h5', color: 'primary', textAlign: 'center' }}
          />
          <Divider />
          <CardContent sx={{ p: 4 }}>
            {/* Date Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant='h6' sx={{ mb: 2, color: 'text.primary' }}>
                Select Date
              </Typography>
              <Controller
                name='date'
                control={scheduleControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='date'
                    label='Choose a date'
                    InputLabelProps={{ shrink: true }}
                    error={!!scheduleErrors.date}
                    helperText={scheduleErrors.date?.message}
                    disabled={isCreatingSchedule}
                    onChange={e => {
                      field.onChange(e)
                      handleDateChange(e.target.value)
                    }}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              {selectedDate && (
                <Button
                  variant='contained'
                  fullWidth
                  disabled={isCreatingSchedule || createdScheduleId}
                  onClick={handleScheduleSubmit(onScheduleSubmit)}
                  startIcon={isCreatingSchedule ? <CircularProgress size={20} /> : null}
                  sx={{ mb: 2 }}
                >
                  {isCreatingSchedule
                    ? 'Creating Schedule...'
                    : createdScheduleId
                      ? 'Schedule Created'
                      : 'Create Schedule'}
                </Button>
              )}
            </Box>

            {/* Time Slots Section */}
            {createdScheduleId && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant='h6' sx={{ color: 'text.primary' }}>
                    Time Slots
                  </Typography>
                  <Button
                    variant='outlined'
                    size='small'
                    onClick={addTimeSlot}
                    startIcon={<i className='ri-add-line' />}
                  >
                    Add Slot
                  </Button>
                </Box>

                {timeSlots.map((slot, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <TextField
                      type='time'
                      label='Start Time'
                      value={slot.start}
                      onChange={e => updateTimeSlot(index, 'start', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ flex: 1 }}
                    />
                    <Typography variant='body1' sx={{ color: 'text.secondary' }}>
                      to
                    </Typography>
                    <TextField
                      type='time'
                      label='End Time'
                      value={slot.end}
                      onChange={e => updateTimeSlot(index, 'end', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ flex: 1 }}
                    />
                    {timeSlots.length > 1 && (
                      <IconButton color='error' onClick={() => removeTimeSlot(index)}>
                        <i className='ri-delete-bin-7-line' />
                      </IconButton>
                    )}
                  </Box>
                ))}

                <Button
                  variant='contained'
                  fullWidth
                  onClick={saveAllSubschedules}
                  disabled={isSaving || timeSlots.every(slot => !slot.start || !slot.end)}
                  startIcon={isSaving ? <CircularProgress size={20} /> : null}
                  sx={{ mt: 2 }}
                >
                  {isSaving ? 'Saving...' : 'Save All Time Slots'}
                </Button>
              </Box>
            )}

            {/* Error Display */}
            {errorState && (
              <Alert severity='error' sx={{ mb: 2 }}>
                <Typography variant='body2'>
                  {errorState?.response?.data?.error ||
                    errorState?.response?.data?.message ||
                    errorState?.message ||
                    'An error occurred. Please try again.'}
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ScheduleTab
