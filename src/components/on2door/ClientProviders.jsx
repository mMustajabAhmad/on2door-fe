'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

// Context Imports
// import { NextAuthProvider } from '@/contexts/nextAuthProvider'
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import { ActionCableProvider } from '@/contexts/ActionCableContext'
import ThemeProvider from '@components/theme'
import ReduxProvider from '@/redux-store/ReduxProvider'

// Styled Component Imports
import AppReactToastify from '@/libs/styles/AppReactToastify'

const ClientProviders = ({ children, mode, settingsCookie, systemMode, direction }) => {

  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {/* <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}> */}
      <ActionCableProvider>
        <VerticalNavProvider>
          <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
            <ThemeProvider direction={direction} systemMode={systemMode}>
              <ReduxProvider>{children}</ReduxProvider>
              <AppReactToastify direction={direction} hideProgressBar />
            </ThemeProvider>
          </SettingsProvider>
        </VerticalNavProvider>
      </ActionCableProvider>
      {/* </NextAuthProvider> */}
    </QueryClientProvider>
  )
}

export default ClientProviders
