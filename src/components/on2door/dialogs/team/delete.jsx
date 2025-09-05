'use client'

// React Imports
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// API Imports
import { destroyTeamApi } from '@/app/api/on2door/actions'

// Third-party Imports
import { toast } from 'react-toastify'

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

  const handleDelete = () => itemToDelete?.id && deleteTeam(itemToDelete.id)
  const handleClose = () => !isPending && setOpen(false)

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth closeAfterTransition={false}>
      <DialogTitle className='text-center'>
        <i className='ri-error-warning-line text-[88px] mbe-6 text-warning' />
        <div className='text-xl font-semibold'>Are you sure?</div>
      </DialogTitle>

      <DialogContent className='text-center'>
        <Typography>Do you really want to delete this team?</Typography>

        {itemToDelete?.name && (
          <Typography variant='h6' className='mt-2' color='error'>
            {itemToDelete.name}
          </Typography>
        )}

        {errorState && (
          <Alert severity='error' sx={{ mt: 2 }}>
            {errorState?.response?.data?.error ||
              errorState?.response?.data?.message ||
              'Failed to delete team. Please try again.'}
          </Alert>
        )}
      </DialogContent>

      <DialogActions className='justify-center gap-3 pbs-0 sm:pbe-16 sm:pli-16'>
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
