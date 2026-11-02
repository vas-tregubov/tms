import { baseApi } from '@/shared/api'

import type { Route } from '../model/types'
import { mockRoutes } from './mockRoutes'
import { mockRouteTimelines } from './mockRouteTimelines'
import type { RouteTimelineItem } from './types'

const waitForMockResponse = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 150))

const routeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRoutes: build.query<Route[], void>({
      queryFn: async () => {
        await waitForMockResponse()
        return { data: mockRoutes }
      },
    }),
    getRouteById: build.query<Route, string>({
      queryFn: async (id) => {
        await waitForMockResponse()
        const route = mockRoutes.find((item) => item.id === id)
        return route
          ? { data: route }
          : { error: { status: 404, message: 'Маршрут не найден' } }
      },
    }),
    getRouteTimeline: build.query<RouteTimelineItem[], string>({
      queryFn: async (id) => {
        await waitForMockResponse()
        const timeline = Object.hasOwn(mockRouteTimelines, id)
          ? mockRouteTimelines[id]
          : undefined
        return timeline
          ? { data: timeline }
          : { error: { status: 404, message: 'Статусы маршрута не найдены' } }
      },
    }),
  }),
})

export const {
  useGetRoutesQuery,
  useGetRouteByIdQuery,
  useGetRouteTimelineQuery,
} = routeApi
