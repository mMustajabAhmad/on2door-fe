'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'

// Component Imports
import EditTeamDialog from '@/components/on2door/dialogs/team/update'
import OpenDialogOnElementClick from '@/components/on2door/dialogs/OpenDialogOnElementClick'
import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'

const TeamDetails = ({ teamData }) => {
  const team = teamData?.team?.data?.attributes || {}
  const teamId = teamData?.team?.data?.id
  const dispatchersCount = team.dispatchers_count || 0
  const driversCount = team.drivers_count || 0

  return (
    <Card>
      <CardContent className='flex flex-col pbs-12 gap-6'>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-center flex-col gap-4'>
            <div className='flex flex-col items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary' size={120}>
                <Typography variant='h5'>{getInitials(team.name || 'Team')}</Typography>
              </CustomAvatar>
              <Typography variant='h5'>{team.name}</Typography>
            </div>
            <Chip label='Active Team' color='success' size='small' variant='tonal' />
          </div>
          <div className='flex items-center justify-around flex-wrap gap-4'>
            <div className='flex items-center gap-2'>
              <CustomAvatar variant='rounded' skin='light' color='primary' size={50}>
                <i className='ri-user-3-line' />
              </CustomAvatar>
              <Typography variant='h6'>{dispatchersCount} Dispatchers</Typography>
            </div>
            <div className='flex items-center gap-2'>
              <CustomAvatar variant='rounded' skin='light' color='secondary' size={50}>
                <i className='ri-steering-2-line' />
              </CustomAvatar>
              <Typography variant='h6'>{driversCount} Drivers</Typography>
            </div>
          </div>
        </div>

        <div>
          <Typography variant='h5'>Team Details</Typography>
          <Divider className='mlb-4' />
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <Typography variant='body2' color='text.secondary'>
                Team ID:
              </Typography>
              <Typography variant='body2' fontWeight='medium'>
                #{teamId}
              </Typography>
            </div>
            <div className='flex items-center gap-2'>
              <Typography variant='body2' color='text.secondary'>
                Organization ID:
              </Typography>
              <Typography variant='body2' fontWeight='medium'>
                #{team.organization_id}
              </Typography>
            </div>
            <div className='flex items-center gap-2'>
              <Typography variant='body2' color='text.secondary'>
                Hub:
              </Typography>
              <Typography variant='body2' fontWeight='medium'>
                {team.hub_id ? team.hub?.name || `Hub ${team.hub_id}` : 'No Hub Assigned'}
              </Typography>
            </div>
          </div>
        </div>

        <Box className='flex justify-center'>
          <OpenDialogOnElementClick
            element={Button}
            elementProps={{
              children: 'Edit Team',
              variant: 'contained',
              color: 'primary',
              startIcon: <i className='ri-edit-line' />
            }}
            dialog={EditTeamDialog}
            dialogProps={{
              currentTeam: {
                id: teamId,
                name: team.name,
                hub_id: team.hub_id,
                administrator_ids: team.administrators || []
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default TeamDetails
