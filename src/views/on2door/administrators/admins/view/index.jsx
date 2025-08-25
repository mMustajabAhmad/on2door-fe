// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AdminDetails from './children/AdminDetails'

const AdminOverview = ({ userData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AdminDetails userData={userData} />
      </Grid>
    </Grid>
  )
}

export default AdminOverview
