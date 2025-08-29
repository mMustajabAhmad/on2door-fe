// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

// Component Imports
import OpenDialogOnElementClick from '@/components/on2door/dialogs/OpenDialogOnElementClick'
import EditHubInfo from '@/components/on2door/dialogs/hubs/update'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

const HubLeftOverview = ({ userData }) => {
  const hub = userData?.data?.attributes || {}
  const address = hub.address || {}
  const hubName = hub.name || 'N/A'

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-center flex-col gap-4'>
              <div className='flex flex-col items-center gap-4'>
                <CustomAvatar alt='hub-profile' variant='rounded' size={120} skin='light'>
                  {getInitials(hubName)}
                </CustomAvatar>
                <Typography variant='h5'>{hubName}</Typography>
              </div>
              <div className='flex gap-2'>
                <Chip label='Hub' color='primary' size='small' variant='tonal' className='capitalize' />
              </div>
            </div>
          </div>

          <div>
            <Typography variant='h5'>Hub Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-3'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Name:
                </Typography>
                <Typography>{hub.name || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Street:
                </Typography>
                <Typography>{address.street || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  City:
                </Typography>
                <Typography>{address.city || 'N/A'}</Typography>
              </div>

              {address.state && (
                <div className='flex items-center flex-wrap gap-x-1.5'>
                  <Typography className='font-medium' color='text.primary'>
                    State:
                  </Typography>
                  <Typography>{address.state}</Typography>
                </div>
              )}

              {address.postal_code && (
                <div className='flex items-center flex-wrap gap-x-1.5'>
                  <Typography className='font-medium' color='text.primary'>
                    Postal Code:
                  </Typography>
                  <Typography>{address.postal_code}</Typography>
                </div>
              )}

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Country:
                </Typography>
                <Typography>{address.country || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Teams:
                </Typography>
                <Typography>{hub.team_ids?.length || 0} teams assigned</Typography>
              </div>
            </div>
          </div>

          <div className='flex gap-4 justify-center'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={{ children: 'Edit hub', variant: 'contained', color: 'primary' }}
              dialog={EditHubInfo}
              dialogProps={{
                currentHub: {
                  id: userData?.data?.id,
                  name: hub.name,
                  street: address.street,
                  city: address.city,
                  state: address.state,
                  postal_code: address.postal_code,
                  country: address.country,
                  team_ids: hub.team_ids
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default HubLeftOverview
