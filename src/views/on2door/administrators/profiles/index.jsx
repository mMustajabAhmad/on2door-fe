'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, email, pipe, nonEmpty } from 'valibot'
import { useQuery } from '@tanstack/react-query'

// API Imports
import { getAdminApi } from '@/app/api/on2door/actions'

// Component Imports
import EditProfileDialog from '@/components/on2door/dialogs/administrators/profile/update'

const schema = object({
  email: pipe(string(), nonEmpty('This field is required'), email('Please enter a valid email')),
  first_name: pipe(string(), nonEmpty('This field is required')),
  last_name: pipe(string(), nonEmpty('This field is required')),
  phone_number: pipe(string(), nonEmpty('This field is required'))
})

const ProfilePage = ({ userId }) => {
  const [open, setOpen] = useState(false)

  const {
    control,
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

  const { data: userData, isLoading } = useQuery({
    queryKey: ['administrator', userId],
    queryFn: () => getAdminApi(userId),
    enabled: !!userId
  })

  useEffect(() => {
    if (userData) {
      const user = userData?.administrator?.data?.attributes || {}
      reset({
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || ''
      })
    }
  }, [userData, reset])

  const handleEdit = () => {
    setOpen(true)
  }

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <CircularProgress />
      </Box>
    )
  }

  const user = userData?.administrator?.data?.attributes || {}

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          {/* Profile Header Card */}
          <Card>
            <CardContent className='flex gap-6 justify-center flex-col items-center md:items-end md:flex-row !pt-0 md:justify-start'>
              <div className='flex flex-col items-center sm:items-start gap-2'>
                <Typography variant='h4'>
                  {user.first_name} {user.last_name}
                </Typography>
                <div className='flex flex-wrap gap-6 justify-center sm:justify-normal'>
                  <div className='flex items-center gap-2'>
                    <i className='ri-user-3-line text-textSecondary' />
                    <Typography className='font-medium'>ID: {userId}</Typography>
                  </div>
                  <div className='flex items-center gap-2'>
                    <i className='ri-user-settings-line text-textSecondary' />
                    <Typography className='font-medium'>Role: {user.role || 'owner'}</Typography>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          {/* Edit Profile Information Card */}
          <Card>
            <CardContent>
              <Typography variant='h6' className='mb-4'>
                Edit Profile Information
              </Typography>

              <form>
                <Grid container spacing={4}>
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
                          disabled
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
                          disabled
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
                          disabled
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
                          disabled
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Box className='mt-4'>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleEdit}
                    startIcon={<i className='ri-settings-4-line text-base'></i>}
                  >
                    Update Profile
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <EditProfileDialog open={open} setOpen={setOpen} currentUser={{ id: userId }} />
    </>
  )
}

export default ProfilePage
