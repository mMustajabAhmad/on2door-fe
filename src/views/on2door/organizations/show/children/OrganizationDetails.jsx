// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

// Component Imports
import OpenDialogOnElementClick from '@/components/on2door/dialogs/OpenDialogOnElementClick'
import EditOrganizationDialog from '@/components/on2door/dialogs/organization/update'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

const OrganizationDetails = ({ organizationData }) => {
  const organization = organizationData.organization?.data?.attributes || {}
  const organizationName = organization.name || 'N/A'

  const formatMonthlyDeliveryVolume = volume => {
    const volumeMap = {
      range_0_100: '0 - 100',
      range_101_2000: '101 - 2000',
      range_2001_5000: '2001 - 5000',
      range_5001_12500: '5001 - 12500',
      range_12501_plus: '12501+'
    }

    
return volumeMap[volume] || volume || 'N/A'
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-center flex-col gap-4'>
              <div className='flex flex-col items-center gap-4'>
                <CustomAvatar alt='organization-profile' variant='rounded' size={120} skin='light'>
                  {getInitials(organizationName)}
                </CustomAvatar>
                <Typography variant='h5'>{organizationName}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography>{organization.message || 'N/A'}</Typography>
              </div>
            </div>
          </div>

          <div>
            <Typography variant='h5'>Organization Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-3'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Name:
                </Typography>
                <Typography>{organization.name || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Email:
                </Typography>
                <Typography>{organization.email || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Industry:
                </Typography>
                <Typography>{organization.primary_industry || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Monthly Delivery Volume:
                </Typography>
                <Typography>{formatMonthlyDeliveryVolume(organization.monthly_delivery_volume)}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Country:
                </Typography>
                <Typography>{organization.country || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  TimeZone:
                </Typography>
                <Typography>{organization.timezone || 'N/A'}</Typography>
              </div>
            </div>
          </div>

          <div className='flex gap-4 justify-center'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={{ children: 'Edit organization', variant: 'contained', color: 'primary' }}
              dialog={EditOrganizationDialog}
              dialogProps={{
                data: organizationData,
                currentOrganization: {
                  id: organization.id
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default OrganizationDetails
