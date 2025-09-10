'use client'

// React Imports
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { loginAdministratorApi } from '@/app/api/on2door/actions'

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

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, email, pipe, nonEmpty } from 'valibot'
import classnames from 'classnames'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Validation schema
const schema = object({
  email: pipe(string(), minLength(1, 'This field is required'), email('Please enter a valid email address')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(6, 'Password must be at least 6 characters long')
  )
})

const Login = ({ mode }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState(null)

  const darkImg = '/images/pages/auth-v2-mask-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang: locale } = useParams()
  const { settings } = useSettings()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  useEffect(() => {
    const showSessionExpiredToast = localStorage.getItem('showSessionExpiredToast')
    if (showSessionExpiredToast === 'true') {
      toast.error('Session expired. Please login again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      // flag created in AuthGuard when redirecting due to expired token
      localStorage.removeItem('showSessionExpiredToast')
    }
  }, [])

  const { mutate: loginAdministrator, isPending } = useMutation({
    mutationFn: loginAdministratorApi,

    onMutate: () => setErrorState(null),

    onSuccess: dataRes => {
      const user = dataRes?.administrator?.data?.attributes
      const token = user?.auth_token

      // Use utility function to set auth data
      if (token && user) {
        localStorage.setItem('authToken', token)
        localStorage.setItem('currentUser', JSON.stringify(user))
      }

      const redirectURL = searchParams.get('redirectTo') ?? '/'
      router.replace(getLocalizedUrl(redirectURL, locale))
    },

    onError: err => setErrorState(err)
  })

  const onSubmit = data => {
    const payload = {
      administrator: {
        email: data.email,
        password: data.password
      }
    }
    loginAdministrator(payload)
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          { 'border-ie': settings.skin === 'bordered' }
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
          image1={{ src: '/images/illustrations/objects/tree-2.png' }}
          image2={null}
          maskImg={{ src: authBackground }}
        />
      </div>

      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>

        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]'>
          <div>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
            <Typography>Please sign-in to your account and start the adventure</Typography>
          </div>

          {errorState && (
            <Alert severity='error'>
              {errorState?.response?.status === 401
                ? 'Invalid email or password. Please try again.'
                : errorState?.message || 'Login failed. Please check your credentials.'}
            </Alert>
          )}

          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  autoFocus
                  type='email'
                  label='Email'
                  onChange={e => {
                    field.onChange(e.target.value)
                    if (errorState) setErrorState(null)
                  }}
                  {...(errors.email && { error: true, helperText: errors.email.message })}
                />
              )}
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
                  onChange={e => {
                    field.onChange(e.target.value)
                    if (errorState) setErrorState(null)
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          size='small'
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={e => e.preventDefault()}
                          aria-label='toggle password visibility'
                        >
                          <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...(errors.password && { error: true, helperText: errors.password.message })}
                />
              )}
            />

            <div className='flex justify-between items-center flex-wrap gap-x-3 gap-y-1'>
              <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' />
              <Typography className='text-end' color='primary.main' component={Link} href='/forgot-password'>
                Forgot password?
              </Typography>
            </div>

            <Button fullWidth variant='contained' type='submit' disabled={isPending}>
              {isPending ? (
                <>
                  Logging in... <CircularProgress size={20} sx={{ color: '#fff', ml: 2 }} />
                </>
              ) : (
                'Log In'
              )}
            </Button>

            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} href='/signup' color='primary.main'>
                Create an account
              </Typography>
            </div>
          </form>

          <Divider className='gap-3'>or</Divider>
          <Button
            color='secondary'
            className='self-center text-textPrimary'
            startIcon={<img src='/images/logos/google.png' alt='Google' width={22} />}
            sx={{ '& .MuiButton-startIcon': { marginInlineEnd: 3 } }}
            onClick={() => signIn('google')}
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login
