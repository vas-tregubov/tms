import type { ButtonHTMLAttributes } from 'react'

type PaginationItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isCurrent?: boolean
}

const PaginationItem = ({
  children,
  className = '',
  isCurrent = false,
  type = 'button',
  ...props
}: PaginationItemProps) => (
  <button
    {...props}
    type={type}
    aria-current={isCurrent ? 'page' : undefined}
    className={`inline-flex size-8 shrink-0 items-center justify-center rounded-control border text-sm leading-5 font-normal transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-muted disabled:text-muted ${isCurrent ? 'border-primary bg-primary text-surface focus-visible:inset-ring focus-visible:inset-ring-surface' : 'border-border bg-surface text-foreground enabled:hover:bg-surface-muted focus-visible:border-primary focus-visible:bg-surface-muted'} ${className}`}
  >
    {children}
  </button>
)

export default PaginationItem
