// MUI Imports
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

const ActiveTasksTable = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <Box className='text-center py-8'>
        <Typography variant='body2' className='text-textSecondary'>
          No active tasks found
        </Typography>
      </Box>
    )
  }

  const getRecipientName = attrs =>
    attrs?.recipient_attributes?.name || (attrs?.recipient_id ? `#${attrs.recipient_id}` : 'N/A')

  const getDriverName = attrs => (attrs?.driver_id ? `ID ${attrs.driver_id}` : 'Unassigned')

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task ID</TableCell>
            <TableCell>Recipient</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map(task => {
            const attributes = task.attributes || {}

            return (
              <TableRow key={task.id}>
                <TableCell>
                  <Typography variant='body2' className='font-medium'>
                    {attributes.short_id || `#${task.id}`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='body2'>{getRecipientName(attributes)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='body2'>{getDriverName(attributes)}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label='Active' size='small' color='success' />
                </TableCell>
                <TableCell>
                  <Typography variant='body2' className='text-textSecondary'>
                    {attributes.created_at ? new Date(attributes.created_at).toLocaleDateString() : 'N/A'}
                  </Typography>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ActiveTasksTable
