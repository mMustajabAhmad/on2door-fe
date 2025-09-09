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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from '@mui/material'

import CircularProgress from '@mui/material/CircularProgress'

// API
import { getDriversApi, getTeamsApi, updateTaskApi } from '@/app/api/on2door/actions'
import { getInitials } from '@/utils/getInitials'

const AssignmentTab = ({ taskData }) => {
  const queryClient = useQueryClient()
  const taskId = taskData?.task?.data?.id
  const task = taskData?.task?.data?.attributes || {}

  // Load all drivers and teams
  const { data: driversRes } = useQuery({
    queryKey: ['drivers'],
    queryFn: getDriversApi
  })
  const allDrivers = driversRes?.drivers?.data || []

  const { data: teamsRes } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeamsApi
  })
  const teams = teamsRes?.teams?.data || []

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      driver_id: '',
      team_id: ''
    }
  })

  // Watch the selected team_id
  const selectedTeamId = watch('team_id')

  // Filter drivers based on selected team
  const filteredDrivers = selectedTeamId 
    ? allDrivers.filter(driver => {
        const driverTeamIds = driver.attributes?.team_ids || []
        return driverTeamIds.includes(parseInt(selectedTeamId))
      })
    : allDrivers

  useEffect(() => {
    setValue('driver_id', task.driver_id?.toString() || '')
    setValue('team_id', task.team_id?.toString() || '')
  }, [task, setValue])

  // Reset driver selection when team changes
  useEffect(() => {
    setValue('driver_id', '')
  }, [selectedTeamId, setValue])

  const { mutate: updateTask, isPending } = useMutation({
    mutationFn: payload => updateTaskApi(taskId, payload),

    onSuccess: () => {
      toast.success('Task assignment updated!')
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },

    onError: err => {
      const errorMessage =
        err?.response?.data?.error || err?.response?.data?.message || 'Update failed. Reverting changes.'
      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 })
    }
  })

  const onSubmit = data => {
    const payload = {
      task: {
        driver_id: data.driver_id ? parseInt(data.driver_id) : null,
        team_id: data.team_id ? parseInt(data.team_id) : null
      }
    }
    updateTask(payload)
  }

  const getName = d => {
    if (!d) return 'Unknown'
    return `${d.attributes?.first_name || ''} ${d.attributes?.last_name || ''}`.trim() || `Driver ${d.id}`
  }

  const getTeamName = t => {
    if (!t) return 'Unknown Team'
    return t.attributes?.name || `Team ${t.id}`
  }

  return (
    <Card>
      <CardHeader title='Task Assignment' />
      <CardContent>
        {/* Current Assignment */}
        <Typography variant='h6' gutterBottom>
          Current Assignment
        </Typography>
        <Box className='mb-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Typography variant='body2' color='text.secondary'>
              Driver:
            </Typography>
            {task.driver_id ? (
              <Chip label={`Driver ${task.driver_id}`} color='primary' size='small' />
            ) : (
              <Chip label='Unassigned' color='default' size='small' />
            )}
          </div>
          <div className='flex items-center gap-2'>
            <Typography variant='body2' color='text.secondary'>
              Team:
            </Typography>
            {task.team_id ? (
              <Chip label={`Team ${task.team_id}`} color='secondary' size='small' />
            ) : (
              <Chip label='Unassigned' color='default' size='small' />
            )}
          </div>
        </Box>

        {/* Update Assignment */}
        <Typography variant='h6' gutterBottom>
          Update Assignment
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display='flex' gap={2} alignItems='flex-end' className='mb-4'>
            <FormControl fullWidth>
              <InputLabel>Select Team</InputLabel>
              <Controller
                name='team_id'
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value)}
                    input={<OutlinedInput label='Select Team' />}
                  >
                    <MenuItem value=''>
                      <em>Unassigned</em>
                    </MenuItem>
                    {teams.map(t => (
                      <MenuItem key={t.id} value={t.id.toString()}>
                        {getTeamName(t)}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Box>

            <Box display='flex' gap={2} alignItems='flex-end' className='mb-4'>
            <FormControl fullWidth>
              <InputLabel>
                {selectedTeamId 
                  ? `Select Driver from Team (${filteredDrivers.length} available)` 
                  : 'Select Driver'
                }
              </InputLabel>
              <Controller
                name='driver_id'
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value)}
                    input={<OutlinedInput label={selectedTeamId 
                      ? `Select Driver from Team (${filteredDrivers.length} available)` 
                      : 'Select Driver'
                    } />}
                  >
                    <MenuItem value=''>
                      <em>Unassigned</em>
                    </MenuItem>
                    {filteredDrivers.length === 0 && selectedTeamId ? (
                      <MenuItem disabled>
                        <em>No drivers available for this team</em>
                      </MenuItem>
                    ) : (
                      filteredDrivers.map(d => (
                        <MenuItem key={d.id} value={d.id.toString()}>
                          {getName(d)}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                )}
              />
            </FormControl>
          </Box>

          <Button
            type='submit'
            variant='contained'
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={16} /> : null}
          >
            {isPending ? 'Updating...' : 'Update Assignment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default AssignmentTab
