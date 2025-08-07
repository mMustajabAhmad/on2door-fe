// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UserListTable from './AdminListTable'
// import UserListCards from './AdminListCards'

const UserList = ({ userData, page, perPage, onPageChange, onPerPageChange }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid size={{ xs: 12 }}>
        <UserListCards />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <UserListTable
          tableData={userData}
          page={page}
          perPage={perPage}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
        />
      </Grid>
    </Grid>
  )
}

export default UserList
