'use client'

// React Imports
import React, { useState, useEffect } from 'react'
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

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, email, pipe, nonEmpty, array } from 'valibot'
import { toast } from 'react-toastify'

// API Imports
import { getDispatcherApi, updateDispatcherApi, getTeamsApi } from '@/app/api/on2door/actions'

const schema = object({
  email: pipe(string(), nonEmpty('This field is required'), email('Please enter a valid email')),
  first_name: pipe(string(), nonEmpty('This field is required')),
  last_name: pipe(string(), nonEmpty('This field is required')),
  phone_number: pipe(string(), nonEmpty('This field is required')),
  team_ids: array(string())
})

const EditDispatcherDialog = ({ open, setOpen, currentDispatcher }) => {
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
      team_ids: []
    }
  })

  const { data: userData } = useQuery({
    queryKey: ['dispatcher', currentDispatcher?.id],
    queryFn: () => getDispatcherApi(currentDispatcher?.id),
    enabled: !!currentDispatcher?.id && open
  })

  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeamsApi(),
    enabled: open
  })
  const teams = teamsData?.teams?.data || []

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: ({ id, payload }) => updateDispatcherApi(id, payload),
    onMutate: () => setErrorState(null),

    onSuccess: () => {
      toast.success('Dispatcher updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      queryClient.invalidateQueries({
        predicate: query => {
          const queryKey = query.queryKey
          return (
            Array.isArray(queryKey) &&
            (queryKey[0] === 'dispatcher' || queryKey[0] === 'dispatchers')
          )
        }
      })
      setOpen(false)
      reset()
    },

    onError: err => setErrorState(err)
  })

  useEffect(() => {
    if (userData) {
      const user = userData?.administrator?.data?.attributes || {}

      reset({
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        team_ids: user.team_ids?.map(id => id.toString()) || []
      })
    }
  }, [userData, reset])

  const onSubmit = data => {
    const payload = {
      administrator: {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        team_ids: data.team_ids?.map(id => parseInt(id)) || []
      }
    }

    updateUser({ id: currentDispatcher?.id, payload })
  }

  const handleClose = () => {
    setOpen(false)
    setErrorState(null)
    reset()
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body' closeAfterTransition={false}>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Edit Dispatcher Information</div>
        <Typography component='span' className='flex flex-col text-center'>
          Update dispatcher details
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
              'Update failed. Please try again.'}
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
                    error={!!errors.phone_number}
                    helperText={errors.phone_number?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant='h6' className='mb-3'>
                Team Assignments
              </Typography>
              <Controller
                name='team_ids'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth disabled={isPending}>
                    <InputLabel>Select Teams</InputLabel>
                    <Select
                      multiple
                      value={field.value || []}
                      onChange={e => field.onChange(e.target.value)}
                      input={<OutlinedInput label='Select Teams' />}
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value, index) => {
                            const team = teams.find(t => t.id.toString() === value)
                            return (
                              <Chip
                                key={`${value}-${index}`}
                                label={team ? team.attributes.name : `Team ${value}`}
                                size='small'
                              />
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
                  </FormControl>
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
          {isPending ? 'Updating...' : 'Update Dispatcher'}
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditDispatcherDialog
