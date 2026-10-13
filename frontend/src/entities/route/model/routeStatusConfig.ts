import type { StatusBadgeVariant } from '@/shared/ui/status-badge'

import type { RouteStatus } from './types'

export const routeStatusConfig: Record<
  RouteStatus,
  { variant: StatusBadgeVariant; label: string }
> = {
  created: { variant: 'neutral', label: 'Создан' },
  assigned: { variant: 'info', label: 'Назначен' },
  'in-transit': { variant: 'warning', label: 'В пути' },
  completed: { variant: 'success', label: 'Завершён' },
}
