'use client'

// React Imports
import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'


// Component Imports
import AdminList from '@views/on2door/administrators/admins/list'

// API Imports
import { getAdminsApi } from '@/app/api/on2door/actions'

const AdminListPage = () => {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['administrators', page, perPage, searchQuery, role, status],
    queryFn: () => {
      const payload = { administrator_type: 'admin', page, per_page: perPage  }

      if (searchQuery) payload['q[email_or_first_name_or_last_name_or_phone_number_cont]'] = searchQuery

      if (role) {
        if (role === 'owner') payload['q[is_account_owner_eq]'] = true
        else if (role === 'admin') payload['q[is_account_owner_eq]'] = false
      }

      if (status) payload['q[is_active_eq]'] = status === 'active' ? true : false

      return getAdminsApi(payload)
    }
  })

  const handlePageChange = newPage => setPage(newPage)

  const handlePerPageChange = newPerPage => {
    setPage(1)
    setPerPage(newPerPage)
  }

  const handleSearchChange = value => {
    setPage(1)
    setSearchQuery(value)
  }

  const handleRoleChange = value => {
    setPage(1)
    setRole(value)
  }

  const handleStatusChange = value => {
    setPage(1)
    setStatus(value)
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-loader-4-line text-6xl text-blue-500 mb-4 animate-spin'></i>
          <h2 className='text-xl font-semibold mb-2'>Loading Admins...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <i className='ri-error-warning-line text-6xl text-red-500 mb-4'></i>
          <h2 className='text-xl font-semibold mb-2'>Failed to load administrators</h2>
        </div>
      </div>
    )
  }

  return (
    <AdminList
      adminData={data}
      page={page}
      perPage={perPage}
      onPageChange={handlePageChange}
      onPerPageChange={handlePerPageChange}
      searchQuery={searchQuery}
      setSearchQuery={handleSearchChange}
      role={role}
      onRoleChange={handleRoleChange}
      status={status}
      onStatusChange={handleStatusChange}
    />
  )
}

export default AdminListPage
