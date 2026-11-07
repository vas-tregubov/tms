// Temporary Details UI projection, not a RouteStatusEvent/audit-log contract.
export type RouteTimelineItem = {
  status: string
  dateTime: string
  author: string
  state: 'completed' | 'current'
}
