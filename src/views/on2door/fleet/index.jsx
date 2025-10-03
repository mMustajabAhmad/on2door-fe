'use client'

// React Imports
import { useState } from 'react'

// Third-party Imports
import classNames from 'classnames'

//Components Imports
import FleetMap from './children/FleetMap'
import FleetSidebar from './children/FleetSidebar'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'

const Fleet = ({ mapboxAccessToken }) => {
  // States
  const [selectedDriver, setSelectedDriver] = useState(null)

  // Hooks
  const { settings } = useSettings()

  // Handlers
  const handleDriverSelect = driver => setSelectedDriver(driver)

  return (
    <div
      className={classNames(
        commonLayoutClasses.contentHeightFixed,
        'flex is-full overflow-hidden rounded-xl relative',
        {
          border: settings.skin === 'bordered',
          'shadow-md': settings.skin !== 'bordered'
        }
      )}
    >
      <FleetSidebar selectedDriver={selectedDriver} onDriverSelect={handleDriverSelect} />
      <FleetMap
        mapboxAccessToken={mapboxAccessToken}
        selectedDriver={selectedDriver}
        onDriverSelect={handleDriverSelect}
      />
    </div>
  )
}

export default Fleet
