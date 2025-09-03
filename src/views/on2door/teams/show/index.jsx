// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import TeamDetails from './children/TeamDetails'

const TeamOverview = ({ teamData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <TeamDetails teamData={teamData} />
      </Grid>
    </Grid>
  )
}

export default TeamOverview
