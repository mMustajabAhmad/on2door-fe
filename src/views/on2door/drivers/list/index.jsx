// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import DriverListTable from './children/DriverListTable'

const DriverList = ({
  driverData,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  searchQuery,
  setSearchQuery,
  status,
  onStatusChange
}) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <DriverListTable
          tableData={driverData}
          page={page}
          perPage={perPage}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          status={status}
          onStatusChange={onStatusChange}
        />
      </Grid>
    </Grid>
  )
}

export default DriverList
