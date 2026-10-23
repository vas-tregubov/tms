import type { TableHTMLAttributes } from 'react'

const Table = ({
  children,
  className = '',
  ...props
}: TableHTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-auto rounded-card border border-border bg-surface">
    <table
      {...props}
      className={`w-full border-separate border-spacing-0 ${className}`}
    >
      {children}
    </table>
  </div>
)

export default Table
