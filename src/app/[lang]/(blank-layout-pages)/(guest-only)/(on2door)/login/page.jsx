import React from 'react'
// Component Imports
import Signin from '@views/on2door/auth/Signin'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Signin',
  description: 'Signin to your account'
}

const SigninPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Signin mode={mode} />
}

export default SigninPage
