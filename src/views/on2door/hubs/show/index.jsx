// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import HubDetails from './children/HubDetails'
import HubTeams from './children/HubTeams'

const HubOverview = ({ userData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 4, md: 5 }}>
        <HubDetails userData={userData} />
      </Grid>
      <Grid size={{ xs: 12, lg: 8, md: 7 }}>
        <HubTeams userData={userData} />
      </Grid>
    </Grid>
  )
}

export default HubOverview
