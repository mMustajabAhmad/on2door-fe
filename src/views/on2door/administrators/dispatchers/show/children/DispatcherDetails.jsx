// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

// Component Imports
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import EditDispatcherDialog from '@/components/on2door/dialogs/administrators/dispatcher/update'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

const DispatcherDetails = ({ dispatcherData }) => {
  const dispatcher = dispatcherData?.administrator?.data?.attributes || {}

  const fullName = `${dispatcher.first_name || ''} ${dispatcher.last_name || ''}`.trim() || 'N/A'
  const isOwner = dispatcher.is_account_owner || false
  const status = dispatcher.is_active ? 'active' : 'inactive'
  const teamIds = dispatcher.team_ids || []

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-center flex-col gap-4'>
              <div className='flex flex-col items-center gap-4'>
                <CustomAvatar
                  alt='dispatcher-profile'
                  src={dispatcher.avatar}
                  variant='rounded'
                  size={120}
                  skin='light'
                >
                  {!dispatcher.avatar && getInitials(fullName)}
                </CustomAvatar>
                <Typography variant='h5'>{fullName}</Typography>
              </div>
              <div className='flex gap-2'>
                <Chip
                  label={dispatcher.role || 'dispatcher'}
                  color={isOwner ? 'success' : 'primary'}
                  size='small'
                  variant='tonal'
                  className='capitalize'
                />
                {isOwner && (
                  <Chip label='Owner' color='success' size='small' variant='tonal' className='font-semibold' />
                )}
              </div>
            </div>

            {/* Teams and Status Info */}
            <div className='flex items-center justify-around flex-wrap gap-4'>
              <div className='flex items-center gap-4'>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='ri-team-line' />
                </CustomAvatar>
                <div>
                  <Typography variant='h5'>{teamIds.length}</Typography>
                  <Typography>Teams</Typography>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='ri-check-line' />
                </CustomAvatar>
                <div>
                  <Typography variant='h5'>{dispatcher.is_active ? 'Active' : 'Inactive'}</Typography>
                  <Typography>Status</Typography>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Typography variant='h5'>Dispatcher Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-3'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Email:
                </Typography>
                <Typography>{dispatcher.email || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Phone:
                </Typography>
                <Typography>{dispatcher.phone_number || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Status:
                </Typography>
                <Chip
                  label={status}
                  color={status === 'active' ? 'success' : 'default'}
                  size='small'
                  variant='tonal'
                  className='capitalize'
                />
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Role:
                </Typography>
                <Typography color='text.primary' className='capitalize'>
                  {dispatcher.role || 'dispatcher'}
                </Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Organization ID:
                </Typography>
                <Typography color='text.primary'>{dispatcher.organization_id || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Teams:
                </Typography>
                <Typography color='text.primary'>
                  {teamIds.length > 0 ? teamIds.join(', ') : 'No teams assigned'}
                </Typography>
              </div>
            </div>
          </div>

          <div className='flex gap-4 justify-center'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={{ children: 'Edit Dispatcher', color: 'primary', variant: 'contained' }}
              dialog={EditDispatcherDialog}
              dialogProps={{
                data: dispatcherData,
                currentAdmin: {
                  id: dispatcher.id
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default DispatcherDetails
