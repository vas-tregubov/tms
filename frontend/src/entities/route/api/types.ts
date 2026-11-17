import type { Route, RouteStatus } from '../model/types'

// Read-only status history DTO, independent of timeline presentation.
export type RouteStatusRecord = {
  status: RouteStatus
  occurredAt: string
  author: string
  comment?: string | null
}

export type RouteEditableFields = Pick<
  Route,
  'date' | 'startPoint' | 'endPoint' | 'startTime' | 'endTime' | 'comment'
>

export type CreateRouteInput = RouteEditableFields

export type UpdateRouteInput = {
  id: string
  changes: Partial<RouteEditableFields>
}
