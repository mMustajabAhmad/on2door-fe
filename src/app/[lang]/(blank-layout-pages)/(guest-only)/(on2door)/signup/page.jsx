// Component Imports
import Signup from '@views/on2door/auth/Signup'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Signup',
  description: 'Signup to your account'
}

const SignupPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Signup mode={mode} />
}

export default SignupPage 
