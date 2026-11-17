import type { TripStatusRecord } from './types'

// Fixed fixture offsets are event metadata, not a Trip scheduling zone policy.
export const mockTripTimeline: Record<string, TripStatusRecord[]> = {
  'trip-001': [
    {
      status: 'created',
      occurredAt: '2026-11-01T10:24:00+03:00',
      author: 'Алексей Петров',
      comment: 'Рейс создан: 1 маршрут',
    },
    {
      status: 'assigned',
      occurredAt: '2026-11-01T14:15:00+03:00',
      author: 'Мария Соколова',
      comment: 'Назначены водитель и ТС',
    },
  ],
  'trip-002': [
    {
      status: 'created',
      occurredAt: '2026-10-31T10:24:00+03:00',
      author: 'Алексей Петров',
      comment: 'Рейс создан: 1 маршрут',
    },
    {
      status: 'assigned',
      occurredAt: '2026-10-31T14:15:00+03:00',
      author: 'Мария Соколова',
      comment: 'Назначены водитель и ТС',
    },
    {
      status: 'intransit',
      occurredAt: '2026-11-01T08:30:00+03:00',
      author: 'Алексей Петров',
      comment: 'Выезд с точки отправления',
    },
    {
      status: 'completed',
      occurredAt: '2026-11-01T11:00:00+03:00',
      author: 'Алексей Петров',
      comment: 'Рейс выполнен',
    },
  ],
}
