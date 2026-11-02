import type { ComponentProps } from 'react'

import type StatusBadge from '@/shared/ui/status-badge'

// Presentation mapping for the existing StatusBadge, not a domain status enum.
export const ROUTE_STATUS_OPTIONS = [
  { value: 'created', label: 'Создан' },
  { value: 'assigned', label: 'Назначен' },
  { value: 'intransit', label: 'В пути' },
  { value: 'completed', label: 'Завершён' },
] as const satisfies readonly {
  value: ComponentProps<typeof StatusBadge>['status']
  label: string
}[]
