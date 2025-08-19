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

const TeamsTab = ({ userData }) => {
  const dispatcher = userData?.administrator?.data?.attributes || {}
  const teamIds = dispatcher.team_ids || []

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
          <Button variant='outlined' color='primary'>
            Assign to Team
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Box className='flex items-center justify-between mb-6'>
              <Typography variant='h5'>Teams</Typography>
              <Button variant='contained' color='primary' startIcon={<i className='ri-add-line' />}>
                Add to Team
              </Button>
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
                          <Button size='small' variant='outlined' color='error'>
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
  )
}

export default TeamsTab
