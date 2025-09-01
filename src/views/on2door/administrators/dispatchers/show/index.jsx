// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import DispatcherDetails from './children/DispatcherDetails'

const DispatcherOverview = ({ dispatcherData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <DispatcherDetails dispatcherData={dispatcherData} />
      </Grid>
    </Grid>
  )
}

export default DispatcherOverview
