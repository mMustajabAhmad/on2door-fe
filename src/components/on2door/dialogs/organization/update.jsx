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

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, pipe, nonEmpty } from 'valibot'
import { toast } from 'react-toastify'

// API Imports
import { getOrganizationApi, updateOrganizationApi } from '@/app/api/on2door/actions'

const schema = object({
  name: pipe(string(), nonEmpty('organization name is required')),
  email: pipe(string(), nonEmpty('Email is required')),
  message: pipe(string(), nonEmpty('Message is required')),
  monthly_delivery_volume: pipe(string(), nonEmpty('This field is required')),
  primary_industry: pipe(string(), nonEmpty('This field is required')),
  country: pipe(string(), nonEmpty('Country is required')),
})

const EditOrganizationDialog = ({ open, setOpen, currentOrganization }) => {
  const [errorState, setErrorState] = useState(null)
  const queryClient = useQueryClient()

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      primary_industry: '',
      monthly_delivery_volume: '',
      country: ''
    }
  })

  const { data: organizationData } = useQuery({
    queryKey: ['organization', currentOrganization?.id],
    queryFn: () => getOrganizationApi(currentOrganization?.id),
    enabled: !!currentOrganization?.id && open
  })


  const { mutate: updateOrganization, isPending } = useMutation({
    mutationFn: ({ id, payload }) => updateOrganizationApi(id, payload),

    onMutate: () => setErrorState(null),

    onSuccess: () => {
      toast.success('Organization updated successfully!', {
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
          return Array.isArray(queryKey) && (queryKey[0] === 'organization' || queryKey[0] === 'organizations')
        }
      })
      setOpen(false)
      reset()
    },

    onError: err => setErrorState(err)
  })

  useEffect(() => {
   if (organizationData) {
      const organization = organizationData.organization?.data?.attributes || {}

      reset({
        name: organization.name || '',
        email: organization.email || '',
        message: organization.message || '',
        primary_industry: organization.primary_industry || '',
        monthly_delivery_volume: organization.monthly_delivery_volume || '',
        country: organization.country || ''
      })
    }
  }, [organizationData, reset])

  const onSubmit = data => {
    const payload = {
      organization: {
        name: data.name,
        email: data.email,
        message: data.message,
        primary_industry: data.primary_industry,
        monthly_delivery_volume: data.monthly_delivery_volume,
        country: data.country
      }
    }

    updateOrganization({ id: currentOrganization?.id, payload })
  }

  const handleClose = () => {
    setOpen(false)
    setErrorState(null)
    reset()
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body' closeAfterTransition={false}>
      <DialogTitle className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center text-xl font-semibold'>Edit Organization Information</div>
        <Typography component='span' className='flex flex-col text-center'>
          Update organization details
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
                    label='Organization Name'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>


            <Grid size={{ xs: 12 }}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Email'
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='message'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Message'
                    error={!!errors.message}
                    helperText={errors.message?.message}
                    disabled={isPending}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name='monthly_delivery_volume'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.monthly_delivery_volume}>
                    <InputLabel id='monthly-delivery-volume-label'>Monthly Delivery Volume</InputLabel>
                    <Select
                      labelId='monthly-delivery-volume-label'
                      value={field.value}
                      label='Monthly Delivery Volume'
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    >
                      <MenuItem value=''>Select an option</MenuItem>
                      <MenuItem value='range_0_100'>0-100</MenuItem>
                      <MenuItem value='range_101_2000'>101-2000</MenuItem>
                      <MenuItem value='range_2001_5000'>2001-5000</MenuItem>
                      <MenuItem value='range_5001_12500'>5001-12500</MenuItem>
                      <MenuItem value='range_12501_plus'>12501+</MenuItem>
                    </Select>
                    {errors.monthly_delivery_volume && (
                      <FormHelperText>{errors.monthly_delivery_volume.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
              name='primary_industry'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.primary_industry}>
                  <InputLabel id='primary-industry-label'>Primary Industry</InputLabel>
                  <Select
                    labelId='primary-industry-label'
                    value={field.value}
                    label='Primary Industry'
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  >
                    <MenuItem value=''>Select an option</MenuItem>
                    <MenuItem value='construction'>Construction</MenuItem>
                    <MenuItem value='grocery'>Grocery</MenuItem>
                    <MenuItem value='pharmacy'>Pharmacy</MenuItem>
                    <MenuItem value='preparedfood'>Prepared Food</MenuItem>
                    <MenuItem value='restaurants'>Restaurants</MenuItem>
                    <MenuItem value='retail'>Retail</MenuItem>
                    <MenuItem value='others'>Others</MenuItem>
                  </Select>
                  {errors.primary_industry && <FormHelperText>{errors.primary_industry.message}</FormHelperText>}
                </FormControl>
              )}
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
          {isPending ? 'Updating...' : 'Update Organization'}
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditOrganizationDialog
