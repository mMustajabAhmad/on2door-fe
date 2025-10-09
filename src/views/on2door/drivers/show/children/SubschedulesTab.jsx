'use client'

// React Imports
import { useState, useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// Third-party Imports
import { toast } from 'react-toastify'

// API Imports
import { getSchedulesApi, destroySubscheduleApi } from '@/app/api/on2door/actions'

const SubschedulesTab = ({ driverData }) => {
  const [searchDate, setSearchDate] = useState('')
  const [filteredSubschedules, setFilteredSubschedules] = useState([])
  const queryClient = useQueryClient()

  const driver = driverData?.driver?.data?.attributes || {}
  const driverId = driver.id

  // Fetch all schedules for the driver
  const { data: schedulesData, isLoading } = useQuery({
    queryKey: ['schedules', driverId],
    queryFn: () => getSchedulesApi({ 'q[driver_id_eq]': driverId }),
    enabled: !!driverId
  })

  const { mutate: destroySubschedule, isPending: isDeletingSubschedule } = useMutation({
    mutationFn: destroySubscheduleApi,

    onSuccess: () => {
      toast.success('Subschedule deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      queryClient.invalidateQueries({ queryKey: ['schedules', driverId] })
    },

    onError: error => {
      console.error('Error deleting subschedule:', error)
      toast.error('Failed to delete subschedule. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    }
  })

  const handledestroySubschedule = subscheduleId => {
    destroySubschedule(subscheduleId)
  }

  // Filter subschedules by date
  const filterSubschedulesByDate = () => {
    if (!schedulesData?.schedules?.data) {
      setFilteredSubschedules([])
      
return
    }

    const targetDate = searchDate ? new Date(searchDate).toISOString().split('T')[0] : null
    const filtered = []

    schedulesData.schedules.data.forEach(schedule => {
      const scheduleDate = new Date(schedule.attributes.date).toISOString().split('T')[0]
      const shouldIncludeSchedule = !targetDate || scheduleDate === targetDate

      if (shouldIncludeSchedule && schedule.attributes.subschedules) {
        schedule.attributes.subschedules.forEach(subschedule => {
          filtered.push({
            ...subschedule,
            schedule_date: schedule.attributes.date,
            schedule_id: schedule.id
          })
        })
      }
    })

    setFilteredSubschedules(filtered)
  }

  useEffect(() => {
    filterSubschedulesByDate()
  }, [schedulesData, searchDate])

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Grid container spacing={4}>
      {/* Search and Filter */}
      <Grid size={{ xs: 12 }}>
        <Card elevation={3} sx={{ maxWidth: 600, mx: 'auto' }}>
          <CardHeader
            title='All Driver Subschedules'
            titleTypographyProps={{ variant: 'h5', color: 'primary', textAlign: 'center' }}
          />
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                type='date'
                label='Filter by Date (Optional)'
                value={searchDate}
                onChange={e => setSearchDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => setSearchDate('')} edge='end'>
                        <i className='ri-close-line' />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center' }}>
              {searchDate ? `Showing subschedules for ${searchDate}` : 'Showing all subschedules'} (
              {filteredSubschedules.length} found)
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Subschedules List */}
      <Grid size={{ xs: 12 }}>
        <Card elevation={3} sx={{ maxWidth: 600, mx: 'auto' }}>
          <CardHeader
            title={searchDate ? `Subschedules for ${searchDate}` : 'All Subschedules'}
            titleTypographyProps={{ variant: 'h6', color: 'primary', textAlign: 'center' }}
          />
          <Divider />
          <CardContent sx={{ p: 3 }}>
            {filteredSubschedules.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredSubschedules.map((subschedule, index) => {
                  const startTime = new Date(subschedule.shift_start).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })

                  const endTime = new Date(subschedule.shift_end).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })

                  const duration =
                    Math.round(
                      ((new Date(subschedule.shift_end) - new Date(subschedule.shift_start)) / (1000 * 60 * 60)) * 10
                    ) / 10

                  const scheduleDate = new Date(subschedule.schedule_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })

                  return (
                    <Box
                      key={subschedule.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        backgroundColor: 'background.paper'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Box>
                          <Typography variant='body1' sx={{ fontWeight: 'medium' }}>
                            {startTime} - {endTime}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            Duration: {duration}h • Date: {scheduleDate}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          color='error'
                          onClick={() => handledestroySubschedule(subschedule.id)}
                          disabled={isDeletingSubschedule}
                        >
                          <i className='ri-delete-bin-7-line' />
                        </IconButton>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant='h6' color='text.secondary'>
                  No subschedules found
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {searchDate ? `No subschedules found for ${searchDate}` : 'This driver has no subschedules yet'}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SubschedulesTab
