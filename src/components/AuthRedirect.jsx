'use client'

// Next Imports
import { redirect, usePathname } from 'next/navigation'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const AuthRedirect = ({ lang }) => {
  const pathname = usePathname()

  // ℹ️ Bring me `lang`
  const redirectUrl = `/${lang}/signin?redirectTo=${pathname}`
  const signin = `/${lang}/signin`

  // const homePage = getLocalizedUrl(themeConfig.homePageUrl, lang)
  const on2doorDashboardPage = getLocalizedUrl(themeConfig.on2doorDashboardPageUrl, lang)

  return redirect(pathname === signin ? signin : pathname === on2doorDashboardPage ? signin : redirectUrl)
}

export default AuthRedirect
