import { baseApi } from '@/shared/api'

import type { Route } from '../model/types'
import {
  createMockRoute,
  updateMockRoute,
  getMockRoutePoints,
  getMockRoutes,
} from './mockRouteSource'
import { mockRouteTimelines } from './mockRouteTimelines'
import type {
  CreateRouteInput,
  RouteTimelineItem,
  UpdateRouteInput,
} from './types'

const waitForMockResponse = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 150))

const routeApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Route'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getRoutes: build.query<Route[], void>({
        providesTags: ['Route'],
        queryFn: async () => {
          await waitForMockResponse()
          return { data: getMockRoutes() }
        },
      }),
      getRoutePoints: build.query<Route['startPoint'][], void>({
        queryFn: async () => {
          await waitForMockResponse()
          return { data: getMockRoutePoints() }
        },
      }),
      createRoute: build.mutation<Route, CreateRouteInput>({
        queryFn: async (input) => {
          await waitForMockResponse()
          return { data: createMockRoute(input) }
        },
        invalidatesTags: ['Route'],
      }),
      updateRoute: build.mutation<Route, UpdateRouteInput>({
        queryFn: async (input) => {
          await waitForMockResponse()
          const route = updateMockRoute(input)
          return route
            ? { data: route }
            : { error: { status: 404, message: 'Маршрут не найден' } }
        },
        invalidatesTags: (result) => (result ? ['Route'] : []),
      }),
      getRouteById: build.query<Route, string>({
        providesTags: ['Route'],
        queryFn: async (id) => {
          await waitForMockResponse()
          const route = getMockRoutes().find((item) => item.id === id)
          return route
            ? { data: route }
            : { error: { status: 404, message: 'Маршрут не найден' } }
        },
      }),
      getRouteTimeline: build.query<RouteTimelineItem[], string>({
        queryFn: async (id) => {
          await waitForMockResponse()
          if (!getMockRoutes().some((route) => route.id === id)) {
            return { error: { status: 404, message: 'Маршрут не найден' } }
          }
          // Defensive fallback for incomplete mock data, not a status-event domain rule.
          const timeline = Object.hasOwn(mockRouteTimelines, id)
            ? mockRouteTimelines[id]
            : []
          return { data: timeline }
        },
      }),
    }),
  })

export const {
  useGetRoutesQuery,
  useGetRoutePointsQuery,
  useCreateRouteMutation,
  useUpdateRouteMutation,
  useGetRouteByIdQuery,
  useGetRouteTimelineQuery,
} = routeApi
