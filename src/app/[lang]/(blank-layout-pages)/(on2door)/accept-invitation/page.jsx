'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// API Imports
import { acceptAdministratorInvitationApi, acceptDriverInvitationApi } from '@/app/api/on2door/actions'

const AcceptInvitationPage = () => {
  // States
  const [errorState, setErrorState] = useState(null)
  const [invitationData, setInvitationData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [success, setSuccess] = useState(false)

  // Hooks
  const searchParams = useSearchParams()
  const router = useRouter()
  const { lang: locale } = useParams()

  // Get invitation token and email from URL
  useEffect(() => {
    const token = searchParams.get('invitation_token')
    const email = searchParams.get('email')

    if (!token || !email) {
      setErrorState({ message: 'Invalid invitation link. Missing token or email.' })
      setIsLoading(false)
      return
    }

    setInvitationData({ token, email })
    setIsLoading(false)
  }, [searchParams])

  const handleInvitation = async (payload) => {
    let adminError = null
    let driverError = null

    try {
      const response = await acceptAdministratorInvitationApi(payload)
      return response
    } catch (error) {
      adminError = error
    }

    try {
      const response = await acceptDriverInvitationApi(payload)
      return response
    } catch (error) {
      driverError = error
    }

    const errorMessage = 'Invalid invitation. This invitation may have expired, been used already, or the email address may not be associated with any pending invitations.'
    throw new Error(errorMessage)
  }

  // Accept invitation mutation
  const { mutate: acceptInvitation, isPending } = useMutation({
    mutationFn: handleInvitation,

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
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  const onSubmit = e => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setErrorState({ message: 'Passwords do not match' })
      return
    }

    const payload = {
      invitation_token: invitationData.token,
      email: invitationData.email,
      password: password
    }

    acceptInvitation(payload)
  }

  if (isLoading) {
    return (
      <Box className='flex items-center justify-center min-h-screen'>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  if (errorState && !invitationData) {
    return (
      <Box className='flex flex-col gap-5 max-w-[480px] mx-auto p-6'>
        <Typography variant='h4' color='error'>
          Invalid Invitation
        </Typography>
        <Typography color='text.secondary'>{errorState.message}</Typography>
        <Link href={getLocalizedUrl('/login', locale)}>Back to Login</Link>
      </Box>
    )
  }

  return (
    <Box className='flex flex-col gap-5 max-w-[480px] mx-auto p-6'>
      <Typography variant='h4'>Accept Invitation</Typography>
      {invitationData?.email ? <Typography color='text.secondary'>for {invitationData.email}</Typography> : null}

      {success && <Alert severity='success'>Invitation accepted successfully! Redirecting to login...</Alert>}

      {errorState && (
        <Alert severity='error'>
          {errorState?.response?.data?.error ||
            errorState?.response?.data?.message ||
            errorState?.message ||
            'Failed to accept invitation. Please try again.'}
        </Alert>
      )}

      <form onSubmit={onSubmit} className='flex flex-col gap-4'>
        <TextField
          label='Password'
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
          type={isConfirmPasswordShown ? 'text' : 'password'}
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          disabled={isPending}
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    size='small'
                    edge='end'
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={e => e.preventDefault()}
                    aria-label='toggle password confirmation visibility'
                  >
                    <i className={isConfirmPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />

        <Button type='submit' variant='contained' disabled={isPending}>
          {isPending ? 'Accepting Invitation...' : 'Accept Invitation'}
        </Button>

        <Link href={getLocalizedUrl('/login', locale)}>Back to Login</Link>
      </form>
    </Box>
  )
}

export default AcceptInvitationPage
