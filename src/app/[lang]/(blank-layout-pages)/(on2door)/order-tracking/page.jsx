// Component Imports
import OrderTracking from '@/views/on2door/order-tracking'

export const metadata = {
  title: 'Track Your Order',
  description: 'Track your delivery order in real-time'
}

const OrderTrackingPage = async ({ searchParams }) => {
  const params = await searchParams
  const taskShortId = params?.task_short_id || ''

  return <OrderTracking taskShortId={taskShortId}/>
}

export default OrderTrackingPage
