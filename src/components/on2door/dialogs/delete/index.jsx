'use client'

// React Imports
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { toast } from 'react-toastify'

// API Imports
import { deleteAdministratorApi } from '@/app/api/on2door/actions'

const DeleteConfirmationDialog = ({ open, setOpen, itemToDelete, data }) => {
  const [errorState, setErrorState] = useState(null)
  const queryClient = useQueryClient()

  const isDispatcher = data?.dispatcher || data?.attributes?.role === 'dispatcher'

  const apiFunctions = isDispatcher ? { delete: deleteDispatcherApi } : { delete: deleteAdministratorApi }

  const userType = isDispatcher ? 'dispatcher' : 'administrator'
  const queryKey = isDispatcher ? 'dispatchers' : 'administrators'

  const { mutate: deleteItem, isPending } = useMutation({
    mutationFn: apiFunctions.delete,

    onMutate: () => setErrorState(null),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })

      setOpen(false)
      toast.success(`${userType.charAt(0).toUpperCase() + userType.slice(1)} deleted successfully!`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    },

    onError: err => setErrorState(err)
  })

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id)
    }
  }

  const handleClose = () => {
    if (!isPending) {
      setOpen(false)
      setErrorState(null)
    }
  }

  if (!itemToDelete) return null

  return (
    <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
      <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <i className='ri-error-warning-line text-[88px] mbe-6 text-warning' />
        <Typography variant='h4'>Are you sure?</Typography>
        <Typography color='text.primary'>You won't be able to revert this {userType}!</Typography>

        {/* Error display */}
        {errorState && (
          <Alert severity='error' sx={{ mt: 2, width: '100%' }}>
            {errorState?.response?.data?.error ||
              errorState?.response?.data?.message ||
              `Failed to delete ${userType}. Please try again.`}
          </Alert>
        )}
      </DialogContent>

      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='contained' color='error' onClick={handleDeleteConfirm} disabled={isPending}>
          {isPending ? 'Deleting...' : `Yes, Delete ${userType.charAt(0).toUpperCase() + userType.slice(1)}!`}
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
