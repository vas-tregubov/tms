import type { HTMLAttributes } from 'react'

const TableRow = ({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} className={`h-10 ${className}`}>
    {children}
  </tr>
)

export default TableRow
