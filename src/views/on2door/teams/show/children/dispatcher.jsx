'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

// MUI
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton
} from '@mui/material'

import CircularProgress from '@mui/material/CircularProgress'

// API
import { getDispatchersApi, updateTeamApi } from '@/app/api/on2door/actions'
import { getInitials } from '@/utils/getInitials'

const DispatchersTab = ({ teamData }) => {
  const queryClient = useQueryClient()
  const teamId = Number(teamData?.team?.data?.id)
  const teamDispatchers = teamData?.team?.data?.attributes?.dispatchers || []

  const [selected, setSelected] = useState([])
  const [errorState, setErrorState] = useState(null)

  // Load all dispatchers
  const { data: dispatchersRes } = useQuery({
    queryKey: ['dispatchers'],
    queryFn: getDispatchersApi
  })
  const dispatchers = dispatchersRes?.administrators?.data || []
  const assignedSet = new Set(teamDispatchers.map(d => Number(d.id)))

  const { mutate: updateTeam, isPending } = useMutation({
    mutationFn: payload => updateTeamApi(teamId, payload),

    onSuccess: () => {
      toast.success('Team dispatchers updated!')
      queryClient.invalidateQueries({ queryKey: ['team', String(teamId)] })
      queryClient.invalidateQueries({ queryKey: ['dispatchers'] })
      setSelected([])
    },
    onError: err => { 
      setErrorState(err) 
      toast.error('Failed to update team dispatchers. Please try again.', { position: 'top-right', autoClose: 3000 })}
  })

  const handleAdd = () => {
    if (selected.length === 0) return
    const mergedIds = [...new Set([...teamDispatchers.map(d => d.id), ...selected.map(Number)])]
    updateTeam({ team: { administrator_ids: mergedIds } })
  }

  const handleRemove = id => {
    const remaining = teamDispatchers.filter(d => d.id !== id).map(d => d.id)
    updateTeam({ team: { administrator_ids: remaining } })
  }

  const getName = d =>
    `${d.attributes?.first_name || ''} ${d.attributes?.last_name || ''}`.trim() || `Dispatcher ${d.id}`
  
  return (
    <Card>
      <CardHeader title='Dispatchers Management' />
      <CardContent>
        {errorState && ( 
         <Alert severity='error' sx={{ mb: 2 }}> {errorState?.response?.data?.error || errorState?.response?.data?.message || 'Something went wrong.'}
         </Alert> )}
        {/* Current Dispatchers */}
        <Typography variant='h6' gutterBottom>
          Current Dispatchers ({teamDispatchers.length})
        </Typography>
        {teamDispatchers.length > 0 ? (
          <List>
            {teamDispatchers.map(d => (
              <ListItem key={d.id}>
                <ListItemAvatar>
                  <Avatar>{getInitials(d.name)}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={d.name} />
                <IconButton color='error' onClick={() => handleRemove(d.id)} disabled={isPending}>
                  <i className='ri-delete-bin-7-line' />
                </IconButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color='text.secondary'>No dispatchers assigned</Typography>
        )}

        {/* Add New */}
        <Box mt={4} display='flex' gap={2} alignItems='flex-end'>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Select Dispatchers</InputLabel>
            <Select
              multiple
              value={selected}
              onChange={e => setSelected(e.target.value)}
              input={<OutlinedInput label='Select Dispatchers' />}
              renderValue={ids => (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {ids.map(id => {
                    const d = dispatchers.find(x => x.id.toString() === id)
                    return <Chip key={id} label={getName(d)} size='small' />
                  })}
                </Box>
              )}
            >
              {dispatchers.map(d => {
                const name = getName(d)
                const alreadyAssigned = assignedSet.has(Number(d.id))
                return (
                  <MenuItem key={d.id} value={d.id.toString()} disabled={alreadyAssigned} disableRipple>
                    {name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <Button
            variant='contained'
            onClick={handleAdd}
            disabled={selected.length === 0 || isPending}
            startIcon={isPending ? <CircularProgress size={16} /> : null}
          >
            {isPending ? 'Saving...' : 'Add'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default DispatchersTab
