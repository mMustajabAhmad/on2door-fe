// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AdminListTable from './children/AdminListTable'

const AdminList = ({
  userData,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  searchQuery,
  setSearchQuery,
  role,
  onRoleChange,
  status,
  onStatusChange
}) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AdminListTable
          tableData={userData}
          page={page}
          perPage={perPage}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          role={role}
          onRoleChange={onRoleChange}
          status={status}
          onStatusChange={onStatusChange}
        />
      </Grid>
    </Grid>
  )
}

export default AdminList
