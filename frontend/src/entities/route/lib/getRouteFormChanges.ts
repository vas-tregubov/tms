import type { RouteEditableFields } from '../api/types'
import type { RouteFormValues } from '../model/form'
import type { Route } from '../model/types'

// Form controls store IDs; the current mock API accepts complete point values.
export const getRouteFormChanges = (
  draft: RouteFormValues,
  points: Route['startPoint'][],
): RouteEditableFields | undefined => {
  const startPoint = points.find((point) => point.id === draft.startPointId)
  const endPoint = points.find((point) => point.id === draft.endPointId)
  if (!startPoint || !endPoint) return undefined

  return {
    date: draft.date,
    startPoint,
    endPoint,
    startTime: draft.startTime,
    endTime: draft.endTime,
    comment: draft.comment || undefined,
  }
}
