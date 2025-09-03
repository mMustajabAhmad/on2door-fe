'use client'

// React Imports

// MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid2'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'

// API Imports
import { getHubsApi } from '@/app/api/on2door/actions'
import { useQuery } from '@tanstack/react-query'

const TeamFilters = ({ perPage, onPerPageChange, hubFilter, onHubFilterChange }) => {
  const { data: hubsData } = useQuery({
    queryKey: ['hubs'],
    queryFn: () => getHubsApi()
  })

  const hubs = hubsData?.hubs?.data || []

  const handleClearFilters = () => {
    onHubFilterChange('')
    onPerPageChange(10)
  }

  return (
    <CardContent>
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, sm: 3.5 }}>
          <FormControl fullWidth>
            <InputLabel id='hub-select'>Select Hub</InputLabel>
            <Select
              fullWidth
              id='select-hub'
              value={hubFilter}
              onChange={e => onHubFilterChange(e.target.value)}
              label='Select Hub'
              labelId='hub-select'
              inputProps={{ placeholder: 'Select Hub' }}
            >
              <MenuItem value=''>All Hubs</MenuItem>
              {hubs.map(hub => (
                <MenuItem key={hub.id} value={hub.id.toString()}>
                  {hub.attributes?.name || `Hub ${hub.id}`}
                </MenuItem>
              ))}
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

export default TeamFilters
