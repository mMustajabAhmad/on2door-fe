'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'

// Third-party Imports
import { toast } from 'react-toastify'

// API Imports
import { updateTeamApi, getHubsApi } from '@/app/api/on2door/actions'

const HubTab = ({ teamData }) => {
  const [selectedHub, setSelectedHub] = useState(teamData?.team?.data?.attributes?.hub_id?.toString() || '')
  const queryClient = useQueryClient()

  const { data: hubsData } = useQuery({
    queryKey: ['hubs'],
    queryFn: () => getHubsApi()
  })

  const hubs = hubsData?.hubs?.data || []
  const currentHubId = teamData?.team?.data?.attributes?.hub_id

  useEffect(() => {
    if (teamData?.team?.data?.attributes?.hub_id) {
      setSelectedHub(teamData.team.data.attributes.hub_id.toString())
    } else {
      setSelectedHub('')
    }
  }, [teamData])

  const { mutate: updateTeam, isPending } = useMutation({
    mutationFn: ({ id, payload }) => updateTeamApi(id, payload),

    onSuccess: () => {
      toast.success('Team hub updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: ['team', teamData?.team?.data?.id] })
    },

    onError: err => {
      toast.error('Failed to update team hub. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    }
  })

  const handleAssignHub = () => {
    if (!selectedHub) {
      toast.error('Please select a hub first.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      return
    }
    const payload = { team: { hub_id: parseInt(selectedHub) } }
    updateTeam({ id: teamData?.team?.data?.id, payload })
  }

  const handleRemoveHub = () => {
    const payload = { team: { hub_id: null } }
    updateTeam({ id: teamData?.team?.data?.id, payload })
    setSelectedHub('')
  }

  return (
    <Card>
      <CardHeader title='Hub Management' />
      <CardContent>
        <Box className='space-y-6'>
          {/* Current Hub Status */}
          <Box>
            <Typography variant='h6' gutterBottom>
              Current Hub
            </Typography>
            {currentHubId ? (
              <Chip
                label={ `Hub ${currentHubId}`}
                color='primary'
                variant='filled'
                size='medium'
              />
            ) : (
              <Chip label='No Hub Assigned' color='default' variant='outlined' size='medium' />
            )}
          </Box>

          {/* Assign New Hub */}
          <Box>
            <Typography variant='h6' gutterBottom>
              Assign New Hub
            </Typography>
            <Box className='flex gap-4 items-end'>
              <FormControl className='min-w-[200px]'>
                <InputLabel>Select Hub</InputLabel>
                <Select
                  value={selectedHub}
                  onChange={e => setSelectedHub(e.target.value)}
                  input={<OutlinedInput label='Select Hub' />}
                >
                  <MenuItem value=''>
                    <em>No Hub</em>
                  </MenuItem>
                  {hubs.map(hub => (
                    <MenuItem key={hub.id} value={hub.id.toString()}>
                      {hub.attributes?.name || `Hub ${hub.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant='contained'
                onClick={handleAssignHub}
                disabled={isPending || !selectedHub}
                startIcon={isPending ? <CircularProgress size={20} /> : null}
              >
                {isPending ? 'Updating...' : 'Assign Hub'}
              </Button>
            </Box>
          </Box>

          {/* Remove Hub Button */}
          {currentHubId && (
            <Box>
              <Button
                variant='outlined'
                color='error'
                onClick={handleRemoveHub}
                disabled={isPending}
                startIcon={isPending ? <CircularProgress size={20} /> : null}
              >
                {isPending ? 'Removing...' : 'Remove Hub'}
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default HubTab
