// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

// Component Imports
import EditUserInfo from '@components/dialogs/edit-user-info'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

const UserDetails = ({ userData }) => {
  // Extract data from API response structure
  const admin = userData?.administrator?.data?.attributes || userData?.attributes || userData || {}

  const fullName = `${admin.first_name || ''} ${admin.last_name || ''}`.trim() || 'N/A'
  const isOwner = admin.is_account_owner || false
  const status = admin.is_active ? 'active' : 'inactive'

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-center flex-col gap-4'>
              <div className='flex flex-col items-center gap-4'>
                <CustomAvatar alt='admin-profile' src={admin.avatar} variant='rounded' size={120} skin='light'>
                  {!admin.avatar && getInitials(fullName)}
                </CustomAvatar>
                <Typography variant='h5'>{fullName}</Typography>
              </div>
              <div className='flex gap-2'>
                <Chip
                  label={admin.role || 'admin'}
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
          </div>

          <div>
            <Typography variant='h5'>Admin Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-3'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Email:
                </Typography>
                <Typography>{admin.email || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Phone:
                </Typography>
                <Typography>{admin.phone_number || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Status:
                </Typography>
                <Chip
                  label={status}
                  color={status === 'active' ? 'success' : 'secondary'}
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
                  {admin.role || 'admin'}
                </Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Organization ID:
                </Typography>
                <Typography color='text.primary'>{admin.organization_id || 'N/A'}</Typography>
              </div>

              {admin.invitation_accepted_at && (
                <div className='flex items-center flex-wrap gap-x-1.5'>
                  <Typography className='font-medium' color='text.primary'>
                    Joined:
                  </Typography>
                  <Typography color='text.primary'>
                    {new Date(admin.invitation_accepted_at).toLocaleDateString()}
                  </Typography>
                </div>
              )}
            </div>
          </div>

          <div className='flex gap-4 justify-center'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={{ children: 'Edit Admin', color: 'primary', variant: 'contained' }}
              dialog={EditUserInfo}
              dialogProps={{
                data: userData,
                currentAdmin: {
                  id: admin.id || userData?.administrator?.data?.id || userData?.id
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default UserDetails
