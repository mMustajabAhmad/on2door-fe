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

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, pipe, nonEmpty, optional, array } from 'valibot'
import { toast } from 'react-toastify'

// API Imports
import { updateTeamApi, getHubsApi } from '@/app/api/on2door/actions'

const schema = object({
  name: pipe(string(), nonEmpty('Team name is required')),
  hub_id: optional(string()),
  administrator_ids: optional(array(string()))
})

const EditTeamDialog = ({ open, setOpen, currentTeam }) => {
  const [errorState, setErrorState] = useState(null)
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      name: '',
      hub_id: '',
      administrator_ids: []
    }
  })

  const { data: hubsData } = useQuery({
    queryKey: ['hubs'],
    queryFn: () => getHubsApi()
  })
  const hubs = hubsData?.hubs?.data || []

  useEffect(() => {
    if (currentTeam && open) {
      setValue('name', currentTeam.name || '')
      setValue('hub_id', currentTeam.hub_id?.toString() || '')
    }
  }, [currentTeam, open, setValue])

  const { mutate: updateTeam, isPending } = useMutation({
    mutationFn: ({ id, payload }) => updateTeamApi(id, payload),

    onMutate: () => setErrorState(null),

    onSuccess: () => {
      toast.success('Team updated successfully!', {
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
          return Array.isArray(queryKey) && (queryKey[0] === 'team' || queryKey[0] === 'teams')
        }
      })
      setOpen(false)
      reset()
    },

    onError: err => setErrorState(err)
  })

  const onSubmit = data => {
    const payload = {
      team: {
        name: data.name,
        hub_id: data.hub_id ? parseInt(data.hub_id) : null,
      }
    }

    updateTeam({ id: currentTeam.id, payload })
  }

  const handleClose = () => {
    setOpen(false)
    setErrorState(null)
    reset()
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body' closeAfterTransition={false}>
      <DialogTitle className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center text-xl font-semibold'>Edit Team</div>
        <Typography component='span' className='flex flex-col text-center'>
          Update team information
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
              'Failed to update team. Please try again.'}
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
                    label='Team Name'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12}}>
              <Controller
                name='hub_id'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth disabled={isPending}>
                    <InputLabel>Select Hub (Optional)</InputLabel>
                    <Select
                      value={field.value || ''}
                      onChange={e => field.onChange(e.target.value)}
                      input={<OutlinedInput label='Select Hub (Optional)' />}
                    >
                      <MenuItem value=''>
                        <em>No Hub Assigned</em>
                      </MenuItem>
                      {hubs.map(hub => (
                        <MenuItem key={hub.id} value={hub.id.toString()}>
                          {hub.attributes?.name || `Hub ${hub.id}`}
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
          {isPending ? 'Updating...' : 'Update Team'}
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditTeamDialog
