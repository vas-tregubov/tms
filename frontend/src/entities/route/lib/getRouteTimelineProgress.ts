import type { RouteTimelineItem } from '../api/types'
import { getRouteStatusOption, ROUTE_STATUS_OPTIONS } from './statusOptions'

// Route.status owns progress; only recorded events supply timestamps and authors.
export const getRouteTimelineProgress = (
  status: string,
  timeline: RouteTimelineItem[],
): RouteTimelineItem[] => {
  const current = getRouteStatusOption(status)
  const currentIndex = ROUTE_STATUS_OPTIONS.findIndex(
    (option) => option === current,
  )
  return ROUTE_STATUS_OPTIONS.map((option, index) => {
    const event = timeline.find(
      (item) => getRouteStatusOption(item.status) === option,
    )
    return {
      status: option.value,
      dateTime: event?.dateTime ?? '',
      author: event?.author ?? '',
      state: index <= currentIndex ? 'completed' : 'pending',
    }
  })
}
