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

// API Imports
import { toast } from 'react-toastify'

import { destroyTaskApi } from '@/app/api/on2door/actions'

// Third-party Imports

const DeleteTaskDialog = ({ open, setOpen, itemToDelete }) => {
  const [isPending, setIsPending] = useState(false)
  const queryClient = useQueryClient()

  const { mutate: deleteTask } = useMutation({
    mutationFn: destroyTaskApi,

    onMutate: () => { setIsPending(true) }, 

    onSuccess: () => {
      toast.success('Task deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setOpen(false)
    },

    onError: error => {
      toast.error(
        error?.response?.data?.error || error?.response?.data?.message || 'Failed to delete task. Please try again.',
        {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        }
      )

      setIsPending(false)
    }
  })

  const handleDelete = () => itemToDelete?.id && deleteTask(itemToDelete.id)
  const handleClose = () => !isPending && setOpen(false)

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth closeAfterTransition={false}>
      <DialogTitle className='text-center'>
        <i className='ri-error-warning-line text-[88px] mbe-6 text-warning' />
        <div className='text-xl font-semibold'>Are you sure?</div>
      </DialogTitle>

      <DialogContent className='text-center'>
        <Typography>Do you really want to delete this task?</Typography>
      </DialogContent>

      <DialogActions className='justify-center gap-3 pbs-0 sm:pbe-16 sm:pli-16'>
        <Button
          variant='contained'
          color='error'
          onClick={handleDelete}
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={20} /> : null}
        >
          {isPending ? 'Deleting...' : 'Delete Task'}
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteTaskDialog
