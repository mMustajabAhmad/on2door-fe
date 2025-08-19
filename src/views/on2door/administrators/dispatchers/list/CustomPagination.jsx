import Button from '@mui/material/Button'

const CustomPagination = ({ page, perPage, totalCount, onPageChange }) => {
  const totalPages = Math.ceil((totalCount || 0) / perPage)
  if (totalPages <= 1) return null

  const pages = []
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (page <= 4) {
      for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
        pages.push(i)
      }
      if (totalPages > 5) pages.push('...')
    } else if (page >= totalPages - 3) {
      if (totalPages > 5) pages.push('...')
      for (let i = Math.max(2, totalPages - 4); i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push('...')
      for (let i = page - 1; i <= page + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
    }
    if (totalPages > 1) pages.push(totalPages)
  }

  return (
    <div className='flex gap-2 items-center'>
      <Button variant='outlined' size='small' disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      {pages.map((pageNum, index) => (
        <div key={index}>
          {pageNum === '...' ? (
            <span className='px-2 text-gray-500'>...</span>
          ) : (
            <Button
              variant={pageNum === page ? 'contained' : 'outlined'}
              size='small'
              onClick={() => onPageChange(pageNum)}
              className='min-w-[40px]'
            >
              {pageNum}
            </Button>
          )}
        </div>
      ))}
      <Button variant='outlined' size='small' disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </div>
  )
}

export default CustomPagination
