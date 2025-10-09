// // Third-party Imports
// import { getServerSession } from 'next-auth'

// // Component Imports
// import AuthRedirect from '@/components/AuthRedirect'

// export default async function AuthGuard({ children, locale }) {
//   const session = await getServerSession()

//   return <>{session ? children : <AuthRedirect lang={locale} />}</>
// }
'use client'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken')

    if (!token)
      router.replace('/login')
    else setChecked(true)
  }, [router])

  if (!checked) return null
  
return children
}
