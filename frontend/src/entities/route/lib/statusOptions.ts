import type { RouteStatus } from '../model/types'

// Domain vocabulary and UI labels; independent of generic StatusBadge props.
export const ROUTE_STATUS_OPTIONS = [
  { value: 'created', label: 'Создан' },
  { value: 'assigned', label: 'Назначен' },
  { value: 'intransit', label: 'В пути' },
  { value: 'completed', label: 'Завершён' },
] as const satisfies readonly {
  value: RouteStatus
  label: string
}[]

export const getRouteStatusOption = (status: string) =>
  ROUTE_STATUS_OPTIONS.find((option) => option.value === status)
