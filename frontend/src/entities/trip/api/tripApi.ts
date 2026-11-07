import { baseApi } from '@/shared/api'

import type { Trip } from '../model/types'
import type { TripStatusRecord } from './types'
import { mockTripTimeline } from './mockTripTimeline'
import { mockTrips } from './mockTrips'

const waitForMockResponse = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 150))

const tripApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTrips: build.query<Trip[], void>({
      queryFn: async () => {
        await waitForMockResponse()
        return { data: mockTrips }
      },
    }),
    getTripTimeline: build.query<TripStatusRecord[], string>({
      queryFn: async (id) => {
        await waitForMockResponse()
        if (!mockTrips.some((trip) => trip.id === id))
          return { error: { status: 404, message: 'Рейс не найден' } }
        return {
          data: Object.hasOwn(mockTripTimeline, id) ? mockTripTimeline[id] : [],
        }
      },
    }),
    getTripById: build.query<Trip, string>({
      queryFn: async (id) => {
        await waitForMockResponse()
        const trip = mockTrips.find((item) => item.id === id)
        return trip
          ? { data: trip }
          : { error: { status: 404, message: 'Рейс не найден' } }
      },
    }),
  }),
})

export const {
  useGetTripsQuery,
  useGetTripByIdQuery,
  useGetTripTimelineQuery,
} = tripApi
