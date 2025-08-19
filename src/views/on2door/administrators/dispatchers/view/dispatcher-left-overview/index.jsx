// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UserDetails from './DsipatcherDetails'
// import UserPlan from './DispatcherPlan'

const UserLeftOverview = ({ userData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserDetails userData={userData} />
      </Grid>
      {/* <Grid size={{ xs: 12 }}>
        <UserPlan userData={userData} />
      </Grid> */}
    </Grid>
  )
}

export default UserLeftOverview
