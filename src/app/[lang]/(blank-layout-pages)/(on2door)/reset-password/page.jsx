// Component Imports
import ResetPassword from '@/views/on2door/auth/ResetPassword'

export const metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your account'
}

const ResetPasswordPage = async ({ searchParams }) => {
  const token = (await searchParams)?.reset_password_token || ''
  const email = (await searchParams)?.email || ''

  return <ResetPassword token={token} email={email} />
}

export default ResetPasswordPage


