import { configureStore } from '@reduxjs/toolkit'
import { skipToken } from '@reduxjs/toolkit/query'
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { useGetRouteByIdQuery, useGetRoutesQuery } from '@/entities/route'
import {
  createMockRoute,
  getMockRoutes,
  resetMockRouteSource,
} from '@/entities/route/api/mockRouteSource'
import {
  useGetTripByIdQuery,
  useGetTripsQuery,
  type CreateTripInput,
} from '@/entities/trip'
import {
  getMockTrips,
  resetMockTripSource,
  saveMockTrip,
} from '@/entities/trip/api/mockTripSource'
import { baseApi } from '@/shared/api'

import { saveTripWithRoutes, useCreateTripMutation } from './createTripApi'

vi.mock('@/entities/trip/api/mockTripSource', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/entities/trip/api/mockTripSource')>()
  return { ...actual, saveMockTrip: vi.fn(actual.saveMockTrip) }
})
const actual = await vi.importActual<
  typeof import('@/entities/trip/api/mockTripSource')
>('@/entities/trip/api/mockTripSource')
const store = configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})
const wrapper = ({ children }: PropsWithChildren) => (
  <Provider store={store}>{children}</Provider>
)
beforeEach(() => {
  resetMockRouteSource()
  resetMockTripSource()
  store.dispatch(baseApi.util.resetApiState())
  vi.mocked(saveMockTrip).mockReset().mockImplementation(actual.saveMockTrip)
})
afterEach(() => {
  cleanup()
  store.dispatch(baseApi.util.resetApiState())
  resetMockRouteSource()
  resetMockTripSource()
})
const input = (routeIds = ['route-002']): CreateTripInput => ({
  date: '2026-11-03',
  startTime: '08:00',
  endTime: '20:00',
  driverId: 'driver-001',
  vehicleId: 'vehicle-001',
  routeIds,
  comment: 'Условия',
})
const anotherRoute = () => {
  const route = getMockRoutes()[1]
  return createMockRoute({
    date: route.date,
    startPoint: route.startPoint,
    endPoint: route.endPoint,
    startTime: route.startTime,
    endTime: route.endTime,
  })
}

it('saves multiple Route IDs and only changes Route status after successful Trip persistence', () => {
  const extra = anotherRoute()
  const before = getMockRoutes()
  const selected = [before[1], extra]
  const trip = saveTripWithRoutes(input(selected.map((route) => route.id)))
  expect(trip.id).toBe('created-trip-1')
  expect(trip.number).toBe('TR-000125')
  expect(trip.status).toBe('assigned')
  expect(trip.routes.map((route) => route.id)).toEqual(
    selected.map((route) => route.id),
  )
  for (const route of selected) {
    expect(getMockRoutes().find((item) => item.id === route.id)).toEqual({
      ...route,
      status: 'assigned',
    })
    expect(route.status).toBe('created')
  }
  expect(trip.routes.every((route) => route.status === 'assigned')).toBe(true)
  expect(getMockTrips().at(-1)).toEqual(trip)
  expect(getMockRoutes()[0]).toBe(before[0])
})

it.each([
  ['route-002', 'route-001'],
  ['route-002', 'route-003'],
  ['route-002', 'unknown'],
  ['route-002', 'route-002'],
  [],
])('rejects invalid selection %j without partial changes', (...ids) => {
  const beforeRoutes = getMockRoutes()
  const beforeTrips = getMockTrips()
  expect(() => saveTripWithRoutes(input(ids))).toThrow()
  expect(getMockRoutes()).toBe(beforeRoutes)
  expect(getMockRoutes()[1].status).toBe('created')
  expect(getMockTrips()).toBe(beforeTrips)
})

it('leaves Routes unchanged on persistence failure and permits retry', () => {
  const routes = getMockRoutes()
  const trips = getMockTrips()
  vi.mocked(saveMockTrip).mockImplementationOnce(() => {
    throw new Error('Mock persistence failed')
  })
  expect(() => saveTripWithRoutes(input())).toThrow('Mock persistence failed')
  expect(getMockRoutes()).toBe(routes)
  expect(getMockTrips()).toBe(trips)
  expect(saveTripWithRoutes(input()).routes[0].status).toBe('assigned')
})

it('refreshes subscribed Trip and Route queries after a successful create mutation', async () => {
  const { result } = renderHook(
    () => {
      const [create, mutation] = useCreateTripMutation()
      return {
        create,
        mutation,
        routes: useGetRoutesQuery(),
        route: useGetRouteByIdQuery('route-002'),
        trips: useGetTripsQuery(),
        trip: useGetTripByIdQuery(mutation.data?.id ?? skipToken),
      }
    },
    { wrapper },
  )
  await waitFor(() => {
    expect(result.current.route.isSuccess).toBe(true)
    expect(result.current.trips.isSuccess).toBe(true)
  })
  expect(result.current.route.data?.status).toBe('created')
  await act(async () => {
    await result.current.create(input()).unwrap()
  })
  await waitFor(() => {
    expect(result.current.route.data?.status).toBe('assigned')
    expect(
      result.current.routes.data?.find((route) => route.id === 'route-002')
        ?.status,
    ).toBe('assigned')
    expect(
      result.current.trips.data?.find(
        (trip) => trip.id === result.current.mutation.data?.id,
      )?.status,
    ).toBe('assigned')
    expect(result.current.trip.data?.status).toBe('assigned')
    expect(result.current.trip.data?.routes[0]).toMatchObject({
      id: 'route-002',
      status: 'assigned',
    })
  })
})

it.each(['driverId', 'vehicleId', 'startTime'] as const)(
  'rejects invalid %s before changing either owner',
  (field) => {
    const routes = getMockRoutes()
    const trips = getMockTrips()
    expect(() =>
      saveTripWithRoutes({ ...input(), [field]: 'missing' }),
    ).toThrow()
    expect(getMockRoutes()).toBe(routes)
    expect(getMockTrips()).toBe(trips)
  },
)
