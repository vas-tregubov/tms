import type { Route } from '../model/types'
import { mockRoutes } from './mockRoutes'
import type { CreateRouteInput, UpdateRouteInput } from './types'

// Session-only mock storage, independent of the UI and Redux draft.
let routes = mockRoutes
let sequence = 0
export const getMockRoutes = () => routes
export const getMockRoutePoints = (): Route['startPoint'][] =>
  Array.from(
    new Map(
      mockRoutes
        .flatMap((route) => [route.startPoint, route.endPoint])
        .map((point) => [point.id, point]),
    ).values(),
  )
export const createMockRoute = (input: CreateRouteInput): Route => {
  sequence += 1
  const route: Route = {
    ...input,
    id: `created-route-${sequence}`,
    number: `MR-${String(123 + sequence).padStart(6, '0')}`,
    status: 'created',
  }
  routes = [...routes, route]
  return route
}

export const updateMockRoute = ({
  id,
  changes,
}: UpdateRouteInput): Route | undefined => {
  const current = routes.find((route) => route.id === id)
  if (!current) return undefined
  // Explicit allowlist preserves server-owned fields even for unexpected runtime input.
  const updated: Route = {
    ...current,
    date: changes.date,
    startPoint: changes.startPoint,
    endPoint: changes.endPoint,
    startTime: changes.startTime,
    endTime: changes.endTime,
    comment: changes.comment,
  }
  routes = routes.map((route) => (route.id === id ? updated : route))
  return updated
}

// Internal mock/test boundary; never exported through the Route slice public API.
export const resetMockRouteSource = () => {
  routes = mockRoutes
  sequence = 0
}
