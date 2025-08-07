'use client'

// React Imports
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
// Component Imports
import AdminList from '@views/on2door/administrators/admins/list'

// API Imports
import { getAdministratorsApi } from '@/app/api/on2door/actions'

const UserListApp = () => {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const { data, isLoading, error } = useQuery({
    queryKey: ['administrators', page, perPage],
    queryFn: () => {
      const payload = {
        administrator_type: 'admin',
        page,
        per_page: perPage
      }

      return getAdministratorsApi(payload)
    }
  })

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage)
    setPage(1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="ri-loader-4-line text-6xl text-blue-500 mb-4 animate-spin"></i>
          <h2 className="text-xl font-semibold mb-2">Loading Admins...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
          <h2 className="text-xl font-semibold mb-2">Failed to load administrators</h2>
        </div>
      </div>
    )
  }

  return <AdminList userData={data} page={page} perPage={perPage} onPageChange={handlePageChange} onPerPageChange={handlePerPageChange} />
}

export default UserListApp
