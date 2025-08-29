// MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid2'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'

const TableFilters = ({ perPage, onPerPageChange, city, onCityChange, state, onStateChange }) => {

  const handleClearFilters = () => {
    onCityChange('')
    onStateChange('')
    onPerPageChange(10)
  }

  return (
    <CardContent>
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, sm: 3.5 }}>
          <FormControl fullWidth>
            <InputLabel id='city-select'>Select City</InputLabel>
            <Select
              fullWidth
              id='select-city'
              value={city}
              onChange={e => onCityChange(e.target.value)}
              label='Select City'
              labelId='city-select'
              inputProps={{ placeholder: 'Select City' }}
            >
              <MenuItem value=''>Select City</MenuItem>
              <MenuItem value='Karachi'>Karachi</MenuItem>
              <MenuItem value='Lahore'>Lahore</MenuItem>
              <MenuItem value='Islamabad'>Islamabad</MenuItem>
              <MenuItem value='Faisalabad'>Faisalabad</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 3.5 }}>
          <FormControl fullWidth>
            <InputLabel id='state-select'>Select State</InputLabel>
            <Select
              fullWidth
              id='select-state'
              label='Select State'
              value={state}
              onChange={e => onStateChange(e.target.value)}
              labelId='state-select'
              inputProps={{ placeholder: 'Select State' }}
            >
              <MenuItem value=''>Select State</MenuItem>
              <MenuItem value='Sindh'>Sindh</MenuItem>
              <MenuItem value='Punjab'>Punjab</MenuItem>
              <MenuItem value='KPK'>KPK</MenuItem>
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
