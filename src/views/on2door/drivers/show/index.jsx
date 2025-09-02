// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import DriverDetails from './children/DriverDetails'

const DriverOverview = ({ driverData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <DriverDetails driverData={driverData} />
      </Grid>
    </Grid>
  )
}

export default DriverOverview
