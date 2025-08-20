// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid2'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'

const TableFilters = ({ perPage, onPerPageChange, role, onRoleChange, status, onStatusChange }) => {
  // Remove local state - use props from parent instead
  // const [role, setRole] = useState('')
  // const [plan, setPlan] = useState('')
  // const [status, setStatus] = useState('')

  // Remove client-side filtering - API handles it now
  // useEffect(() => {
  //   const filteredData = tableData?.filter(user => {
  //     if (role && user.role !== role) return false
  //     if (plan && user.currentPlan !== plan) return false
  //     if (status && user.status !== status) return false
  //     return true
  //   })
  //   setData(filteredData || [])
  // }, [role, plan, status, tableData, setData])

  const handleClearFilters = () => {
    onRoleChange('')
    onStatusChange('')
    onPerPageChange(10)
  }

  return (
    <CardContent>
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, sm: 3.5 }}>
          <FormControl fullWidth>
            <InputLabel id='role-select'>Select Role</InputLabel>
            <Select
              fullWidth
              id='select-role'
              value={role}
              onChange={e => onRoleChange(e.target.value)}
              label='Select Role'
              labelId='role-select'
              inputProps={{ placeholder: 'Select Role' }}
            >
              <MenuItem value=''>Select Role</MenuItem>
              <MenuItem value='owner'>Owner</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
              {/* <MenuItem value='author'>Author</MenuItem>
              <MenuItem value='editor'>Editor</MenuItem>
              <MenuItem value='maintainer'>Maintainer</MenuItem>
              <MenuItem value='subscriber'>Subscriber</MenuItem> */}
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel id='plan-select'>Select Plan</InputLabel>
            <Select
              fullWidth
              id='select-plan'
              value={plan}
              onChange={e => setPlan(e.target.value)}
              label='Select Plan'
              labelId='plan-select'
              inputProps={{ placeholder: 'Select Plan' }}
            >
              <MenuItem value=''>Select Plan</MenuItem>
              <MenuItem value='basic'>Basic</MenuItem>
              <MenuItem value='company'>Company</MenuItem>
              <MenuItem value='enterprise'>Enterprise</MenuItem>
              <MenuItem value='team'>Team</MenuItem>
            </Select>
          </FormControl>
        </Grid> */}
        <Grid size={{ xs: 12, sm: 3.5 }}>
          <FormControl fullWidth>
            <InputLabel id='status-select'>Select Status</InputLabel>
            <Select
              fullWidth
              id='select-status'
              label='Select Status'
              value={status}
              onChange={e => onStatusChange(e.target.value)}
              labelId='status-select'
              inputProps={{ placeholder: 'Select Status' }}
            >
              <MenuItem value=''>Select Status</MenuItem>
              {/* <MenuItem value='pending'>Pending</MenuItem> */}
              <MenuItem value='active'>Active</MenuItem>
              <MenuItem value='inactive'>Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 3.5 }}>
          <FormControl fullWidth>
            <InputLabel id='per-page-select'>Records per page</InputLabel>
            <Select
              fullWidth
              id='select-per-page'
              label='Records per page'
              value={perPage}
              onChange={e => onPerPageChange(Number(e.target.value))}
              labelId='per-page-select'
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 1.5 }}>
          <Button
            variant='outlined'
            color='secondary'
            onClick={handleClearFilters}
            fullWidth
            sx={{ height: '55px', gap: 1.5 }}
          >
            Clear
            <i className='ri-filter-line'></i>
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
