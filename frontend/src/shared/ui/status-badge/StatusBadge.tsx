import type { ReactNode } from 'react'

export type StatusBadgeVariant = 'neutral' | 'info' | 'warning' | 'success'

type StatusBadgeProps = {
  variant: StatusBadgeVariant
  children: ReactNode
}

const variantClasses: Record<StatusBadgeVariant, string> = {
  neutral: 'bg-status-created-soft',
  info: 'bg-status-assigned-soft',
  warning: 'bg-status-in-transit-soft',
  success: 'bg-status-completed-soft',
}

const StatusBadge = ({ variant, children }: StatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-control px-2 py-1 text-xs leading-4 font-normal text-foreground ${variantClasses[variant]}`}
    >
      {children}
    </span>
  )
}

export default StatusBadge
