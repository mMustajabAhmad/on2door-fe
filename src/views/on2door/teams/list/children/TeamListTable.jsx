'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

//Component Imports
import OpenDialogOnElementClick from '@components/on2door/dialogs/OpenDialogOnElementClick'
import CreateTeamDialog from '@/components/on2door/dialogs/team/create'
import EditTeamDialog from '@/components/on2door/dialogs/team/update'
import DeleteTeamDialog from '@/components/on2door/dialogs/team/delete'

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
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import TableFilters from './TeamFilters'
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

const TeamListTable = ({
  tableData,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  searchQuery,
  setSearchQuery,
  hubFilter,
  onHubFilterChange
}) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState(data)
  const [rowSelection, setRowSelection] = useState({})

  // Hooks
  const { lang: locale } = useParams()

  // Transform API data to match expected format
  const transformApiData = apiData => {
    if (!apiData?.teams?.data) return []

    return apiData.teams.data.map(team => {
      const t = team.attributes || team

      return {
        id: team.id,
        name: t.name || 'N/A',
        hub_id: t.hub_id || null,
        hub_name: t.hub?.attributes?.name || t.hub?.name || (t.hub_id ? `Hub ${t.hub_id}` : 'No Hub Assigned'),
        dispatchers_count: t.dispatchers_count || 0,
        drivers_count: t.drivers_count || 0,
        organization_id: t.organization_id
      }
    })
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
      columnHelper.accessor('name', {
        header: 'Team Name',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.name}
          </Typography>
        )
      }),
      columnHelper.accessor('hub_name', {
        header: 'Hub',
        cell: ({ row }) => {
          const hasHub = row.original.hub_id && row.original.hub_id !== null
          const hubName = row.original.hub_name || 'No Hub Assigned'

          return (
            <Chip
              label={hubName}
              color={hasHub ? 'primary' : 'default'}
              variant={hasHub ? 'filled' : 'outlined'}
              size='small'
            />
          )
        }
      }),
      columnHelper.accessor('dispatchers_count', {
        header: 'Dispatchers',
        cell: ({ row }) => <Typography>{row.original.dispatchers_count}</Typography>
      }),
      columnHelper.accessor('drivers_count', {
        header: 'Drivers',
        cell: ({ row }) => <Typography>{row.original.drivers_count}</Typography>
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
              dialog={DeleteTeamDialog}
              dialogProps={{
                itemToDelete: row.original,
                data: data
              }}
            />
            <IconButton>
              <Link href={getLocalizedUrl(`/teams/${row.original.id}`, locale)} className='flex'>
                <i className='ri-eye-line text-textSecondary' />
              </Link>
            </IconButton>
            <OpenDialogOnElementClick
              element={IconButton}
              elementProps={{
                color: 'primary',
                children: <i className='ri-edit-box-line text-textSecondary' />
              }}
              dialog={EditTeamDialog}
              dialogProps={{ currentTeam: row.original }}
            />
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
    <>
      <Card>
        <CardHeader title='Teams' />
        <TableFilters
          perPage={perPage}
          onPerPageChange={onPerPageChange}
          hubFilter={hubFilter}
          onHubFilterChange={onHubFilterChange}
        />
        <Divider />

        <div className='flex justify-between p-5 gap-4 flex-col items-start sm:flex-row sm:items-center'>
          <div className='flex items-center gap-x-4 gap-4 flex-col max-sm:is-full sm:flex-row justify-start'>
            <DebouncedInput
              value={searchQuery ?? ''}
              onChange={value => setSearchQuery(String(value))}
              placeholder='Search Team'
              className='max-sm:is-full'
            />
            <Button color='secondary' variant='outlined' className='max-sm:is-full' onClick={() => setSearchQuery('')}>
              Clear
              <i className='ri-filter-line'></i>
            </Button>
          </div>
          <div className='flex items-center gap-x-4 gap-4 flex-col max-sm:is-full sm:flex-row justify-start'>
            <Button variant='contained' onClick={() => setAddUserOpen(true)} className='max-sm:is-full'>
              Add New Team
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
            {(() => {
              const totalCount =
                tableData?.teams?.meta?.total_count ||
                tableData?.teams?.meta?.total ||
                tableData?.teams?.length ||
                tableData?.teams?.data?.length ||
                0
              const start = (page - 1) * perPage + 1
              const end = Math.min(page * perPage, totalCount)
              return `Showing ${start} to ${end} of ${totalCount} results`
            })()}
          </div>
          <CustomPagination
            page={page}
            perPage={perPage}
            totalCount={
              tableData?.teams?.meta?.total_count ||
              tableData?.teams?.meta?.total ||
              tableData?.teams?.length ||
              tableData?.teams?.data?.length ||
              0
            }
            onPageChange={onPageChange}
          />
        </div>
      </Card>
      <CreateTeamDialog open={addUserOpen} setOpen={setAddUserOpen} />
    </>
  )
}

export default TeamListTable
