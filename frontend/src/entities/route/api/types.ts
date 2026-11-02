import type { ComponentProps } from 'react'

import type { TimelineItem } from '@/shared/ui/status-timeline'

// Temporary Details UI projection, not a RouteStatusEvent/audit-log contract.
export type RouteTimelineItem = {
  status: string
  dateTime: string
  author: string
  state: NonNullable<ComponentProps<typeof TimelineItem>['state']>
}
