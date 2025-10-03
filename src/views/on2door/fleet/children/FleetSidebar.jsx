// React Imports
import { useEffect } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Hook Imports
import { useRealTimeDrivers } from '@/hooks/on2door/useRealTimeDrivers'

const FleetSidebar = ({ selectedDriver, onDriverSelect }) => {
  // Hooks
  const { drivers, isConnected } = useRealTimeDrivers()

  const handleDriverClick = driver => onDriverSelect(driver)

  return (
    <Box sx={{ width: 360, height: '100%', borderRight: 1, borderColor: 'divider' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant='h5'>Active Drivers</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={isConnected ? 'Live' : 'Offline'} color={isConnected ? 'success' : 'error'} size='small' />
          <Typography variant='body2' color='text.secondary'>
            {drivers.length} driver{drivers.length !== 1 ? 's' : ''} online
          </Typography>
        </Box>
      </Box>

      {/* Drivers List */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
          {drivers.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                {isConnected ? 'No active drivers found' : 'Connecting to drivers...'}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {drivers.map((driver, index) => (
                <Box key={driver.id || index}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleDriverClick(driver)}
                      selected={selectedDriver?.id === driver.id}
                      sx={{ py: 2, px: 3 }}
                    >
                      <ListItemAvatar sx={{ minWidth: 38 }}>
                        <Avatar
                          variant='rounded'
                          skin='light'
                          sx={{
                            width: 30,
                            height: 30,
                            fontSize: '1rem',
                            color: selectedDriver?.id === driver.id ? 'primary.main' : 'text.secondary'
                          }}
                        >
                          <i className='ri-steering-line' />
                        </Avatar>
                      </ListItemAvatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant='subtitle2' fontWeight={600} sx={{ mb: 0.5 }}>
                          {driver.name || `Driver ${driver.id}`}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.875rem', mb: 0.25 }}>
                          ID: {driver.id} | Task: {driver.task_id}
                        </Typography>
                        <Typography variant='caption' color='text.secondary' sx={{ fontSize: '0.75rem' }}>
                          Last seen: {driver.timestamp ? new Date(driver.timestamp).toLocaleTimeString() : 'Now'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                        <Chip label='Active' color='success' size='small' variant='outlined' />
                        <Box component='span' sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                          {driver.latitude?.toFixed(4)}, {driver.longitude?.toFixed(4)}
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                  {index < drivers.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </PerfectScrollbar>
      </Box>
    </Box>
  )
}

export default FleetSidebar
