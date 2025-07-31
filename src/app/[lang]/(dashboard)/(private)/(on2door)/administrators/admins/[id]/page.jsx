// Next Imports
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
// import UserLeftOverview from '@views/apps/user/view/user-left-overview'
// import UserRight from '@views/apps/user/view/user-right'

import AdminLeftOverview from '@/views/on2door/apps/administrators/admins/view/admin-left-overview'
import AdminRight from '@/views/on2door/apps/administrators/admins/view/admin-right'

// Data Imports
import { getPricingData, getAdminById } from '@/app/server/actions'

// const OverViewTab = dynamic(() => import('@views/apps/user/view/user-right/overview'))
// const SecurityTab = dynamic(() => import('@views/apps/user/view/user-right/security'))
// const BillingPlans = dynamic(() => import('@views/apps/user/view/user-right/billing-plans'))
// const NotificationsTab = dynamic(() => import('@views/apps/user/view/user-right/notifications'))
// const ConnectionsTab = dynamic(() => import('@views/apps/user/view/user-right/connections'))

const OverViewTab = dynamic(() => import('@/views/on2door/apps/administrators/admins/view/admin-right/overview'))
const SecurityTab = dynamic(() => import('@/views/on2door/apps/administrators/admins/view/admin-right/security'))
const BillingPlans = dynamic(() => import('@/views/on2door/apps/administrators/admins/view/admin-right/billing-plans'))
const NotificationsTab = dynamic(() => import('@/views/on2door/apps/administrators/admins/view/admin-right/notifications'))
const ConnectionsTab = dynamic(() => import('@/views/on2door/apps/administrators/admins/view/admin-right/connections'))

// Vars
const tabContentList = (data, userData) => ({
  overview: <OverViewTab userData={userData} />,
  security: <SecurityTab userData={userData} />,
  'billing-plans': <BillingPlans data={data} userData={userData} />,
  notifications: <NotificationsTab userData={userData} />,
  connections: <ConnectionsTab userData={userData} />
})

const UserViewPage = async ({ params }) => {
  // Get user data by ID
  const userData = await getAdminById(params.id)

  if (!userData)  notFound()

  // Get pricing data for billing plans
  const data = await getPricingData()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 4, md: 5 }}>
        <AdminLeftOverview userData={userData} />
      </Grid>
      <Grid size={{ xs: 12, lg: 8, md: 7 }}>
        <AdminRight tabContentList={tabContentList(data, userData)} />
      </Grid>
    </Grid>
  )
}

export default UserViewPage
