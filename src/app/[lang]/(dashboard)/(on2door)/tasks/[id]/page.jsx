// Next Imports
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
// import UserLeftOverview from '@views/apps/user/view/user-left-overview'
// import UserRight from '@views/apps/user/view/user-right'

import TaskLeftOverview from '@/views/on2door/tasks/view/task-left-overview'
import TaskRight from '@/views/on2door/tasks/view/task-right'

// Data Imports
import { getPricingData, getTaskById } from '@/app/server/actions'

// const OverViewTab = dynamic(() => import('@views/apps/user/view/user-right/overview'))
// const SecurityTab = dynamic(() => import('@views/apps/user/view/user-right/security'))
// const BillingPlans = dynamic(() => import('@views/apps/user/view/user-right/billing-plans'))
// const NotificationsTab = dynamic(() => import('@views/apps/user/view/user-right/notifications'))
// const ConnectionsTab = dynamic(() => import('@views/apps/user/view/user-right/connections'))

const OverViewTab = dynamic(() => import('@/views/on2door/tasks/view/task-right/overview'))
const SecurityTab = dynamic(() => import('@/views/on2door/tasks/view/task-right/security'))
const BillingPlans = dynamic(() => import('@/views/on2door/tasks/view/task-right/billing-plans'))
const NotificationsTab = dynamic(() => import('@/views/on2door/tasks/view/task-right/notifications'))
const ConnectionsTab = dynamic(() => import('@/views/on2door/tasks/view/task-right/connections'))

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
  const { id } = await params
  const userData = await getTaskById(id)

  if (!userData) notFound()

  // Get pricing data for billing plans
  const data = await getPricingData()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 4, md: 5 }}>
        <TaskLeftOverview userData={userData} />
      </Grid>
      <Grid size={{ xs: 12, lg: 8, md: 7 }}>
        <TaskRight tabContentList={tabContentList(data, userData)} />
      </Grid>
    </Grid>
  )
}

export default UserViewPage
