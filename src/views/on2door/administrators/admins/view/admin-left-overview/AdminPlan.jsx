// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'

// Component Imports
import UpgradePlan from '@components/dialogs/upgrade-plan'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

const UserPlan = ({ userData }) => {
  // Vars
  const buttonProps = {
    variant: 'contained',
    children: 'Upgrade Plan'
  }

  // Plan details mapping
  const planDetails = {
    basic: { name: 'Basic', price: 29, features: ['5 Users', 'Up to 5 GB storage', 'Basic Support'] },
    team: { name: 'Team', price: 99, features: ['10 Users', 'Up to 10 GB storage', 'Priority Support'] },
    company: { name: 'Company', price: 199, features: ['Unlimited Users', 'Up to 50 GB storage', '24/7 Support'] },
    enterprise: { name: 'Enterprise', price: 499, features: ['Unlimited Users', 'Unlimited storage', 'Dedicated Support'] }
  }

  const currentPlan = planDetails[userData.currentPlan] || planDetails.basic

  return (
    <>
      <Card className='border-2 border-primary rounded'>
        <CardContent className='flex flex-col gap-6'>
          <div className='flex justify-between'>
            <Chip label={currentPlan.name} size='small' color='primary' variant='tonal' />
            <div className='flex justify-center'>
              <Typography variant='h5' component='sup' className='self-start' color='primary.main'>
                $
              </Typography>
              <Typography component='span' variant='h1' color='primary.main'>
                {currentPlan.price}
              </Typography>
              <Typography component='sub' className='self-end' color='text.primary'>
                /month
              </Typography>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            {currentPlan.features.map((feature, index) => (
              <div key={index} className='flex items-center gap-2'>
                <i className='ri-circle-fill text-[10px] text-textSecondary' />
                <Typography component='span'>{feature}</Typography>
              </div>
            ))}
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center justify-between'>
              <Typography className='font-medium' color='text.primary'>
                Days
              </Typography>
              <Typography className='font-medium' color='text.primary'>
                26 of 30 Days
              </Typography>
            </div>
            <LinearProgress variant='determinate' value={65} />
            <Typography variant='body2'>4 days remaining</Typography>
          </div>
          <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={UpgradePlan} />
        </CardContent>
      </Card>
    </>
  )
}

export default UserPlan
