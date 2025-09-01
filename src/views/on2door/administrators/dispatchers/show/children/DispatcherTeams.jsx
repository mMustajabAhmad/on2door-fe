'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OpenDialogOnElementClick from '@/components/on2door/dialogs/OpenDialogOnElementClick'
import EditDispatcherDialog from '@/components/on2door/dialogs/administrators/dispatcher/update'
import RemoveTeamDialog from '@/components/on2door/dialogs/administrators/dispatcher/removeTeam'

const DispatcherTeams = ({ dispatcherData }) => {
  const dispatcher = dispatcherData?.administrator?.data?.attributes || {}
  const teamIds = dispatcher.team_ids || []

  const [removeTeamDialog, setRemoveTeamDialog] = useState({ open: false, teamId: null })
  const handleRemoveTeam = teamId => setRemoveTeamDialog({ open: true, teamId })
  const handleCloseRemoveDialog = () => setRemoveTeamDialog({ open: false, teamId: null })

  if (teamIds.length === 0) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center justify-center pbs-12 gap-4'>
          <CustomAvatar variant='rounded' color='secondary' skin='light' size={80}>
            <i className='ri-team-line text-4xl' />
          </CustomAvatar>
          <Typography variant='h6' color='text.secondary'>
            No Teams Assigned
          </Typography>
          <Typography variant='body2' color='text.secondary' className='text-center'>
            This dispatcher is not currently assigned to any teams.
          </Typography>
          <OpenDialogOnElementClick
            element={Button}
            elementProps={{
              children: 'Assign to Team',
              variant: 'outlined',
              color: 'primary'
            }}
            dialog={EditDispatcherDialog}
            dialogProps={{
              data: dispatcherData,
              currentDispatcher: {
                id: dispatcher.id
              }
            }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box className='flex items-center justify-between mb-6'>
                <Typography variant='h5'>Teams</Typography>
                <OpenDialogOnElementClick
                    element={Button}
                    elementProps={{
                      children: 'Add to Team',
                      variant: 'contained',
                      color: 'primary',
                      startIcon: <i className='ri-add-line' />
                    }}
                    dialog={EditDispatcherDialog}
                    dialogProps={{
                    data: dispatcherData,
                    currentDispatcher: {
                      id: dispatcher.id
                    }
                  }}
                  />
                </Box>

              <TableContainer component={Paper} variant='outlined'>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Team ID</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamIds.map(teamId => (
                      <TableRow key={teamId}>
                        <TableCell>
                          <Box className='flex items-center gap-3'>
                            <CustomAvatar variant='rounded' color='primary' skin='light' size={40}>
                              <i className='ri-team-line' />
                            </CustomAvatar>
                            <Box>
                              <Typography variant='subtitle2' className='font-semibold'>
                                Team {teamId}
                              </Typography>
                              <Typography variant='caption' color='text.secondary'>
                                ID: {teamId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box className='flex gap-2'>
                            <Button size='small' variant='outlined' color='primary'>
                              View
                            </Button>
                            <Button
                              size='small'
                              variant='outlined'
                              color='error'
                              onClick={() => handleRemoveTeam(teamId)}
                            >
                              Remove
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <RemoveTeamDialog
          open={removeTeamDialog.open}
          setOpen={handleCloseRemoveDialog}
          dispatcherData={dispatcherData}
          teamId={removeTeamDialog.teamId}
        />
    </>
  )
}

export default DispatcherTeams
