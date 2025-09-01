'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

//Component Imports
import OpenDialogOnElementClick from '@components/on2door/dialogs/OpenDialogOnElementClick'
import CreateAdminDialog from '@/components/on2door/dialogs/administrators/admin/create'
import EditAdminDialog from '@/components/on2door/dialogs/administrators/admin/update'
import DeleteAdministratorDialog from '@/components/on2door/dialogs/administrators/delete'

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

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import AdminFilters from './AdminFilters'
import CustomPagination from '@components/on2door/shared/CustomPagination'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

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
  const [isUserTyping, setIsUserTyping] = useState(false)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  useEffect(() => {
    if (isUserTyping) {
      const timeout = setTimeout(() => {
        onChange(value)
        setIsUserTyping(false)
      }, debounce)

      return () => clearTimeout(timeout)
    }
  }, [value, onChange, isUserTyping, debounce])

  const handleInputChange = e => {
    setValue(e.target.value)
    setIsUserTyping(true)
  }

  return <TextField {...props} value={value} onChange={handleInputChange} size='small' />
}

// Column Definitions
const columnHelper = createColumnHelper()

const AdminListTable = ({
  tableData,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  searchQuery,
  setSearchQuery,
  role,
  onRoleChange,
  status,
  onStatusChange
}) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})

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
    }))
  }

  const [data, setData] = useState(transformApiData(tableData))
  const [filteredData, setFilteredData] = useState(data)

  // Update data when tableData changes
  useEffect(() => {
    const transformedData = transformApiData(tableData)
    setData(transformedData)
    setFilteredData(transformedData)
  }, [tableData])

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
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.fullName}
              </Typography>
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
      // columnHelper.accessor('phone_number', {
      //   header: 'Phone',
      //   cell: ({ row }) => <Typography color='text.primary'> {row.original.phone_number} </Typography>
      // }),
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
            <OpenDialogOnElementClick
              element={IconButton}
              elementProps={{
                children: <i className='ri-delete-bin-7-line text-textSecondary' />
              }}
              dialog={DeleteAdministratorDialog}
              dialogProps={{
                itemToDelete: row.original,
                data: tableData
              }}
            />
            <IconButton>
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
              dialog={EditAdminDialog}
              dialogProps={{ data: data, currentAdmin: row.original }}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
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
      searchQuery
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      <Card>
        <CardHeader title='Filters' />
        <AdminFilters
          setData={setFilteredData}
          tableData={data}
          perPage={perPage}
          onPerPageChange={onPerPageChange}
          role={role}
          onRoleChange={onRoleChange}
          status={status}
          onStatusChange={onStatusChange}
        />
        <Divider />

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
            <Button variant='contained' onClick={() => setAddUserOpen(true)} className='max-sm:is-full'>
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
      <CreateAdminDialog open={addUserOpen} setOpen={setAddUserOpen} />
    </>
  )
}

export default AdminListTable
