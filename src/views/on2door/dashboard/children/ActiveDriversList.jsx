// MUI Imports
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

const ActiveDriversList = ({ drivers }) => {
  if (!drivers || drivers.length === 0) {
    return (
      <Box className='text-center py-8'>
        <Typography variant='body2' className='text-textSecondary'>
          No active drivers found
        </Typography>
      </Box>
    )
  }

  return (
    <List>
      {drivers.map((driver, index) => {
        const attributes = driver.attributes || {}

        return (
          <ListItem key={driver.id} className='px-0'>
            <ListItemAvatar>
              <Avatar>{attributes.first_name?.[0] || 'D'}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant='body2' className='font-medium'>
                  {attributes.first_name} {attributes.last_name}
                </Typography>
              }
              secondaryTypographyProps={{ component: 'span' }}
              secondary={
                <Box className='flex items-center gap-2'>
                  <Typography variant='caption' className='text-textSecondary'>
                    {attributes.email}
                  </Typography>
                  <Chip label='Active' size='small' color='success' className='text-xs' />
                </Box>
              }
            />
          </ListItem>
        )
      })}
    </List>
  )
}

export default ActiveDriversList
