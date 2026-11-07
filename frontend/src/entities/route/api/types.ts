import type { Route } from '../model/types'

// Temporary Details UI projection, not a RouteStatusEvent/audit-log contract.
export type RouteTimelineItem = {
  status: string
  dateTime: string
  author: string
  state: 'completed' | 'current'
}

export type CreateRouteInput = Pick<
  Route,
  'date' | 'startPoint' | 'endPoint' | 'startTime' | 'endTime' | 'comment'
>
