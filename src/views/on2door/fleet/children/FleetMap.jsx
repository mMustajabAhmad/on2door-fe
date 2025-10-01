// React Imports
import { useRef, useEffect, useState, useCallback } from 'react'

// Third-party Imports
import { Map as MapboxMap, Marker, Source, Layer } from 'react-map-gl'
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

  // State for routes
  const [routes, setRoutes] = useState(new Map())

  // Function to fetch route from Mapbox Directions API
  const fetchRoute = useCallback(async (driverLat, driverLng, destLat, destLng) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${driverLng},${driverLat};${destLng},${destLat}?geometries=geojson&overview=full&steps=false&access_token=${mapboxAccessToken}`
      )

      if (!response.ok) throw new Error('Failed to fetch route')
      
      const data = await response.json()

      if (data.routes && data.routes.length > 0) {
        const route = {
          type: 'Feature',
          properties: {},
          geometry: data.routes[0].geometry
        }
        
        return route
      }
    } catch (error) {
      console.error('Error fetching route:', error)
      return null
    }
  }, [mapboxAccessToken])

  //update route for a driver
  const updateDriverRoute = useCallback(async (driverId, driverLat, driverLng, destLat, destLng) => {
    const route = await fetchRoute(driverLat, driverLng, destLat, destLng)
    if (route) setRoutes(prev => new Map(prev.set(driverId, route)))
  }, [fetchRoute])

  // Update routes when drivers change
  useEffect(() => {
    drivers.forEach(driver => {
      if (driver.destination && driver.destination.dest_lat && driver.destination.dest_lng) {
        updateDriverRoute(
          driver.id,
          driver.latitude,
          driver.longitude,
          driver.destination.dest_lat,
          driver.destination.dest_lng
        )
      }
    })
  }, [drivers, updateDriverRoute])

  // Fly to selected driver when chosen from sidebar; no auto-fit on updates
  // useEffect(() => {
  //   if (drivers.length > 0 && mapRef.current) {
  //     const driver = drivers[0]
  //     mapRef.current.flyTo({
  //       center: [driver.longitude, driver.latitude],
  //       zoom: 16,
  //       duration: 2000
  //     })
  //   }
  // }, [drivers])

  useEffect(() => {
    if (selectedDriver && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedDriver.longitude, selectedDriver.latitude],
        zoom: 16,
        duration: 1500
      })
    }
  }, [selectedDriver])

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

      <MapboxMap
        mapboxAccessToken={mapboxAccessToken}
        ref={mapRef}
        initialViewState={{ longitude: 73.999024, latitude: 31.75249842, zoom: 12.5 }}
        mapStyle='mapbox://styles/mapbox/light-v9'
        attributionControl={false}
      >
        {/* Route polylines */}
        {Array.from(routes.entries()).map(([driverId, route]) => (
          <Source key={`route-${driverId}`} id={`route-${driverId}`} type="geojson" data={route}>
            <Layer
              id={`route-line-${driverId}`}
              type="line"
              paint={{
                'line-color': '#3B82F6',
                'line-width': 4,
                'line-opacity': 0.8
              }}
            />
          </Source>
        ))}

        {/* Real-time drivers */}
        {drivers.map((driver, index) => {
          const isSelected = selectedDriver?.id === driver.id
          return (
            <div key={driver.id || index}>
              {/* Driver marker */}
              <Marker
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

              {/* Destination pin */}
              {driver.destination && driver.destination.dest_lat && driver.destination.dest_lng && (
                <Marker
                  longitude={driver.destination.dest_lng}
                  latitude={driver.destination.dest_lat}
                  style={{ display: 'flex' }}
                >
                <img
                  src='/images/apps/logistics/destination-pin.png'
                  height={isSelected ? 50 : 42}
                  width={isSelected ? 24 : 20}
                />
                </Marker>
              )}
            </div>
          )
        })}
      </MapboxMap>
    </div>
  )
}

export default FleetMap
