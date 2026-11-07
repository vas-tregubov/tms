// Trip presentation vocabulary is independent of Route status configuration.
export const TRIP_STATUS_OPTIONS = [
  { value: 'created', label: 'Создан' },
  { value: 'assigned', label: 'Назначен' },
  { value: 'intransit', label: 'В пути' },
  { value: 'completed', label: 'Завершён' },
] as const
export const getTripStatusOption = (status: string) =>
  TRIP_STATUS_OPTIONS.find((option) => option.value === status)
