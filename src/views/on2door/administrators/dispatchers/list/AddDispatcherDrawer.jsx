'use client'

// React Imports
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, email, pipe, nonEmpty } from 'valibot'
import { toast } from 'react-toastify'

// API Imports
import { createAdministratorInvitationApi } from '@/app/api/on2door/actions'

// Validation Schema
const schema = object({
  email: pipe(string(), nonEmpty('This field is required'), email('Please enter a valid email')),
  first_name: pipe(string(), nonEmpty('This field is required')),
  last_name: pipe(string(), nonEmpty('This field is required')),
  phone_number: pipe(string(), nonEmpty('This field is required'))
})

const AddDispatcherDrawer = ({ open, handleClose }) => {
  // States
  const [errorState, setErrorState] = useState(null)
  const queryClient = useQueryClient()

  // Form hook
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
      phone_number: ''
    }
  })

  // Create dispatcher mutation
  const { mutate: createDispatcher, isPending } = useMutation({
    mutationFn: createAdministratorInvitationApi,
    onMutate: () => setErrorState(null),
    onSuccess: () => {
      toast.success('Dispatcher invitation sent successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })

      // Invalidate dispatcher queries to refresh the list
      queryClient.invalidateQueries({
        predicate: query => {
          const queryKey = query.queryKey
          return Array.isArray(queryKey) && (queryKey[0] === 'dispatcher' || queryKey[0] === 'dispatchers')
        }
      })

      handleClose()
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
      role: 'dispatcher',
      is_read_only: false,
      is_active: false
    }

    createDispatcher(payload)
  }

  const handleReset = () => {
    handleClose()
    setErrorState(null)
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Add New Dispatcher</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        {errorState && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {errorState?.response?.data?.error ||
              errorState?.response?.data?.message ||
              'Failed to create dispatcher. Please try again.'}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          <Controller
            name='first_name'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='First Name'
                placeholder='John'
                error={Boolean(errors.first_name)}
                helperText={errors.first_name?.message}
              />
            )}
          />

          <Controller
            name='last_name'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Last Name'
                placeholder='Doe'
                error={Boolean(errors.last_name)}
                helperText={errors.last_name?.message}
              />
            )}
          />

          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='email'
                label='Email'
                placeholder='john.doe@example.com'
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name='phone_number'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Phone Number'
                placeholder='+921234567890'
                error={Boolean(errors.phone_number)}
                helperText={errors.phone_number?.message}
              />
            )}
          />

          <div className='flex items-center gap-4'>
            <Button
              variant='contained'
              type='submit'
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={20} /> : null}
            >
              {isPending ? 'Creating...' : 'Create Dispatcher'}
            </Button>
            <Button variant='outlined' color='error' type='button' onClick={handleReset}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddDispatcherDrawer
