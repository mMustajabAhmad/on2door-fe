'use client'

import { useState, useEffect } from 'react'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'

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
  const teamId = teamData?.team?.data?.id
  const teamDispatchers = teamData?.team?.data?.attributes?.dispatchers || []

  // Load all dispatchers
  const { data: dispatchersRes } = useQuery({
    queryKey: ['dispatchers'],
    queryFn: getDispatchersApi
  })

  const dispatchers = dispatchersRes?.administrators?.data || []

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: { administrator_ids: [] }
  })

  useEffect(() => {
    if (teamDispatchers.length > 0) {
      const currentIds = teamDispatchers.map(d => d.id.toString())

      setValue('administrator_ids', currentIds)
    } else {
      setValue('administrator_ids', [])
    }
  }, [teamDispatchers, setValue])

  const { mutate: updateTeam, isPending } = useMutation({
    mutationFn: payload => updateTeamApi(teamId, payload),

    onSuccess: () => {
      toast.success('Team dispatchers updated!')
      queryClient.invalidateQueries({ queryKey: ['team', teamId] })
      queryClient.invalidateQueries({ queryKey: ['dispatchers'] })
    },

    onError: err => {
      const currentIds = teamDispatchers.map(d => d.id.toString())

      setValue('administrator_ids', currentIds)

      const errorMessage =
        err?.response?.data?.error || err?.response?.data?.message || 'Update failed. Reverting changes.'

      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 })
    }
  })

  const onSubmit = data => {
    const payload = { team: { administrator_ids: data.administrator_ids?.map(id => parseInt(id)) || [] } }

    updateTeam(payload)
  }

  const handleRemove = id => {
    const remaining = teamDispatchers.filter(d => d.id !== id).map(d => d.id)
    const payload = { team: { administrator_ids: remaining } }

    updateTeam(payload)
  }

  const getName = d => {
    if (!d) return 'Unknown Dispatcher'
    
return `${d.attributes?.first_name || ''} ${d.attributes?.last_name || ''}`.trim() || `Dispatcher ${d.id}`
  }

  return (
    <Card>
      <CardHeader title='Dispatchers Management' />
      <CardContent>
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

        {/* Update Form */}
        <Box mt={4}>
          <Typography variant='h6' gutterBottom>
            Update Dispatchers
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display='flex' gap={2} alignItems='flex-end'>
              <FormControl fullWidth>
                <InputLabel>Select Dispatchers</InputLabel>
                <Controller
                  name='administrator_ids'
                  control={control}
                  render={({ field }) => (
                    <Select
                      multiple
                      value={field.value || []}
                      onChange={e => field.onChange(e.target.value)}
                      input={<OutlinedInput label='Select Dispatchers' />}
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map(value => {
                            const d = dispatchers.find(x => x.id.toString() === value)

                            
return <Chip key={value} label={getName(d)} size='small' />
                          })}
                        </Box>
                      )}
                    >
                      {dispatchers.map(d => (
                        <MenuItem key={d.id} value={d.id.toString()}>
                          {getName(d)}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              <Button
                type='submit'
                variant='contained'
                disabled={isPending}
                startIcon={isPending ? <CircularProgress size={16} /> : null}
                >
                {isPending ? 'Updating...' : 'Update'}
              </Button>
            </Box>
          </form>
        </Box>
      </CardContent>
    </Card>
  )
}

export default DispatchersTab
