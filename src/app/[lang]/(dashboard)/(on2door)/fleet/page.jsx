// Component Imports
import Fleet from '@/views/on2door/fleet'

const FleetPage = () => {
  return <Fleet mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN} />
}

export default FleetPage
