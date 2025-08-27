// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UserDetails from './children/DsipatcherDetails'

const DispatcherOverview = ({ userData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserDetails userData={userData} />
      </Grid>
    </Grid>
  )
}

export default DispatcherOverview
