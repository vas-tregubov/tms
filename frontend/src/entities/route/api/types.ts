import type { Route } from '../model/types'

// Temporary Details UI projection, not a RouteStatusEvent/audit-log contract.
export type RouteTimelineItem = {
  status: string
  dateTime: string
  author: string
  state: 'completed' | 'pending'
}

export type RouteEditableFields = Pick<
  Route,
  'date' | 'startPoint' | 'endPoint' | 'startTime' | 'endTime' | 'comment'
>

export type CreateRouteInput = RouteEditableFields

export type UpdateRouteInput = {
  id: string
  changes: RouteEditableFields
}
