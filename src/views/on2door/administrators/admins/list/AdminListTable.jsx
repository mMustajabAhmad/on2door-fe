'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

//Component Imports
import EditUserInfo from '@components/dialogs/edit-user-info'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Alert from '@mui/material/Alert'
// import TablePagination from '@mui/material/TablePagination'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import { toast } from 'react-toastify'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import TableFilters from './TableFilters'
import AddUserDrawer from './AddAdminDrawer'
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'
import CustomPagination from './CustomPagination'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// API Imports
import { deleteAdministratorApi } from '@/app/api/on2door/actions'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Vars
// const userRoleObj = {
//   admin: { icon: 'ri-vip-crown-line', color: 'error' },
//   owner: { icon: 'ri-crown-line', color: 'warning' },
//   author: { icon: 'ri-computer-line', color: 'warning' },
//   editor: { icon: 'ri-edit-box-line', color: 'info' },
//   maintainer: { icon: 'ri-pie-chart-2-line', color: 'success' },
//   subscriber: { icon: 'ri-user-3-line', color: 'primary' }
// }

// const userStatusObj = {
//   active: 'success',
//   pending: 'warning',
//   inactive: 'secondary'
// }

// Column Definitions
const columnHelper = createColumnHelper()

const UserListTable = ({ tableData, page, perPage, onPageChange, onPerPageChange, searchQuery, setSearchQuery }) => {
  // const buttonProps = (children, color, variant) => ({
  //   children,
  //   color,
  //   variant
  // })
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState(null)
  const [errorState, setErrorState] = useState(null)

  // Hooks
  const queryClient = useQueryClient()

  // Delete mutation
  const { mutate: deleteAdministrator, isPending } = useMutation({
    mutationFn: deleteAdministratorApi,

    onMutate: () => setErrorState(null),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['administrators'] })
      setDeleteDialogOpen(false)
      setAdminToDelete(null)
      toast.success('Administrator deleted successfully!', {
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

  const handleDeleteClick = admin => {
    setAdminToDelete(admin)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = confirmed => {
    if (confirmed && adminToDelete) {
      deleteAdministrator(adminToDelete.id)
    }
    setDeleteDialogOpen(false)
    setAdminToDelete(null)
  }

  // Transform API data to match expected format
  const transformApiData = apiData => {
    if (!apiData?.administrators?.data) return []

    return apiData.administrators.data.map(admin => ({
      id: admin.id,
      fullName: `${admin.attributes.first_name} ${admin.attributes.last_name}`,
      email: admin.attributes.email,
      role: admin.attributes.role || 'admin',
      phone_number: admin.attributes.phone_number,
      organization_id: admin.attributes.organization_id,
      is_active: admin.attributes.is_active,
      is_account_owner: admin.attributes.is_account_owner,
      status: admin.attributes.is_active ? 'active' : 'inactive'
      // username: admin.attributes.email.split('@')[0] // Use email prefix as username
    }))
  }

  const [data, setData] = useState(transformApiData(tableData))
  const [filteredData, setFilteredData] = useState(data)
  // const [globalFilter, setGlobalFilter] = useState('')
  // const [searchQuery, setGlobalFilter] = useState('')

  // Update data when tableData changes
  useEffect(() => {
    const transformedData = transformApiData(tableData)
    setData(transformedData)
    setFilteredData(transformedData)
  }, [tableData])

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('fullName', {
        header: 'Admin',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.avatar, fullName: row.original.fullName })} */}
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.fullName}
              </Typography>
              {/* <Typography variant='body2'>{row.original.username}</Typography> */}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography>{row.original.email}</Typography>
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {' '}
            {row.original.role}{' '}
          </Typography>
        )
      }),
      columnHelper.accessor('phone_number', {
        header: 'Phone',
        cell: ({ row }) => <Typography color='text.primary'> {row.original.phone_number} </Typography>
      }),
      columnHelper.accessor('organization_id', {
        header: 'Organization ID',
        cell: ({ row }) => <Typography color='text.primary'> {row.original.organization_id} </Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-3'>
              <Chip
                variant='tonal'
                label={row.original.status}
                size='small'
                color={row.original.status === 'active' ? 'success' : 'default'}
                className='capitalize'
              />
            </div>
          )
        }
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => handleDeleteClick(row.original)} disabled={isPending}>
              {isPending ? (
                <i className='ri-loader-4-line text-textSecondary animate-spin' />
              ) : (
                <i className='ri-delete-bin-7-line text-textSecondary' />
              )}
            </IconButton>
            <IconButton>
              {/* <Link href={getLocalizedUrl(`/apps/user/view/${row.original.id}`, locale)} className='flex'> */}
              <Link href={getLocalizedUrl(`/administrators/admins/${row.original.id}`, locale)} className='flex'>
                <i className='ri-eye-line text-textSecondary' />
              </Link>
            </IconButton>
            <OpenDialogOnElementClick
              element={IconButton}
              elementProps={{
                color: 'primary',
                children: <i className='ri-edit-box-line text-textSecondary' />
              }}
              dialog={EditUserInfo}
              dialogProps={{ data: data, currentAdmin: row.original }}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      // globalFilter
      searchQuery
    },
    // initialState: {
    //   pagination: {
    //     pageSize: 10
    //   }
    // },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    // onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  // const getAvatar = params => {
  //   const { avatar, fullName } = params

  //   if (avatar) {
  //     return <CustomAvatar src={avatar} skin='light' size={34} />
  //   } else {
  //     return (
  //       <CustomAvatar skin='light' size={34}>
  //         {getInitials(fullName)}
  //       </CustomAvatar>
  //     )
  //   }
  // }

  return (
    <>
      {/* Custom Delete Confirmation Dialog */}
      <Dialog fullWidth maxWidth='xs' open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i className='ri-error-warning-line text-[88px] mbe-6 text-warning' />
          <Typography variant='h4'>Are you sure?</Typography>
          <Typography color='text.primary'>You won't be able to revert this administrator!</Typography>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' color='error' onClick={() => handleDeleteConfirm(true)} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Yes, Delete Admin!'}
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handleDeleteConfirm(false)} disabled={isPending}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Card>
        <CardHeader title='Filters' />
        <TableFilters setData={setFilteredData} tableData={data} perPage={perPage} onPerPageChange={onPerPageChange} />
        <Divider />

        {/* Error display for delete operations */}
        {errorState && (
          <Alert severity='error' sx={{ mx: 5, mb: 2 }}>
            {errorState?.response?.data?.error ||
              errorState?.response?.data?.message ||
              'Failed to delete administrator. Please try again.'}
          </Alert>
        )}

        <div className='flex justify-between p-5 gap-4 flex-col items-start sm:flex-row sm:items-center'>
          <div className='flex items-center gap-x-4 gap-4 flex-col max-sm:is-full sm:flex-row justify-start'>
            <DebouncedInput
              value={searchQuery ?? ''}
              // onChange={value => setGlobalFilter(String(value))}
              onChange={value => setSearchQuery(String(value))}
              placeholder='Search Admin'
              className='max-sm:is-full'
            />
            <Button
              color='secondary'
              variant='outlined'
              className='max-sm:is-full'
              onClick={() => setSearchQuery('')}
              // sx={{ height: '45px', gap: 1.5 }}
            >
              Clear
              <i className='ri-filter-line'></i>
            </Button>
          </div>
          <div className='flex items-center gap-x-4 gap-4 flex-col max-sm:is-full sm:flex-row justify-start'>
            <Button variant='contained' onClick={() => setAddUserOpen(!addUserOpen)} className='max-sm:is-full'>
              Add New Admin
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map(row => {
                  return (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            )}
          </table>
        </div>
        <div className='flex justify-between items-center p-4 border-t'>
          <div className='text-sm text-gray-600'>
            Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, tableData?.total_count)} of{' '}
            {tableData?.total_count} results
          </div>
          <CustomPagination
            page={page}
            perPage={perPage}
            totalCount={tableData?.total_count || 0}
            onPageChange={onPageChange}
          />
        </div>
      </Card>
      <AddUserDrawer open={addUserOpen} handleClose={()  => setAddUserOpen(!addUserOpen)} />
    </>
  )
}

export default UserListTable
