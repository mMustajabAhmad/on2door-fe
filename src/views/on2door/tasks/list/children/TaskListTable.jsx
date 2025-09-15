'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

//Component Imports
import OpenDialogOnElementClick from '@components/on2door/dialogs/OpenDialogOnElementClick'
import DeleteTaskDialog from '@/components/on2door/dialogs/task/delete'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'

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
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import TaskFilters from './TaskFilters'
import CustomPagination from '@components/on2door/shared/CustomPagination'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

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

const DebouncedInput = ({ value: initialValue, onChange, debounce = 3000, ...props }) => {
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

const TaskListTable = ({
  tableData,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  searchQuery,
  setSearchQuery,
  state,
  onStateChange
}) => {
  const router = useRouter()
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState(data)
  const [rowSelection, setRowSelection] = useState({})

  // Hooks
  const { lang: locale } = useParams()

  // Transform API data to match expected format
  const transformApiData = apiData => {
    if (!apiData?.tasks?.data) return []
    // console.log('API Data:', apiData)
    return apiData.tasks.data.map(task => ({
      id: task.id,
      task_name: `${task.attributes?.short_id || task.id} - ${task.attributes?.recipient_attributes?.name || 'Unknown Recipient'}`,
      state: task.attributes?.state || 'N/A',
      created_at: task.attributes?.created_at.split('T')[0] || 'N/A',
      driver_id: task.attributes?.driver_id || 'Unassigned',
      team_id: task.attributes?.team_id || 'Un-assigned',
      recipient_id: task.attributes?.recipient_id || 'N/A'
    }))
  }

  // Update data when tableData changes
  useEffect(() => {
    const transformedData = transformApiData(tableData)
    setData(transformedData)
    setFilteredData(transformedData)
  }, [tableData])

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
      columnHelper.accessor('task_name', {
        header: 'Task Name',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.task_name}
          </Typography>
        )
      }),
      columnHelper.accessor('state', {
        header: 'State',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.state}
          </Typography>
        )
      }),
      columnHelper.accessor('created_at', {
        header: 'Created At',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.created_at}
          </Typography>
        )
      }),
      columnHelper.accessor('driver_id', {
        header: 'Driver ID',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.driver_id}
          </Typography>
        )
      }),
      columnHelper.accessor('team_id', {
        header: 'Team ID',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.team_id}
          </Typography>
        )
      }),
      columnHelper.accessor('recipient_id', {
        header: 'Recipient ID',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.recipient_id}
          </Typography>
        )
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
              dialog={DeleteTaskDialog}
              dialogProps={{
                data: tableData,
                itemToDelete: row.original
              }}
            />
            <IconButton>
              <Link href={getLocalizedUrl(`/tasks/${row.original.id}`, locale)} className='flex'>
                <i className='ri-eye-line text-textSecondary' />
              </Link>
            </IconButton>
            <IconButton color='primary' onClick={() => router.push(`/tasks/update/${row.original.id}`)}>
              <i className='ri-edit-box-line text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    [data, locale]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card>
      <CardHeader title='Tasks' />
      <TaskFilters
        perPage={perPage}
        onPerPageChange={onPerPageChange}
        state={state}
        onStateChange={onStateChange}
      />
      <Divider />

      <div className='flex justify-between p-5 gap-4 flex-col items-start sm:flex-row sm:items-center'>
        <div className='flex items-center gap-x-4 gap-4 flex-col max-sm:is-full sm:flex-row justify-start'>
          <DebouncedInput
            value={searchQuery ?? ''}
            onChange={value => setSearchQuery(String(value))}
            placeholder='Search Task'
            className='max-sm:is-full'
          />
          <Button color='secondary' variant='outlined' className='max-sm:is-full' onClick={() => setSearchQuery('')}>
            Clear
            <i className='ri-filter-line'></i>
          </Button>
        </div>
        <div className='flex items-center gap-x-4 gap-4 flex-col max-sm:is-full sm:flex-row justify-start'>
          <Button variant='contained' className='max-sm:is-full' onClick={() => router.push('/tasks/create')}>
            Add New Task
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
  )
}

export default TaskListTable
