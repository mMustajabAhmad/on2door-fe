// MUI Imports
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

const HubOverview = ({ hubs }) => {
  if (!hubs || hubs.length === 0) {
    return (
      <Box className='text-center py-8'>
        <Typography variant='body2' className='text-textSecondary'>
          No hubs found
        </Typography>
      </Box>
    )
  }

  return (
    <List>
      {hubs.map((hub, index) => {
        const attributes = hub.attributes || {}
        const address = attributes.address || {}

        return (
          <Box key={hub.id}>
            <ListItem className='px-0'>
              <ListItemText
                primary={
                  <Typography variant='body2' className='font-medium'>
                    {attributes.name}
                  </Typography>
                }
                secondaryTypographyProps={{ component: 'span' }}
                secondary={
                  <Box>
                    <Typography variant='caption' className='text-textSecondary block'>
                      {address.street}, {address.city}
                    </Typography>
                    <Box className='flex items-center gap-2 mt-1'>
                      <Chip
                        label={`${attributes.team_ids?.length || 0} Teams`}
                        size='small'
                        color='primary'
                        className='text-xs'
                      />
                      <Chip
                        label={`${attributes.driver_ids?.length || 0} Drivers`}
                        size='small'
                        color='info'
                        className='text-xs'
                      />
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            {index < hubs.length - 1 && <Divider />}
          </Box>
        )
      })}
    </List>
  )
}

export default HubOverview
