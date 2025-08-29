// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import HubLeftOverview from './children/HubDetails'
import HubRight from './children/HubTeams'

const HubOverview = ({ userData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 4, md: 5 }}>
        <HubLeftOverview userData={userData} />
      </Grid>
      <Grid size={{ xs: 12, lg: 8, md: 7 }}>
        <HubRight userData={userData} />
      </Grid>
    </Grid>
  )
}

export default HubOverview
