// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import HubListTable from './children/HubListTable'

const HubList = ({
  userData,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  searchQuery,
  setSearchQuery,
  city,
  onCityChange,
  state,
  onStateChange,
  country,
  onCountryChange,
  hasTeams,
  onHasTeamsChange
}) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <HubListTable
          tableData={userData}
          page={page}
          perPage={perPage}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          city={city}
          onCityChange={onCityChange}
          state={state}
          onStateChange={onStateChange}
          country={country}
          onCountryChange={onCountryChange}
          hasTeams={hasTeams}
          onHasTeamsChange={onHasTeamsChange}
        />
      </Grid>
    </Grid>
  )
}

export default HubList
