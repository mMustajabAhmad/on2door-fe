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
import { getDriversApi, updateTeamApi } from '@/app/api/on2door/actions'
import { getInitials } from '@/utils/getInitials'

const DriversTab = ({ teamData }) => {
  const queryClient = useQueryClient()
  const teamId = teamData?.team?.data?.id
  const teamDrivers = teamData?.team?.data?.attributes?.drivers || []

  // Load all drivers
  const { data: driversRes } = useQuery({
    queryKey: ['drivers'],
    queryFn: getDriversApi
  })
  const drivers = driversRes?.drivers?.data || []

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: { driver_ids: [] }
  })

  useEffect(() => {
    if (teamDrivers.length > 0) {
      const currentIds = teamDrivers.map(d => d.id.toString())
      setValue('driver_ids', currentIds)
    } else {
      setValue('driver_ids', [])
    }
  }, [teamDrivers, setValue])

  const { mutate: updateTeam, isPending } = useMutation({
    mutationFn: payload => updateTeamApi(teamId, payload),

    onSuccess: () => {
      toast.success('Team drivers updated!')
      queryClient.invalidateQueries({ queryKey: ['team', teamId] })
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
    },

    onError: err => {
      const currentIds = teamDrivers.map(d => d.id.toString())
      setValue('driver_ids', currentIds)

      const errorMessage =
        err?.response?.data?.error || err?.response?.data?.message || 'Update failed. Reverting changes.'
      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 })
    }
  })

  const onSubmit = data => {
    const payload = { team: { driver_ids: data.driver_ids?.map(id => parseInt(id)) || [] } }
    updateTeam(payload)
  }

  const handleRemove = id => {
    const remaining = teamDrivers.filter(d => d.id !== id).map(d => d.id)
    const payload = { team: { driver_ids: remaining } }
    updateTeam(payload)
  }

  const getName = d => {
    if (!d) return 'Unknown Driver'
    return `${d.attributes?.first_name || ''} ${d.attributes?.last_name || ''}`.trim() || `Driver ${d.id}`
  }

  return (
    <Card>
      <CardHeader title='Drivers Management' />
      <CardContent>
        {/* Current Drivers */}
        <Typography variant='h6' gutterBottom>
          Current Drivers ({teamDrivers.length})
        </Typography>
        {teamDrivers.length > 0 ? (
          <List>
            {teamDrivers.map(d => (
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
          <Typography color='text.secondary'>No drivers assigned</Typography>
        )}

        {/* Update Form */}
        <Box mt={4}>
          <Typography variant='h6' gutterBottom>
            Update Drivers
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display='flex' gap={2} alignItems='flex-end'>
              <FormControl fullWidth>
                <InputLabel>Select Drivers</InputLabel>
                <Controller
                  name='driver_ids'
                  control={control}
                  render={({ field }) => (
                    <Select
                      multiple
                      value={field.value || []}
                      onChange={e => field.onChange(e.target.value)}
                      input={<OutlinedInput label='Select Drivers' />}
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map(value => {
                            const d = drivers.find(x => x.id.toString() === value)
                            return <Chip key={value} label={getName(d)} size='small' />
                          })}
                        </Box>
                      )}
                    >
                      {drivers.map(d => (
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

export default DriversTab
