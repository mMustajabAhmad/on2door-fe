'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Component Imports
import EditHubDialog from '@/components/on2door/dialogs/hub/update'
import DeleteHubDialog from '@/components/on2door/dialogs/hub/delete'
import CreateHubDialog from '@/components/on2door/dialogs/hub/create'
import OpenDialogOnElementClick from '@/components/on2door/dialogs/OpenDialogOnElementClick'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel
} from '@tanstack/react-table'

// Component Imports
import HubFilters from './HubFilters'
import CustomPagination from '@/components/on2door/shared/CustomPagination'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 3000, ...props }) => {
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

const HubListTable = ({
  tableData,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  searchQuery,
  setSearchQuery,
  city,
  onCityChange,
  state,
  onStateChange,
  country,
  onCountryChange,
  hasTeams,
  onHasTeamsChange
}) => {
  // States
  const [addHubOpen, setAddHubOpen] = useState(false)

  // Hooks
  const { lang: locale } = useParams()

  // Transform API data to match expected format
  const transformApiData = apiData => {
    if (!apiData?.hubs?.data) return []

    return apiData.hubs.data.map(hub => {
      const hubAttributes = hub.attributes || hub
      const address = hubAttributes.address || {}
      const teamIds = hubAttributes.team_ids || []

      return {
        id: hub.id,
        name: hubAttributes.name || 'N/A',
        street: address.street || '',
        city: address.city || 'N/A',
        state: address.state || 'N/A',
        postal_code: address.postal_code || '',
        country: address.country || 'N/A',
        fullAddress:
          [address.street, address.city, address.state, address.postal_code, address.country]
            .filter(Boolean)
            .join(', ') || 'No address provided',
        team_ids: teamIds
      }
    })
  }

  const [data, setData] = useState(transformApiData(tableData))
  const [filteredData, setfilteredData] = useState(data)

  // Update data when tableData changes
  useEffect(() => {
    const transformedData = transformApiData(tableData)
    setData(transformedData)
    setfilteredData(transformedData)
  }, [tableData])

  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Hub Name',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.name}
          </Typography>
        )
      }),
      columnHelper.accessor('city', {
        header: 'City',
        cell: ({ row }) => <Typography>{row.original.city}</Typography>
      }),
      columnHelper.accessor('state', {
        header: 'State',
        cell: ({ row }) => <Typography>{row.original.state}</Typography>
      }),
      columnHelper.accessor('country', {
        header: 'Country',
        cell: ({ row }) => <Typography>{row.original.country}</Typography>
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
              dialog={DeleteHubDialog}
              dialogProps={{
                itemToDelete: row.original,
                data: tableData
              }}
            />
            <IconButton>
              <Link href={getLocalizedUrl(`/hubs/${row.original.id}`, locale)} className='flex'>
                <i className='ri-eye-line text-textSecondary' />
              </Link>
            </IconButton>
            <OpenDialogOnElementClick
              element={IconButton}
              elementProps={{
                color: 'primary',
                children: <i className='ri-edit-box-line text-textSecondary' />
              }}
              dialog={EditHubDialog}
              dialogProps={{ currentHub: row.original }}
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
      searchQuery
    },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setSearchQuery,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  if (!tableData) {
    return (
      <Card>
        <CardContent className='flex justify-center items-center h-64'>
          <div className='text-center'>
            <CircularProgress />
            <Typography className='mt-4'>Loading hubs...</Typography>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader title='Filters' />
        <HubFilters
          perPage={perPage}
          onPerPageChange={onPerPageChange}
          city={city}
          onCityChange={onCityChange}
          state={state}
          onStateChange={onStateChange}
          country={country}
          onCountryChange={onCountryChange}
          hasTeams={hasTeams}
          onHasTeamsChange={onHasTeamsChange}
        />
        <Divider />

        <div className='flex justify-between p-5 gap-4 flex-col items-start sm:flex-row sm:items-center'>
          <div className='flex items-center gap-x-4 gap-4 flex-col max-sm:is-full sm:flex-row justify-start'>
            <DebouncedInput
              value={searchQuery ?? ''}
              onChange={value => setSearchQuery(String(value))}
              placeholder='Search Hub'
              className='max-sm:is-full'
            />
            <Button color='secondary' variant='outlined' className='max-sm:is-full' onClick={() => setSearchQuery('')}>
              Clear
              <i className='ri-filter-line'></i>
            </Button>
          </div>
          <div className='flex items-center gap-x-4 gap-4 flex-col max-sm:is-full sm:flex-row justify-start'>
            <Button variant='contained' onClick={() => setAddHubOpen(true)} className='max-sm:is-full'>
              Add New Hub
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
      <CreateHubDialog open={addHubOpen} setOpen={setAddHubOpen} />
    </>
  )
}

export default HubListTable
