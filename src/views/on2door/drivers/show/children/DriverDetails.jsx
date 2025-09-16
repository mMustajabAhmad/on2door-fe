// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

// Component Imports
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import EditDriverDialog from '@/components/on2door/dialogs/driver/update'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

const DriverDetails = ({ driverData }) => {
  const driver = driverData?.driver?.data?.attributes || {}
  const vehicle = driver.vehicle_attributes || {}

  const fullName = `${driver.first_name || ''} ${driver.last_name || ''}`.trim() || 'N/A'
  const status = driver.is_active ? 'active' : 'inactive'
  const teamIds = driver.team_ids || []

  const formatVehicleType = type => {
    const typeMap = {
      car: 'Car',
      van: 'Van',
      truck: 'Truck',
      motorcycle: 'Motorcycle',
      bicycle: 'Bicycle'
    }
    return typeMap[type] || type || 'N/A'
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-center flex-col gap-4'>
              <div className='flex flex-col items-center gap-4'>
                <CustomAvatar
                  alt='driver-profile'
                  src={driver.avatar}
                  variant='rounded'
                  size={120}
                  skin='light'
                >
                  {!driver.avatar && getInitials(fullName)}
                </CustomAvatar>
                <Typography variant='h5'>{fullName}</Typography>
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
                  <Typography variant='h5'>{driver.is_active ? 'Active' : 'Inactive'}</Typography>
                  <Typography>Status</Typography>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Typography variant='h5'>Driver Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-3'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Email:
                </Typography>
                <Typography>{driver.email || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Phone:
                </Typography>
                <Typography>{driver.phone_number || 'N/A'}</Typography>
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
                  Organization ID:
                </Typography>
                <Typography color='text.primary'>{driver.organization_id || 'N/A'}</Typography>
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

          {/* Vehicle Information Section */}
          <div>
            <Typography variant='h5'>Vehicle Information</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-3'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  License Plate:
                </Typography>
                <Typography>{vehicle.license_plate || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Vehicle Type:
                </Typography>
                <Typography>{formatVehicleType(vehicle.type)}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Color:
                </Typography>
                <Typography>{vehicle.color || 'N/A'}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Description:
                </Typography>
                <Typography>{vehicle.description || 'N/A'}</Typography>
              </div>
            </div>
          </div>

          <div className='flex gap-4 justify-center'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={{ children: 'Edit Driver', color: 'primary', variant: 'contained' }}
              dialog={EditDriverDialog}
              dialogProps={{
                data: driverData,
                currentDriver: {
                  id: driver.id
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default DriverDetails
