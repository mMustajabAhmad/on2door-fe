'use client'

// React Imports
import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { toast } from 'react-toastify'

// API Imports
import { destroyTeamApi } from '@/app/api/on2door/actions'

const DeleteTeamDialog = ({ open, setOpen, itemToDelete }) => {
  const [errorState, setErrorState] = useState(null)
  const queryClient = useQueryClient()

  const { mutate: deleteTeam, isPending } = useMutation({
    mutationFn: destroyTeamApi,

    onMutate: () => setErrorState(null),

    onSuccess: () => {
      toast.success('Team deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      setOpen(false)
    },

    onError: err => setErrorState(err)
  })

  const handleDelete = () => {
    deleteTeam(itemToDelete.id)
  }

  const handleClose = () => {
    setOpen(false)
    setErrorState(null)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth closeAfterTransition={false}>
      <DialogTitle className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center text-xl font-semibold'>Delete Team</div>
        <Typography component='span' className='flex flex-col text-center'>
          Are you sure you want to delete this team?
        </Typography>
      </DialogTitle>

      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
          <i className='ri-close-line text-textSecondary' />
        </IconButton>

        {errorState && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {errorState?.response?.data?.error ||
              errorState?.response?.data?.message ||
              'Failed to delete team. Please try again.'}
          </Alert>
        )}

        <Box className='flex flex-col items-center gap-4 py-4'>
          <i className='ri-error-warning-line text-6xl text-red-500' />

          <Box className='text-center'>
            <Typography variant='body2' color='text.secondary'>
              This action cannot be undone. The team "{itemToDelete?.name}" will be permanently deleted.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button
          variant='contained'
          color='error'
          onClick={handleDelete}
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={20} /> : null}
        >
          {isPending ? 'Deleting...' : 'Delete Team'}
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteTeamDialog
