type StatusBadgeStatus = 'created' | 'assigned' | 'intransit' | 'completed'

type StatusBadgeProps = {
  status: StatusBadgeStatus
}

const statusConfig: Record<
  StatusBadgeStatus,
  { className: string; label: string }
> = {
  created: { className: 'bg-status-created-soft', label: 'Создан' },
  assigned: { className: 'bg-status-assigned-soft', label: 'Назначен' },
  intransit: { className: 'bg-status-in-transit-soft', label: 'В пути' },
  completed: { className: 'bg-status-completed-soft', label: 'Завершён' },
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { className, label } = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-control px-2 py-1 text-xs leading-4 font-normal text-foreground ${className}`}
    >
      {label}
    </span>
  )
}

export default StatusBadge
