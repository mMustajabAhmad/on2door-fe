// React Imports
import { useRef, useEffect } from 'react'

// Third-party Imports
import { Map, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Hook Imports
import { useRealTimeDrivers } from '@/hooks/useRealTimeDrivers'

// Style Imports
import './styles.css'

const FleetMap = props => {
  // Vars
  const { mapboxAccessToken, selectedDriver, onDriverSelect } = props

  // Hooks
  const mapRef = useRef()
  const { drivers, isConnected } = useRealTimeDrivers()

  // Update map view when driver location changes
  useEffect(() => {
    if (drivers.length > 0 && mapRef.current) {
      const driver = drivers[0]
      mapRef.current.flyTo({
        center: [driver.longitude, driver.latitude],
        zoom: 16,
        duration: 2000
      })
    }
  }, [drivers])

  // Auto-unhighlight
  useEffect(() => {
    if (selectedDriver && onDriverSelect) {
      const timer = setTimeout(() => {
        onDriverSelect(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [selectedDriver, onDriverSelect])

  return (
    <div className='is-full bs-full relative'>
      {/* Connection Status */}
      <div className='absolute top-4 right-4 z-10'>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {isConnected ? '🟢 Live' : '🔴 Offline'}
        </div>
      </div>

      <Map
        mapboxAccessToken={mapboxAccessToken}
        // eslint-disable-next-line lines-around-comment
        // @ts-ignore
        ref={mapRef}
        initialViewState={{ longitude: 73.999024, latitude: 31.75249842, zoom: 12.5 }}
        mapStyle='mapbox://styles/mapbox/light-v9'
        attributionControl={false}
      >
        {/* Real-time drivers */}
        {drivers.map((driver, index) => {
          const isSelected = selectedDriver?.id === driver.id
          return (
            <Marker
              key={driver.id || index}
              longitude={driver.longitude}
              latitude={driver.latitude}
              style={{ display: 'flex' }}
              onClick={() => onDriverSelect && onDriverSelect(driver)}
            >
              <img
                src='/images/apps/logistics/fleet-car.png'
                height={isSelected ? 50 : 42}
                width={isSelected ? 24 : 20}
                style={{
                  filter: isSelected
                    ? 'drop-shadow(0 0 10px #FF6B35) drop-shadow(0 0 20px #FF6B35)' // Orange highlight for selected
                    : 'drop-shadow(0 0 7px #4CAF50)', // Green for real-time
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                alt={`Driver ${driver.id}`}
              />
            </Marker>
          )
        })}
      </Map>
    </div>
  )
}

export default FleetMap
