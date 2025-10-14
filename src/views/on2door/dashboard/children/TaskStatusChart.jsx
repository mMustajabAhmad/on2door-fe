// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

const TaskStatusChart = ({ data, total }) => {
  const totalCount = typeof total === 'number' ? total : 0

  if (totalCount === 0) {
    return (
      <Box className='text-center py-8'>
        <Typography variant='body2' className='text-textSecondary'>
          No task data available
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {data.map((item, index) => {
        const percentage = totalCount > 0 ? (item.count / totalCount) * 100 : 0

        return (
          <Box key={index} className='mb-3'>
            <Box className='flex items-center justify-between mb-2'>
              <Typography variant='body2' className='font-medium'>
                {item.status}
              </Typography>
              <Typography variant='body2' className='text-textSecondary'>
                {item.count} ({percentage.toFixed(1)}%)
              </Typography>
            </Box>
            <LinearProgress
              variant='determinate'
              value={percentage}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: item.color,
                  borderRadius: 3
                }
              }}
            />
          </Box>
        )
      })}
    </Box>
  )
}

export default TaskStatusChart
