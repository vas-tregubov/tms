import type { ReactNode } from 'react'

type StatusBadgeStatus = 'created' | 'assigned' | 'intransit' | 'completed'

type StatusBadgeProps = {
  status: StatusBadgeStatus
  children: ReactNode
}

const statusClasses = {
  created: 'bg-status-created-soft',
  assigned: 'bg-status-assigned-soft',
  intransit: 'bg-status-in-transit-soft',
  completed: 'bg-status-completed-soft',
}

const StatusBadge = ({ status, children }: StatusBadgeProps) => (
  <span
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-control px-2 py-1 text-xs leading-4 font-normal text-foreground ${statusClasses[status]}`}
  >
    {children}
  </span>
)

export default StatusBadge
