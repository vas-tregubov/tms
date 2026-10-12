import type { RouteStatus } from '../model/types'

type RouteStatusBadgeProps = {
  status: RouteStatus
}

const statusClasses: Record<RouteStatus, string> = {
  created: 'bg-status-created-soft',
  assigned: 'bg-status-assigned-soft',
  'in-transit': 'bg-status-in-transit-soft',
  completed: 'bg-status-completed-soft',
}

const statusLabels: Record<RouteStatus, string> = {
  created: 'Создан',
  assigned: 'Назначен',
  'in-transit': 'В пути',
  completed: 'Завершён',
}

const RouteStatusBadge = ({ status }: RouteStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-control px-2 py-1 text-xs leading-4 font-normal text-foreground ${statusClasses[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}

export default RouteStatusBadge
