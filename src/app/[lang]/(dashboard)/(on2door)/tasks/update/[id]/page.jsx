'use client'

// React Imports
import React, { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, pipe, nonEmpty, optional, array, boolean, number } from 'valibot'
import { toast } from 'react-toastify'

// API Imports
import { updateTaskApi, getTeamsApi, getDriversApi, getTasksApi, getTaskApi } from '@/app/api/on2door/actions'

const schema = object({
  pickup_task: boolean(),
  complete_after: optional(string()),
  complete_before: optional(string()),
  destination_notes: optional(string()),
  service_time: optional(string()),
  quantity: optional(string()),
  driver_id: optional(string()),
  team_id: optional(string()),
  linked_task_ids: optional(array(string())),
  task_completion_requirements: object({
    customer_signature: boolean(),
    photo_of_delivery: boolean(),
    add_notes: boolean()
  }),
  recipient_attributes: object({
    name: pipe(string(), nonEmpty('Recipient name is required')),
    phone_number: pipe(string(), nonEmpty('Phone number is required'))
  }),
  address_attributes: object({
    name: optional(string()),
    street: pipe(string(), nonEmpty('Street is required')),
    street_number: pipe(string(), nonEmpty('Street number is required')),
    appartment: pipe(string(), nonEmpty('Appartment is required')),
    city: pipe(string(), nonEmpty('City is required')),
    state: pipe(string(), nonEmpty('State is required')),
    postal_code: pipe(string(), nonEmpty('Postal code is required')),
    country: pipe(string(), nonEmpty('Country is required'))
  })
})

const UpdateTaskPage = () => {
  const [errorState, setErrorState] = useState(null)
  const [isFormPopulated, setIsFormPopulated] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()
  const params = useParams()
  const taskId = params.id

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      pickup_task: false,
      complete_after: '',
      complete_before: '',
      destination_notes: '',
      service_time: '',
      quantity: '',
      driver_id: '',
      team_id: '',
      linked_task_ids: [],
      task_completion_requirements: {
        customer_signature: false,
        photo_of_delivery: false,
        add_notes: false
      },
      recipient_attributes: {
        name: '',
        phone_number: ''
      },
      address_attributes: {
        name: '',
        street: '',
        street_number: '',
        appartment: '',
        city: '',
        state: '',
        postal_code: '',
        country: ''
      }
    }
  })

  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeamsApi()
  })

  const { data: driversData } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => getDriversApi()
  })

  const { data: tasksData } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasksApi()
  })

  const { data: taskData, isLoading: isLoadingTask } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskApi(taskId),
    enabled: !!taskId
  })

  const teams = teamsData?.teams?.data || []
  const allDrivers = driversData?.drivers?.data || []
  const existingTasks = tasksData?.tasks?.data || []

  // Watch the selected team_id
  const selectedTeamId = watch('team_id')

  // Filter drivers based on selected team
  const filteredDrivers = selectedTeamId
    ? allDrivers.filter(driver => {
        const driverTeamIds = driver.attributes?.team_ids || []
        return driverTeamIds.includes(parseInt(selectedTeamId))
      })
    : allDrivers

  // Reset driver selection when team changes
  useEffect(() => {
    setValue('driver_id', '')
  }, [selectedTeamId, setValue])

  useEffect(() => {
    if (taskData && !isLoadingTask) {
      setIsFormPopulated(false)

      const task = taskData?.task?.data?.attributes || {}

      // Basic task fields
      setValue('pickup_task', Boolean(task.pickup_task))
      setValue('complete_after', task.complete_after ? task.complete_after.substring(0, 16) : '')
      setValue('complete_before', task.complete_before ? task.complete_before.substring(0, 16) : '')
      setValue('destination_notes', task.destination_notes || '')
      setValue('service_time', task.service_time || '')
      setValue('quantity', task.quantity || '')

      // ID fields
      setValue('driver_id', task.driver_id?.toString() || '')
      setValue('team_id', task.team_id?.toString() || '')

      // Linked tasks
      const linkedTasks = task.linked_task_ids || []
      setValue(
        'linked_task_ids',
        linkedTasks.map(id => id.toString())
      )

      // Task completion requirements
      const completionReqs = task.task_completion_requirements || {}
      setValue('task_completion_requirements', {
        customer_signature: Boolean(completionReqs.customer_signature),
        photo_of_delivery: Boolean(completionReqs.photo_of_delivery),
        add_notes: Boolean(completionReqs.add_notes)
      })

      // Recipient attributes
      const recipient = task.recipient_attributes || {}
      setValue('recipient_attributes', {
        name: recipient.name || '',
        phone_number: recipient.phone_number || ''
      })

      // Address attributes
      const address = task.address_attributes || {}
      setValue('address_attributes', {
        name: address.name || '',
        street: address.street || '',
        street_number: address.street_number?.toString() || '',
        appartment: address.appartment?.toString() || '',
        city: address.city || '',
        state: address.state || '',
        postal_code: address.postal_code || '',
        country: address.country || ''
      })

      // Mark form as populated
      setTimeout(() => {
        setIsFormPopulated(true)
      }, 100)
    }
  }, [taskData, isLoadingTask, setValue])

  const { mutate: updateTask, isPending } = useMutation({
    mutationFn: ({ id, payload }) => updateTaskApi(id, payload),

    onMutate: () => setErrorState(null),

    onSuccess: () => {
      toast.success('Task updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      router.push('/tasks')
    },

    onError: err => setErrorState(err)
  })

  const onSubmit = data => {
    const payload = {
      task: {
        pickup_task: data.pickup_task,
        complete_after: data.complete_after || null,
        complete_before: data.complete_before || null,
        destination_notes: data.destination_notes || null,
        service_time: data.service_time || null,
        quantity: data.quantity || null,
        driver_id: data.driver_id ? parseInt(data.driver_id) : null,
        team_id: data.team_id,
        linked_task_ids: data.linked_task_ids?.map(id => parseInt(id)) || [],
        task_completion_requirements: data.task_completion_requirements,
        recipient_attributes: data.recipient_attributes,
        address_attributes: {
          ...data.address_attributes,
          street_number: parseInt(data.address_attributes.street_number) || 0
        }
      }
    }

    updateTask({ id: taskId, payload })
  }

  const handleCancel = () => {
    router.push('/tasks')
  }

  if (isLoadingTask) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={40} />
        <Typography sx={{ ml: 2 }}>Loading task data...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Card>
        <CardHeader title='Update Task' subheader='Update task information' />
        <CardContent>
          {errorState && (
            <Alert severity='error' sx={{ mb: 3 }}>
              {errorState?.response?.data?.error ||
                errorState?.response?.data?.message ||
                'Failed to update task. Please try again.'}
            </Alert>
          )}

          {isFormPopulated && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={4}>
                {/* Team Selection */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='team_id'
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth disabled={isPending} error={!!errors.team_id}>
                        <InputLabel>Select Team</InputLabel>
                        <Select
                          value={field.value || ''}
                          onChange={e => field.onChange(e.target.value)}
                          input={<OutlinedInput label='Select Team *' />}
                        >
                          {teams.map(team => (
                            <MenuItem key={team.id} value={team.id.toString()}>
                              {team.attributes?.name || `Team ${team.id}`}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.team_id && (
                          <Typography variant='caption' color='error' sx={{ mt: 1, ml: 2 }}>
                            {errors.team_id.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Driver Selection */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='driver_id'
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth disabled={isPending}>
                        <InputLabel>
                          {selectedTeamId
                            ? `Select Driver from Team (${filteredDrivers.length} available)`
                            : 'Select Driver (Optional)'}
                        </InputLabel>
                        <Select
                          value={field.value || ''}
                          onChange={e => field.onChange(e.target.value)}
                          input={
                            <OutlinedInput
                              label={
                                selectedTeamId
                                  ? `Select Driver from Team (${filteredDrivers.length} available)`
                                  : 'Select Driver (Optional)'
                              }
                            />
                          }
                        >
                          <MenuItem value=''>
                            <em>No Driver Assigned</em>
                          </MenuItem>
                          {filteredDrivers.length === 0 && selectedTeamId ? (
                            <MenuItem disabled>
                              <em>No drivers available for this team</em>
                            </MenuItem>
                          ) : (
                            filteredDrivers.map(driver => (
                              <MenuItem key={driver.id} value={driver.id.toString()}>
                                {driver.attributes?.first_name} {driver.attributes?.last_name}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Time Fields */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='complete_after'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='datetime-local'
                        label='Complete After (Optional)'
                        InputLabelProps={{ shrink: true }}
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='complete_before'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='datetime-local'
                        label='Complete Before (Optional)'
                        InputLabelProps={{ shrink: true }}
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                {/* Service Details */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='service_time'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Service Time (Optional)'
                        placeholder='e.g., 30 minutes'
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='quantity'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Quantity (Optional)'
                        placeholder='e.g., 5 items'
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                {/* Destination Notes */}
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='destination_notes'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        label='Destination Notes (Optional)'
                        placeholder='Special delivery instructions...'
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                {/* Task Type */}
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='pickup_task'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox checked={field.value} onChange={field.onChange} disabled={isPending} />}
                        label='Pickup Task'
                      />
                    )}
                  />
                </Grid>

                {/* Linked Tasks */}
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='linked_task_ids'
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth disabled={isPending}>
                        <InputLabel>Linked Tasks (Optional)</InputLabel>
                        <Select
                          multiple
                          value={field.value || []}
                          onChange={e => field.onChange(e.target.value)}
                          input={<OutlinedInput label='Linked Tasks (Optional)' />}
                          renderValue={selected => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map(value => {
                                const task = existingTasks.find(t => t.id.toString() === value)
                                return (
                                  <Chip
                                    key={value}
                                    label={
                                      task
                                        ? `Task #${task.id} - ${task.attributes?.recipient_attributes?.name || 'Unnamed'}`
                                        : `Task ${value}`
                                    }
                                    size='small'
                                  />
                                )
                              })}
                            </Box>
                          )}
                        >
                          {existingTasks.map(task => (
                            <MenuItem key={task.id} value={task.id.toString()}>
                              Task #{task.id} - {task.attributes?.recipient_attributes?.name || 'Unnamed Task'}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Divider sx={{ width: '100%', my: 2 }} />

                {/* Recipient Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    Recipient Information
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='recipient_attributes.name'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Recipient Name *'
                        error={!!errors.recipient_attributes?.name}
                        helperText={errors.recipient_attributes?.name?.message}
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='recipient_attributes.phone_number'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Phone Number *'
                        error={!!errors.recipient_attributes?.phone_number}
                        helperText={errors.recipient_attributes?.phone_number?.message}
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                <Divider sx={{ width: '100%', my: 2 }} />

                {/* Address Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    Address Information
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='address_attributes.name'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Address Name (Optional)'
                        placeholder='e.g., Home, Office'
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='address_attributes.street'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Street *'
                        error={!!errors.address_attributes?.street}
                        helperText={errors.address_attributes?.street?.message}
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='address_attributes.street_number'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='number'
                        label='Street Number *'
                        error={!!errors.address_attributes?.street_number}
                        helperText={errors.address_attributes?.street_number?.message}
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='address_attributes.appartment'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Apartment *'
                        placeholder='e.g., Apt 50'
                        error={!!errors.address_attributes?.appartment}
                        helperText={errors.address_attributes?.appartment?.message}
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='address_attributes.city'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='City *'
                        error={!!errors.address_attributes?.city}
                        helperText={errors.address_attributes?.city?.message}
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='address_attributes.state'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='State *'
                        error={!!errors.address_attributes?.state}
                        helperText={errors.address_attributes?.state?.message}
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='address_attributes.postal_code'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Postal Code *'
                        error={!!errors.address_attributes?.postal_code}
                        helperText={errors.address_attributes?.postal_code?.message}
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='address_attributes.country'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Country *'
                        error={!!errors.address_attributes?.country}
                        helperText={errors.address_attributes?.country?.message}
                        disabled={isPending}
                      />
                    )}
                  />
                </Grid>

                <Divider sx={{ width: '100%', my: 2 }} />

                {/* Task Completion Requirements */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    Task Completion Requirements
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='task_completion_requirements'
                    control={control}
                    render={({ field }) => (
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.value.customer_signature}
                              onChange={e =>
                                field.onChange({
                                  ...field.value,
                                  customer_signature: e.target.checked
                                })
                              }
                              disabled={isPending}
                            />
                          }
                          label='Customer Signature'
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.value.photo_of_delivery}
                              onChange={e =>
                                field.onChange({
                                  ...field.value,
                                  photo_of_delivery: e.target.checked
                                })
                              }
                              disabled={isPending}
                            />
                          }
                          label='Photo of Delivery'
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.value.add_notes}
                              onChange={e =>
                                field.onChange({
                                  ...field.value,
                                  add_notes: e.target.checked
                                })
                              }
                              disabled={isPending}
                            />
                          }
                          label='Add Notes'
                        />
                      </FormGroup>
                    )}
                  />
                </Grid>

                {/* Action Buttons */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                    <Button variant='outlined' color='secondary' onClick={handleCancel} disabled={isPending}>
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      type='submit'
                      disabled={isPending}
                      startIcon={isPending ? <CircularProgress size={20} /> : null}
                    >
                      {isPending ? 'Updating...' : 'Update Task'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default UpdateTaskPage

