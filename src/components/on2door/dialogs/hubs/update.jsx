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
import OutlinedInput from '@mui/material/OutlinedInput'
import Chip from '@mui/material/Chip'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, pipe, nonEmpty, optional, array } from 'valibot'
import { toast } from 'react-toastify'

// API Imports
import { getHubApi, updateHubApi, getTeamsApi } from '@/app/api/on2door/actions'

const schema = object({
  name: pipe(string(), nonEmpty('Hub name is required')),
  street: pipe(string(), nonEmpty('Street is required')),
  city: pipe(string(), nonEmpty('City is required')),
  country: pipe(string(), nonEmpty('Country is required')),
  state: optional(string()),
  postal_code: optional(string()),
  team_ids: optional(array(string()))
})

const EditHubDialog = ({ open, setOpen, currentHub }) => {
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
      name: '',
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      team_ids: []
    }
  })

  const { data: hubData } = useQuery({
    queryKey: ['hub', currentHub?.id],
    queryFn: () => getHubApi(currentHub?.id),
    enabled: !!currentHub?.id && open
  })

  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeamsApi()
  })

  const teams = teamsData?.teams?.data || []

  const { mutate: updateHub, isPending } = useMutation({
    mutationFn: ({ id, payload }) => updateHubApi(id, payload),

    onMutate: () => setErrorState(null),

    onSuccess: () => {
      toast.success('Hub updated successfully!', {
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
          return Array.isArray(queryKey) && (queryKey[0] === 'hub' || queryKey[0] === 'hubs')
        }
      })
      setOpen(false)
      reset()
    },

    onError: err => setErrorState(err)
  })

  useEffect(() => {
    // Use currentHub data if available, otherwise use API data
   if (hubData) {
      const hub = hubData?.data?.attributes || {}
      const address = hub.address || {}

      reset({
        name: hub.name || '',
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        postal_code: address.postal_code || '',
        country: address.country || '',
        team_ids: hub.team_ids?.map(id => id.toString()) || []
      })
    }
  }, [hubData, reset])

  const onSubmit = data => {
    const payload = {
      hub: {
        name: data.name,
        address_attributes: {
          street: data.street,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country
        },
        team_ids: data.team_ids?.map(id => parseInt(id)) || []
      }
    }

    updateHub({ id: currentHub?.id, payload })
  }

  const handleClose = () => {
    setOpen(false)
    setErrorState(null)
    reset()
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body' closeAfterTransition={false}>
      <DialogTitle className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center text-xl font-semibold'>Edit Hub Information</div>
        <Typography component='span' className='flex flex-col text-center'>
          Update hub details
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
            <Grid size={{ xs: 12 }}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Hub Name'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant='h6' className='mb-3'>
                Address Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='street'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Street Address'
                    error={!!errors.street}
                    helperText={errors.street?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='City'
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='state'
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label='State/Province' disabled={isPending} />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='postal_code'
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label='Postal Code' disabled={isPending} />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='country'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Country'
                    error={!!errors.country}
                    helperText={errors.country?.message}
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
                  <FormControl fullWidth disabled={isPending}>
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
          {isPending ? 'Updating...' : 'Update Hub'}
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditHubDialog
