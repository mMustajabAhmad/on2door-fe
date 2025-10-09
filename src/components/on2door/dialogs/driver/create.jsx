'use client'

// React Imports
import React, { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, email, pipe, nonEmpty, optional, array, minLength } from 'valibot'
import { toast } from 'react-toastify'

// API Imports
import { createDriverApi, getTeamsApi } from '@/app/api/on2door/actions'

const schema = object({
  email: pipe(string(), nonEmpty('This field is required'), email('Please enter a valid email')),
  first_name: pipe(string(), nonEmpty('This field is required')),
  last_name: pipe(string(), nonEmpty('This field is required')),
  phone_number: pipe(string(), nonEmpty('This field is required')),
  team_ids: pipe(array(string()), minLength(1, 'Please select at least one team')),
  license_plate: pipe(string(), nonEmpty('License plate is required')),
  vehicle_type: pipe(string(), nonEmpty('Vehicle type is required')),
  color: optional(string()),
  description: optional(string())
})

const CreateDriverDialog = ({ open, setOpen }) => {
  const [errorState, setErrorState] = useState(null)
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      team_ids: [],
      license_plate: '',
      vehicle_type: '',
      color: '',
      description: ''
    }
  })

  // Fetch teams for dropdown
  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeamsApi()
  })

  const teams = teamsData?.teams?.data || []

  const { mutate: createDriver, isPending } = useMutation({
    mutationFn: createDriverApi,

    onMutate: () => setErrorState(null),

    onSuccess: () => {
      toast.success('Driver invitation sent successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      setOpen(false)
      reset()
    },

    onError: err => setErrorState(err)
  })

  const onSubmit = data => {
    const payload = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      is_active: false,
      team_ids: data.team_ids?.map(id => parseInt(id)) || [],
      license_plate: data.license_plate,
      vehicle_type: data.vehicle_type,
      color: data.color,
      description: data.description
    }

    createDriver(payload)
  }

  const handleClose = () => {
    setOpen(false)
    setErrorState(null)
    reset()
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body' closeAfterTransition={false}>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Create New Driver</div>
        <Typography component='span' className='flex flex-col text-center'>
          Add a new driver to the organization
        </Typography>
      </DialogTitle>

      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
          <i className='ri-close-line text-textSecondary' />
        </IconButton>

        {errorState && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {errorState?.response?.data?.error ||
              errorState?.response?.data?.message ||
              'Failed to send invitation. Please try again.'}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5} paddingTop={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='first_name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='First Name'
                    placeholder='John'
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='last_name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Last Name'
                    placeholder='Doe'
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Email'
                    type='email'
                    placeholder='john.doe@example.com'
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='phone_number'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Phone Number'
                    placeholder='+921234567890'
                    error={!!errors.phone_number}
                    helperText={errors.phone_number?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='team_ids'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.team_ids} disabled={isPending}>
                    <InputLabel>Select Teams</InputLabel>
                    <Select
                      multiple
                      value={field.value || []}
                      onChange={e => field.onChange(e.target.value)}
                      input={<OutlinedInput label='Select Teams' />}
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map(value => {
                            const team = teams.find(t => t.id.toString() === value)

                            
return (
                              <Chip key={value} label={team ? team.attributes.name : `Team ${value}`} size='small' />
                            )
                          })}
                        </Box>
                      )}
                    >
                      {teams.map(team => (
                        <MenuItem key={team.id} value={team.id.toString()}>
                          {team.attributes.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.team_ids && <FormHelperText>{errors.team_ids.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Vehicle Information Section */}
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6' className='mb-4'>
                Vehicle Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='license_plate'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='License Plate'
                    placeholder='ABC123'
                    error={!!errors.license_plate}
                    helperText={errors.license_plate?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='vehicle_type'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.vehicle_type} disabled={isPending}>
                    <InputLabel>Vehicle Type</InputLabel>
                    <Select value={field.value} label='Vehicle Type' onChange={field.onChange} onBlur={field.onBlur}>
                      <MenuItem value=''>Select vehicle type</MenuItem>
                      <MenuItem value='car'>Car</MenuItem>
                      <MenuItem value='truck'>Truck</MenuItem>
                      <MenuItem value='van'>Van</MenuItem>
                      <MenuItem value='motorcycle'>Motorcycle</MenuItem>
                      <MenuItem value='bicycle'>Bicycle</MenuItem>
                    </Select>
                    {errors.vehicle_type && <FormHelperText>{errors.vehicle_type.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='color'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Vehicle Color (Optional)'
                    placeholder='White'
                    error={!!errors.color}
                    helperText={errors.color?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Vehicle Description (Optional)'
                    placeholder='Delivery van'
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button
          variant='contained'
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={20} /> : null}
        >
          {isPending ? 'Sending...' : 'Send Invitation'}
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateDriverDialog
