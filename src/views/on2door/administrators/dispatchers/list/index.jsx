// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import DispatcherListTable from './children/DispatcherListTable'

const DispatcherList = ({
  userData,
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
        <DispatcherListTable
          tableData={userData}
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

export default DispatcherList
