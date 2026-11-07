import type { TripStatusRecord } from './types'

export const mockTripTimeline: Record<string, TripStatusRecord[]> = {
  'trip-001': [
    {
      status: 'created',
      dateTime: '01.11.2026 10:24',
      author: 'Алексей Петров',
      comment: 'Рейс создан: 2 маршрута',
    },
    {
      status: 'assigned',
      dateTime: '01.11.2026 14:15',
      author: 'Мария Соколова',
      comment: 'Назначены водитель и ТС',
    },
  ],
  'trip-002': [
    {
      status: 'created',
      dateTime: '31.10.2026 10:24',
      author: 'Алексей Петров',
      comment: 'Рейс создан: 1 маршрут',
    },
    {
      status: 'assigned',
      dateTime: '31.10.2026 14:15',
      author: 'Мария Соколова',
      comment: 'Назначены водитель и ТС',
    },
    {
      status: 'intransit',
      dateTime: '01.11.2026 08:30',
      author: 'Алексей Петров',
      comment: 'Выезд с точки отправления',
    },
    {
      status: 'completed',
      dateTime: '01.11.2026 11:00',
      author: 'Алексей Петров',
      comment: 'Рейс выполнен',
    },
  ],
}
