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
  if (!current || current.status === 'completed') return undefined
  // Explicit allowlist preserves server-owned fields even for unexpected runtime input.
  const updated: Route = {
    ...current,
    ...(changes.date !== undefined ? { date: changes.date } : {}),
    ...(changes.startPoint !== undefined
      ? { startPoint: changes.startPoint }
      : {}),
    ...(changes.endPoint !== undefined ? { endPoint: changes.endPoint } : {}),
    ...(changes.startTime !== undefined
      ? { startTime: changes.startTime }
      : {}),
    ...(changes.endTime !== undefined ? { endTime: changes.endTime } : {}),
    ...(changes.comment !== undefined ? { comment: changes.comment } : {}),
  }
  routes = routes.map((route) => (route.id === id ? updated : route))
  return updated
}

// Internal mock/test boundary; never exported through the Route slice public API.
export const resetMockRouteSource = () => {
  routes = mockRoutes
  sequence = 0
}

// Mock-only batch write: preparation validates everything; commit cannot partially fail.
export const prepareMockRouteAssignment = (ids: string[]) => {
  if (!ids.length || new Set(ids).size !== ids.length)
    throw { status: 400, message: 'Выберите маршруты без повторений.' }
  const selected = ids.map((id) => {
    const route = routes.find((item) => item.id === id)
    if (!route) throw { status: 404, message: 'Выбранный маршрут не найден.' }
    if (route.status !== 'created')
      throw {
        status: 409,
        message: `Маршрут ${route.number} уже недоступен для назначения.`,
      }
    return { ...route, status: 'assigned' as const }
  })
  const replacements = new Map(selected.map((route) => [route.id, route]))
  const next = routes.map((route) => replacements.get(route.id) ?? route)
  return {
    routes: selected,
    commit: () => {
      routes = next
    },
  }
}
