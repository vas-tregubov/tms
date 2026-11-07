import type { PropsWithChildren } from 'react'
import { act, cleanup, renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import {
  useGetRouteByIdQuery,
  useUpdateRouteMutation,
  useGetRoutesQuery,
  useGetRouteTimelineQuery,
} from '@/entities/route'
import { useGetTripByIdQuery, useGetTripsQuery } from '@/entities/trip'
import { baseApi } from '@/shared/api'

import { store } from './store'

// Incomplete timeline fixtures are isolated to this test file.
vi.mock('@/entities/route/api/mockRouteTimelines', () => ({
  mockRouteTimelines: {},
}))

const wrapper = ({ children }: PropsWithChildren) => (
  <Provider store={store}>{children}</Provider>
)

beforeEach(() => vi.useFakeTimers())

afterEach(() => {
  cleanup()
  store.dispatch(baseApi.util.resetApiState())
  vi.clearAllTimers()
  vi.useRealTimers()
})

it('loads consistent Routes and Trips lists asynchronously through the app store', async () => {
  const { result } = renderHook(
    () => ({ routes: useGetRoutesQuery(), trips: useGetTripsQuery() }),
    { wrapper },
  )

  expect(result.current.routes.isLoading).toBe(true)
  expect(result.current.trips.isLoading).toBe(true)
  expect(result.current.routes.data).toBeUndefined()

  await act(async () => {
    await vi.advanceTimersByTimeAsync(200)
  })

  expect(result.current.routes.isSuccess).toBe(true)
  expect(result.current.trips.isSuccess).toBe(true)
  const routes = result.current.routes.data!
  const trips = result.current.trips.data!
  expect(routes.length).toBeGreaterThan(0)
  expect(trips.length).toBeGreaterThan(0)
  for (const trip of trips) {
    for (const route of trip.routes) {
      const listedRoute = routes.find((item) => item.id === route.id)
      expect(listedRoute).toBeDefined()
      // Nested Trip snapshots may omit optional detail-only fields such as comment.
      expect(route).toMatchObject({
        id: listedRoute!.id,
        number: listedRoute!.number,
        date: listedRoute!.date,
        startPoint: listedRoute!.startPoint,
        endPoint: listedRoute!.endPoint,
        startTime: listedRoute!.startTime,
        endTime: listedRoute!.endTime,
        status: listedRoute!.status,
      })
    }
  }
})

it('returns the entity requested by its opaque Route or Trip ID', async () => {
  const { result } = renderHook(
    () => ({
      route: useGetRouteByIdQuery('route-002'),
      trip: useGetTripByIdQuery('trip-002'),
    }),
    { wrapper },
  )

  await act(async () => {
    await vi.advanceTimersByTimeAsync(200)
  })

  expect(result.current.route.isSuccess).toBe(true)
  expect(result.current.route.data?.id).toBe('route-002')
  expect(result.current.trip.isSuccess).toBe(true)
  expect(result.current.trip.data?.id).toBe('trip-002')
})

it('returns deterministic not-found errors instead of successful undefined data', async () => {
  const { result } = renderHook(
    () => ({
      route: useGetRouteByIdQuery('missing-route'),
      timeline: useGetRouteTimelineQuery('missing-route'),
      trip: useGetTripByIdQuery('missing-trip'),
    }),
    { wrapper },
  )

  expect(result.current.route.isLoading).toBe(true)
  expect(result.current.trip.isLoading).toBe(true)

  await act(async () => {
    await vi.advanceTimersByTimeAsync(200)
  })

  expect(result.current.route.isError).toBe(true)
  expect(result.current.route.error).toEqual({
    status: 404,
    message: 'Маршрут не найден',
  })
  expect(result.current.route.data).toBeUndefined()
  expect(result.current.timeline.isError).toBe(true)
  expect(result.current.timeline.error).toEqual({
    status: 404,
    message: 'Маршрут не найден',
  })
  expect(result.current.timeline.data).toBeUndefined()
  expect(result.current.trip.isError).toBe(true)
  expect(result.current.trip.error).toEqual({
    status: 404,
    message: 'Рейс не найден',
  })
  expect(result.current.trip.data).toBeUndefined()
})

it('returns a successful empty timeline for an existing Route with no mock timeline entry', async () => {
  const { result } = renderHook(
    () => ({
      route: useGetRouteByIdQuery('route-002'),
      timeline: useGetRouteTimelineQuery('route-002'),
    }),
    { wrapper },
  )

  await act(async () => {
    await vi.advanceTimersByTimeAsync(200)
  })

  expect(result.current.route.data?.id).toBe('route-002')
  expect(result.current.timeline.isSuccess).toBe(true)
  expect(result.current.timeline.data).toEqual([])
  expect(result.current.timeline.error).toBeUndefined()
})

it('rejects direct updates to completed Routes without changing stored data', async () => {
  const { result } = renderHook(
    () => ({
      route: useGetRouteByIdQuery('route-003'),
      mutation: useUpdateRouteMutation(),
    }),
    { wrapper },
  )
  await act(async () => {
    await vi.advanceTimersByTimeAsync(200)
  })
  const original = result.current.route.data!
  await act(async () => {
    const request = result.current.mutation[0]({
      id: original.id,
      changes: { ...original, date: '2026-12-01' },
    })
    await vi.advanceTimersByTimeAsync(200)
    expect(await request).toEqual({
      error: {
        status: 409,
        message: 'Завершённый маршрут нельзя редактировать',
      },
    })
  })
  await act(async () => {
    const request = result.current.route.refetch()
    await vi.advanceTimersByTimeAsync(200)
    await request
  })
  expect(result.current.route.data).toEqual(original)
})
