// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Third-party Imports
import classnames from 'classnames'

const StatisticsCard = ({ title, value, total, icon, color }) => {
  return (
    <Card
      sx={{ height: '100%', transition: 'all 0.2s ease-in-out','&:hover': { transform: 'translateY(-2px)', boxShadow: 3 } }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box className='flex items-center justify-between h-full'>
          <Box className='flex-1'>
            <Typography variant='h4' className='font-bold mb-1'>
              {value}
              {total && (
                <Typography component='span' variant='body2' className='text-textSecondary ml-1 font-normal'>
                  / {total}
                </Typography>
              )}
            </Typography>
            <Typography variant='body2' className='text-textSecondary mb-2'>
              {title}
            </Typography>
          </Box>
          <Box
            className={classnames('flex items-center justify-center w-14 h-14 rounded-xl ml-3 flex-shrink-0', {
              'bg-primary/10 text-primary': color === 'primary',
              'bg-info/10 text-info': color === 'info',
              'bg-success/10 text-success': color === 'success',
              'bg-warning/10 text-warning': color === 'warning',
              'bg-error/10 text-error': color === 'error'
            })}
          >
            <i className={classnames(icon, 'text-2xl')} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
