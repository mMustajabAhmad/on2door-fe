'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// MUI
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'

// React Query
import { useMutation } from '@tanstack/react-query'

// API
import { resetPasswordApi } from '@/app/api/on2door/actions'

// Utils
import { getLocalizedUrl } from '@/utils/i18n'

const ResetPassword = ({ token, email }) => {
  const { lang: locale } = useParams()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isPasswordConfirmationShown, setIsPasswordConfirmationShown] = useState(false)
  const [errorState, setErrorState] = useState(null)
  const [success, setSuccess] = useState(false)

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: resetPasswordApi,

    onMutate: () => {
      setErrorState(null)
      setSuccess(false)
    },

    onSuccess: () => {
      setSuccess(true)
      setTimeout(() => router.replace(getLocalizedUrl('/login', locale)), 2000)
    },

    onError: err => setErrorState(err)
  })

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowPasswordConfirmation = () => setIsPasswordConfirmationShown(show => !show)

  const onSubmit = e => {
    e.preventDefault()
    const payload = {
      administrator: {
        reset_password_token: token,
        password,
        password_confirmation: passwordConfirmation
      }
    }
    resetPassword(payload)
  }

  return (
    <Box className='flex flex-col gap-5 max-w-[480px] mx-auto p-6'>
      <Typography variant='h4'>Set a new password</Typography>
      {email ? <Typography color='text.secondary'>for {email}</Typography> : null}

      {success && <Alert severity='success'>Password updated. Redirecting to login…</Alert>}
      {errorState && (
        <Alert severity='error'>
          {errorState?.response?.data?.error ||
            errorState?.response?.data?.message ||
            'Reset failed. Please try again.'}
        </Alert>
      )}

      <form onSubmit={onSubmit} className='flex flex-col gap-4'>
        <TextField
          label='New Password'
          type={isPasswordShown ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={isPending}
          fullWidth
          slotProps={{
            input: {
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
            }
          }}
        />
        <TextField
          label='Confirm Password'
          type={isPasswordConfirmationShown ? 'text' : 'password'}
          value={passwordConfirmation}
          onChange={e => setPasswordConfirmation(e.target.value)}
          disabled={isPending}
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    size='small'
                    edge='end'
                    onClick={handleClickShowPasswordConfirmation}
                    onMouseDown={e => e.preventDefault()}
                    aria-label='toggle password confirmation visibility'
                  >
                    <i className={isPasswordConfirmationShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />
        <Button type='submit' variant='contained' disabled={isPending}>
          {isPending ? 'Updating…' : 'Update Password'}
        </Button>
        <Link href={getLocalizedUrl('/login', locale)}>Back to Login</Link>
      </form>
    </Box>
  )
}

export default ResetPassword
