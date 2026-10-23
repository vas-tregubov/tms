import type { ThHTMLAttributes } from 'react'

type TableCellProps = ThHTMLAttributes<HTMLTableCellElement> & {
  header?: boolean
}

const TableCell = ({
  children,
  className = '',
  header = false,
  scope,
  ...props
}: TableCellProps) => {
  const Component = header ? 'th' : 'td'

  return (
    <Component
      {...props}
      scope={scope ?? (header ? 'col' : undefined)}
      className={`h-10 border-b border-border px-3 py-0 text-left align-middle text-sm leading-5 whitespace-nowrap ${header ? 'bg-surface-muted font-medium text-muted' : 'bg-surface font-normal text-foreground hover:bg-surface-muted'} ${className}`}
    >
      {children}
    </Component>
  )
}

export default TableCell
