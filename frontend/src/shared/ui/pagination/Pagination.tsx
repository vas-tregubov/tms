import type { HTMLAttributes, ReactNode } from 'react'

import IconButton from '@/shared/ui/icon-button'

import PaginationItem from './PaginationItem'

type PaginationProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
  previousIcon: ReactNode
  nextIcon: ReactNode
}

const Pagination = ({
  currentPage,
  pageCount,
  onPageChange,
  previousIcon,
  nextIcon,
  className = '',
  'aria-label': ariaLabel = 'Pagination',
  ...props
}: PaginationProps) => {
  if (
    !Number.isInteger(pageCount) ||
    pageCount < 1 ||
    !Number.isInteger(currentPage) ||
    currentPage < 1 ||
    currentPage > pageCount
  ) {
    return null
  }

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={`flex items-center gap-1 ${className}`}
    >
      <IconButton
        aria-label="Previous page"
        icon={previousIcon}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="disabled:text-muted"
      />
      {Array.from({ length: pageCount }, (_, index) => {
        const page = index + 1

        return (
          <PaginationItem
            key={page}
            isCurrent={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PaginationItem>
        )
      })}
      <IconButton
        aria-label="Next page"
        icon={nextIcon}
        disabled={currentPage === pageCount}
        onClick={() => onPageChange(currentPage + 1)}
        className="disabled:text-muted"
      />
    </nav>
  )
}

export default Pagination
