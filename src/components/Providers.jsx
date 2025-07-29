import ClientProviders from './ClientProviders'
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'

const Providers = async ({ children, direction }) => {
  const mode = await getMode()
  const settingsCookie = await getSettingsFromCookie()
  const systemMode = await getSystemMode()

  return (
    <ClientProviders mode={mode} settingsCookie={settingsCookie} systemMode={systemMode} direction={direction}>
      {children}
    </ClientProviders>
  )
}

export default Providers
