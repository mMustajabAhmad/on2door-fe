// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import OrganizationDetails from './children/OrganizationDetails'

const OrganizationOverview = ({ organizationData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <OrganizationDetails organizationData={organizationData} />
      </Grid>
    </Grid>
  )
}

export default OrganizationOverview
