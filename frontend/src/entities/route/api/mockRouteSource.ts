import type { Route } from '../model/types'
import { mockRoutes } from './mockRoutes'
import type { CreateRouteInput } from './types'

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
