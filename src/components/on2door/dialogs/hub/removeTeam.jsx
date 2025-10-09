'use client'

// React Imports
import { useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// API Imports
import { toast } from 'react-toastify'

import { updateHubApi } from '@/app/api/on2door/actions'

const RemoveTeamDialog = ({ open, setOpen, hubData, teamId }) => {
  const [errorState, setErrorState] = useState(null)
  const queryClient = useQueryClient()

  const hub = hubData?.data?.attributes || {}
  const currentTeamIds = hub.team_ids || []

  const { mutate: removeTeam, isPending } = useMutation({
    mutationFn: ({ id, payload }) => updateHubApi(id, payload),

    onMutate: () => setErrorState(null),

    onSuccess: () => {
      toast.success('Team removed successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      queryClient.invalidateQueries({
        predicate: query => {
          const queryKey = query.queryKey

          
return Array.isArray(queryKey) && (queryKey[0] === 'hub' || queryKey[0] === 'hubs')
        }
      })
      setOpen(false)
    },

    onError: err => setErrorState(err)
  })

  const handleRemoveTeam = () => {
    const updatedTeamIds = currentTeamIds.filter(id => id !== teamId)
    
    const payload = {
      hub: { team_ids: updatedTeamIds } 
    }

    removeTeam({ id: hubData?.data?.id, payload })
  }

  const handleClose = () => {
    setOpen(false)
    setErrorState(null)
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth='sm' 
      fullWidth 
      closeAfterTransition={false}
    >
      <DialogTitle className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <i className='ri-error-warning-line text-[88px] mbe-6 text-warning' />
        <div className='max-sm:is-[80%] max-sm:text-center text-xl font-semibold text-red-500'>
          Remove Team {teamId}
        </div>
      </DialogTitle>

      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        {errorState && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {errorState?.response?.data?.error ||
              errorState?.response?.data?.message ||
              'Failed to remove team. Please try again.'}
          </Alert>
        )}

        <Box className='flex flex-col items-center gap-4 py-4'>
          <Box className='text-center'>
            <Typography variant='body2' color='text.secondary'>
              This team will be removed from hub: {hub.name}. 
              The team will no longer be associated with this hub.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button
          variant='contained'
          color='error'
          onClick={handleRemoveTeam}
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={20} /> : null}
        >
          {isPending ? 'Removing...' : 'Remove Team'}
        </Button>

         <Button
          variant='outlined'
          color='secondary'
          onClick={handleClose}
          disabled={isPending}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RemoveTeamDialog
