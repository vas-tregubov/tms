import type { RouteStatusRecord } from './types'

const author = 'Алексей Петров'

// Fixed recorded event instants, independent of planned Route acceptance windows.
// The explicit offsets preserve the existing fixture wall times, not a scheduling zone policy.
export const mockRouteTimelines: Record<string, RouteStatusRecord[]> = {
  'route-001': [
    {
      status: 'created',
      occurredAt: '2026-11-01T10:24:00+03:00',
      author,
    },
    {
      status: 'assigned',
      occurredAt: '2026-11-01T14:15:00+03:00',
      author,
    },
  ],
  'route-002': [
    {
      status: 'created',
      occurredAt: '2026-11-01T16:10:00+03:00',
      author,
    },
  ],
  'route-003': [
    {
      status: 'created',
      occurredAt: '2026-10-31T10:24:00+03:00',
      author,
    },
    {
      status: 'assigned',
      occurredAt: '2026-10-31T14:15:00+03:00',
      author,
    },
    {
      status: 'intransit',
      occurredAt: '2026-11-01T08:45:00+03:00',
      author,
    },
    {
      status: 'completed',
      occurredAt: '2026-11-01T10:35:00+03:00',
      author,
    },
  ],
}
