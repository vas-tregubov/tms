import type { RouteTimelineItem } from './types'

const author = 'Алексей Петров'

// Explicit mock UI values. Times are independent of Route's planned date/time.
// For Completed, marker states reproduce Figma 382:29159 (green, green, neutral, neutral).
export const mockRouteTimelines: Record<string, RouteTimelineItem[]> = {
  'route-001': [
    {
      status: 'created',
      dateTime: '01.11.2026 10:24',
      author,
      state: 'completed',
    },
    {
      status: 'assigned',
      dateTime: '01.11.2026 14:15',
      author,
      state: 'pending',
    },
  ],
  'route-002': [
    {
      status: 'created',
      dateTime: '01.11.2026 16:10',
      author,
      state: 'pending',
    },
  ],
  'route-003': [
    {
      status: 'created',
      dateTime: '31.10.2026 10:24',
      author,
      state: 'completed',
    },
    {
      status: 'assigned',
      dateTime: '31.10.2026 14:15',
      author,
      state: 'completed',
    },
    {
      status: 'intransit',
      dateTime: '01.11.2026 08:45',
      author,
      state: 'pending',
    },
    {
      status: 'completed',
      dateTime: '01.11.2026 10:35',
      author,
      state: 'pending',
    },
  ],
}
