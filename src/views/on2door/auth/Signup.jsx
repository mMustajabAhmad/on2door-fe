'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material'

// Third-party Imports
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, email, minLength, pipe, nonEmpty } from 'valibot'
import { useMutation } from '@tanstack/react-query'

// Component Imports
import { countries } from 'countries-list'

import PhoneInput from 'react-phone-input-2'

import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { signupAdministratorApi } from '@/app/api/on2door/actions'

// Country data
import 'react-phone-input-2/lib/style.css'
import { useTheme } from '@mui/material/styles'

// Validation schema
const schema = object({
  email: pipe(string(), nonEmpty('This field is required'), email('Please enter a valid email')),
  password: pipe( string(), nonEmpty('This field is required'), minLength(6, 'Password must be at least 6 characters long')),
  organization_name: pipe(string(), nonEmpty('This field is required')),
  first_name: pipe(string(), nonEmpty('This field is required')),
  last_name: pipe(string(), nonEmpty('This field is required')),
  phone_number: pipe(string(), nonEmpty('This field is required')),
  country: pipe(string(), nonEmpty('This field is required')),
  monthly_delivery_volume: pipe(string(), nonEmpty('This field is required')),
  primary_industry: pipe(string(), nonEmpty('This field is required')),
  message: pipe(string(), nonEmpty('This field is required'))
})

const RegisterV2 = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState(null)

  // Vars
  const darkImg = '/images/pages/auth-v2-mask-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-register-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-register-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-register-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-register-light-border.png'

  // Hooks
  const { lang: locale } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const { settings } = useSettings()

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      organization_name: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      country: '',
      monthly_delivery_volume: '',
      primary_industry: '',
      message: ''
    }
  })

  const { mutate: signupAdministrator, isPending } = useMutation({
    mutationFn: signupAdministratorApi,

    onMutate: () => setErrorState(null),

    onSuccess: () => {
      const redirectURL = searchParams.get('redirectTo') ?? '/login'

      router.replace(getLocalizedUrl(redirectURL, locale))
    },

    onError: err => setErrorState(err)
  })

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit = data => {
    const payload = {
      administrator: {
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        organization_attributes: {
          name: data.organization_name,
          country: data.country,
          monthly_delivery_volume: data.monthly_delivery_volume,
          primary_industry: data.primary_industry,
          message: data.message
        }
      }
    }

    signupAdministrator(payload)
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className='plb-12 pis-12'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[500px] max-is-full bs-auto'
          />
        </div>
        <Illustrations
          image1={{ src: '/images/illustrations/objects/tree-3.png' }}
          image2={null}
          maskImg={{ src: authBackground }}
        />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[50%]'>
        <Link
          href={getLocalizedUrl('/', locale)}
          className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </Link>

        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]'>
          <div>
            <Typography variant='h4'>Ready. Set. Deliver 🚀</Typography>
            <Typography className='mbe-1'>From your hub to their hands, effortlessly!</Typography>
          </div>

          {errorState && (
            <Alert severity='error'>
              {errorState?.response?.data?.message
                ? Array.isArray(errorState.response.data.message)
                  ? errorState.response.data.message[0]
                  : errorState.response.data.message
                : errorState?.message
                  ? Array.isArray(errorState.message)
                    ? errorState.message[0]
                    : errorState.message
                  : 'Signup failed. Please check your information and try again.'}
            </Alert>
          )}

          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <div className='flex gap-4'>
              <Controller
                name='first_name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    autoFocus
                    label='First Name'
                    error={!!errors.first_name}
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
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                  />
                )}
              />
            </div>

            <div className='flex gap-4'>
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
                  />
                )}
              />
              <Controller
                name='country'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.country}>
                    <InputLabel id='country-label'>Country</InputLabel>
                    <Select
                      labelId='country-label'
                      value={field.value}
                      label='Country'
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    >
                      <MenuItem value=''>Select a country</MenuItem>
                      {Object.entries(countries).map(([code, country]) => (
                        <MenuItem key={code} value={code}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.country && <FormHelperText>{errors.country.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>

            <div className='flex gap-4'>
              <Controller
                name='phone_number'
                control={control}
                render={({ field }) => {
                  const theme = useTheme()
                  const commonBorder = `1px solid ${errors.phone_number ? theme.palette.error.main : theme.palette.divider}`

                  return (
                    <FormControl fullWidth error={!!errors.phone_number}>
                      <PhoneInput
                        country={watch('country')?.toLowerCase() || 'pk'}
                        value={field.value}
                        onChange={field.onChange}
                        specialLabel='Phone Number'
                        enableSearch
                        inputStyle={{
                          width: '100%',
                          height: '56px',
                          fontSize: '16px',
                          borderRadius: '5px',
                          backgroundColor: 'transparent',
                          border: commonBorder
                        }}
                        buttonStyle={{
                          backgroundColor: 'transparent',
                          border: commonBorder
                        }}
                        dropdownStyle={{
                          borderRadius: '4px',
                          color: '#727272'
                        }}
                        containerStyle={{ width: '100%' }}
                      />
                      {errors.phone_number && <FormHelperText>{errors.phone_number.message}</FormHelperText>}
                    </FormControl>
                  )
                }}
              />
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Password'
                    type={isPasswordShown ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              size='small'
                              edge='end'
                              onClick={handleClickShowPassword}
                              onMouseDown={e => e.preventDefault()}
                            >
                              <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                )}
              />
            </div>

            <div className='flex gap-4'>
              <Controller
                name='organization_name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Organization Name'
                    error={!!errors.organization_name}
                    helperText={errors.organization_name?.message}
                  />
                )}
              />
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
            </div>

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

            <Controller
              name='message'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Message'
                  multiline
                  error={!!errors.message}
                  helperText={errors.message?.message}
                />
              )}
            />

            <div className='flex justify-between items-center gap-3'>
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <>
                    <span>I agree to </span>
                    <Link className='text-primary' href='/' onClick={e => e.preventDefault()}>
                      privacy policy & terms
                    </Link>
                  </>
                }
              />
            </div>
            <Button fullWidth variant='contained' type='submit' disabled={isPending}>
              {isPending ? (
                <>
                  Creating Account... <CircularProgress size={20} sx={{ color: '#fff', ml: 2 }} />
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Already have an account?</Typography>
              <Typography component={Link} href={getLocalizedUrl('/login', locale)} color='primary.main'>
                Sign in instead
              </Typography>
            </div>
            <Divider className='gap-3'>or</Divider>
            <div className='flex justify-center items-center gap-2'>
              <IconButton size='small'>
                <i className='ri-facebook-fill text-facebook' />
              </IconButton>
              <IconButton size='small'>
                <i className='ri-twitter-fill text-twitter' />
              </IconButton>
              <IconButton size='small'>
                <i className='ri-github-fill text-github' />
              </IconButton>
              <IconButton size='small'>
                <i className='ri-google-fill text-googlePlus' />
              </IconButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterV2
